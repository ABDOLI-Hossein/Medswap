"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db-core.mjs";
import { hashPassword, verifyPassword } from "@/lib/password.mjs";
import { createSession, destroySession, requireRole, requireUser } from "@/lib/auth";
import { getAbsence, getCandidatureFor, getConversationFor } from "@/lib/queries";

const text = (formData, key) => String(formData.get(key) ?? "").trim();
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v);
const refresh = () => revalidatePath("/", "layout");

function notify(userId, body, href) {
  db.prepare("INSERT INTO notifications (user_id, text, href) VALUES (?, ?, ?)").run(userId, body, href);
}

function homeFor(role) {
  return role === "installe" ? "/tableau-de-bord" : "/remplacant";
}

/* ---------- Authentification ---------- */

export async function signup(_prev, formData) {
  const email = text(formData, "email").toLowerCase();
  const password = text(formData, "password");
  const firstName = text(formData, "firstName");
  const lastName = text(formData, "lastName");
  const role = text(formData, "role") === "installe" ? "installe" : "remplacant";

  if (!email.includes("@")) return { error: "Saisissez une adresse e-mail valide." };
  if (password.length < 6) return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  if (!firstName || !lastName) return { error: "Renseignez votre prénom et votre nom." };
  if (db.prepare("SELECT id FROM users WHERE email = ?").get(email)) {
    return { error: "Un compte existe déjà avec cette adresse e-mail." };
  }

  const info = db
    .prepare(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, cabinet_name, cabinet_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(email, await hashPassword(password), firstName, lastName, role, text(formData, "cabinetName"), text(formData, "cabinetAddress"));
  await createSession(info.lastInsertRowid);
  redirect(homeFor(role));
}

export async function login(_prev, formData) {
  const email = text(formData, "email").toLowerCase();
  const password = text(formData, "password");
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    return { error: "E-mail ou mot de passe incorrect." };
  }
  await createSession(row.id);
  redirect(homeFor(row.role));
}

export async function logout() {
  await destroySession();
  redirect("/connexion");
}

/* ---------- Absences (médecin installé) ---------- */

function readAbsenceForm(formData, user) {
  const start = text(formData, "start");
  const end = text(formData, "end");
  if (!isDate(start) || !isDate(end) || end < start) {
    return { error: "Vérifiez les dates : la fin doit être après le début." };
  }
  return {
    values: {
      start,
      end,
      motif: text(formData, "motif") || "Congés",
      cabinet: user.cabinetName,
      address: user.cabinetAddress,
      specialty: text(formData, "specialty") || user.specialty,
      activities: formData.getAll("activities").map(String).join(" · ") || "Consultations",
      schedule: text(formData, "schedule"),
      retrocession: text(formData, "retrocession"),
      lodging: text(formData, "lodging") || "Non proposé",
      notes: text(formData, "notes"),
    },
  };
}

function publishAbsenceRow(absenceId, owner, start, end) {
  db.prepare("UPDATE absences SET status = 'publiee' WHERE id = ?").run(absenceId);
  const remplacants = db.prepare("SELECT id FROM users WHERE role = 'remplacant'").all();
  for (const r of remplacants) {
    notify(r.id, `Nouvelle mission publiée à Lyon du ${start} au ${end}.`, `/remplacant`);
  }
}

/** Crée une absence (absenceId = null) ou met à jour un brouillon existant. Publie si l’intention est « publish ». */
export async function saveAbsence(absenceId, _prev, formData) {
  const user = await requireRole("installe");
  const parsed = readAbsenceForm(formData, user);
  if (parsed.error) return parsed;
  const v = parsed.values;
  const publish = text(formData, "intent") === "publish";
  const status = publish ? "publiee" : "brouillon";

  let id = absenceId;
  if (absenceId) {
    const existing = getAbsence(absenceId);
    if (!existing || existing.ownerId !== user.id || existing.status !== "brouillon") {
      return { error: "Ce brouillon ne peut plus être modifié." };
    }
    db.prepare(
      `UPDATE absences SET start_date=@start, end_date=@end, motif=@motif, specialty=@specialty, activities=@activities,
       schedule=@schedule, retrocession=@retrocession, lodging=@lodging, notes=@notes WHERE id=@id`,
    ).run({ ...v, id: absenceId });
  } else {
    const info = db
      .prepare(
        `INSERT INTO absences (owner_id, start_date, end_date, motif, cabinet_name, cabinet_address, specialty, activities, schedule, retrocession, lodging, notes, status)
         VALUES (@owner, @start, @end, @motif, @cabinet, @address, @specialty, @activities, @schedule, @retrocession, @lodging, @notes, 'brouillon')`,
      )
      .run({ ...v, owner: user.id });
    id = info.lastInsertRowid;
  }

  if (publish) publishAbsenceRow(id, user.id, v.start, v.end);
  refresh();
  redirect(`/absences/${id}`);
}

/** Publie un brouillon existant depuis sa fiche. */
export async function publishDraft(absenceId) {
  const user = await requireRole("installe");
  const absence = getAbsence(absenceId);
  if (!absence || absence.ownerId !== user.id || absence.status !== "brouillon") return;
  publishAbsenceRow(absenceId, user.id, absence.start, absence.end);
  refresh();
}

export async function confirmCandidature(absenceId, candidatureId) {
  const user = await requireRole("installe");
  const absence = getAbsence(absenceId);
  if (!absence || absence.ownerId !== user.id || absence.status !== "publiee") return;
  const candidature = db.prepare("SELECT * FROM candidatures WHERE id = ? AND absence_id = ?").get(candidatureId, absenceId);
  if (!candidature) return;

  const others = db.prepare("SELECT candidate_id FROM candidatures WHERE absence_id = ? AND id != ?").all(absenceId, candidatureId);
  db.transaction(() => {
    db.prepare("UPDATE candidatures SET status = 'confirmee' WHERE id = ?").run(candidatureId);
    db.prepare("UPDATE candidatures SET status = 'refusee' WHERE absence_id = ? AND id != ?").run(absenceId, candidatureId);
    db.prepare("UPDATE absences SET status = 'confirmee', replacer_id = ? WHERE id = ?").run(candidature.candidate_id, absenceId);
    db.prepare("INSERT OR IGNORE INTO availabilities (user_id, start_date, end_date) VALUES (?, ?, ?)").run(candidature.candidate_id, absence.start, absence.end);
  })();

  notify(candidature.candidate_id, `${user.name} a confirmé votre remplacement du ${absence.start} au ${absence.end}.`, `/absences/${absenceId}`);
  for (const o of others) {
    notify(o.candidate_id, `La mission du ${absence.start} au ${absence.end} est pourvue.`, `/remplacant/candidature`);
  }
  refresh();
}

/* ---------- Candidatures (remplaçant) ---------- */

export async function applyToAbsence(absenceId) {
  const user = await requireRole("remplacant");
  const absence = getAbsence(absenceId);
  if (!absence || absence.status !== "publiee" || absence.ownerId === user.id) return;
  if (getCandidatureFor(absenceId, user.id)) return;

  db.prepare("INSERT INTO candidatures (absence_id, candidate_id, status, message) VALUES (?, ?, 'envoyee', ?)").run(
    absenceId,
    user.id,
    `Bonjour ${absence.ownerName}, je suis disponible du ${absence.start} au ${absence.end}.`,
  );
  notify(absence.ownerId, `${user.name} a postulé à votre absence du ${absence.start} au ${absence.end}.`, `/absences/${absenceId}`);
  refresh();
}

/* ---------- Messagerie ---------- */

export async function startConversation(otherUserId) {
  const user = await requireUser();
  const other = Number(otherUserId);
  if (!other || other === user.id) redirect("/messagerie");
  const [a, b] = [Math.min(user.id, other), Math.max(user.id, other)];
  db.prepare("INSERT OR IGNORE INTO conversations (user_a, user_b) VALUES (?, ?)").run(a, b);
  const row = db.prepare("SELECT id FROM conversations WHERE user_a = ? AND user_b = ?").get(a, b);
  redirect(`/messagerie?c=${row.id}`);
}

export async function sendMessage(conversationId, _prev, formData) {
  const user = await requireUser();
  const conv = getConversationFor(Number(conversationId), user.id);
  if (!conv) return { error: "Conversation introuvable." };
  const body = text(formData, "body");
  if (!body) return { error: "Écrivez un message avant d’envoyer." };
  db.prepare("INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)").run(conv.id, user.id, body);
  notify(conv.otherId, `${user.name} vous a écrit.`, `/messagerie?c=${conv.id}`);
  refresh();
  return { ok: true };
}

/* ---------- Notifications ---------- */

export async function markNotificationsRead() {
  const user = await requireUser();
  db.prepare("UPDATE notifications SET read = 1 WHERE user_id = ?").run(user.id);
  refresh();
}

/* ---------- Profil, disponibilités, paramètres ---------- */

export async function updateProfile(_prev, formData) {
  const user = await requireUser();
  db.prepare(
    `UPDATE users SET first_name = ?, last_name = ?, phone = ?, specialty = ?, zone = ?, rpps = ?, cabinet_name = ?, cabinet_address = ?
     WHERE id = ?`,
  ).run(
    text(formData, "firstName") || user.firstName,
    text(formData, "lastName") || user.lastName,
    text(formData, "phone"),
    text(formData, "specialty") || user.specialty,
    text(formData, "zone") || user.zone,
    text(formData, "rpps"),
    text(formData, "cabinetName"),
    text(formData, "cabinetAddress"),
    user.id,
  );
  refresh();
  return { ok: true, message: "Profil enregistré." };
}

export async function addAvailability(_prev, formData) {
  const user = await requireUser();
  const start = text(formData, "start");
  const end = text(formData, "end");
  if (!isDate(start) || !isDate(end) || end < start) return { error: "Choisissez une période valide." };
  db.prepare("INSERT INTO availabilities (user_id, start_date, end_date) VALUES (?, ?, ?)").run(user.id, start, end);
  refresh();
  return { ok: true };
}

export async function removeAvailability(availabilityId) {
  const user = await requireUser();
  db.prepare("DELETE FROM availabilities WHERE id = ? AND user_id = ?").run(Number(availabilityId), user.id);
  refresh();
}

export async function updateSettings(_prev, formData) {
  const user = await requireUser();
  const prefs = {
    alertes: formData.get("alertes") === "on",
    messages: formData.get("messages") === "on",
    candidatures: formData.get("candidatures") === "on",
    marketing: formData.get("marketing") === "on",
  };
  db.prepare("UPDATE users SET first_name = ?, last_name = ?, phone = ?, cabinet_name = ?, cabinet_address = ?, prefs = ? WHERE id = ?").run(
    text(formData, "firstName") || user.firstName,
    text(formData, "lastName") || user.lastName,
    text(formData, "phone"),
    text(formData, "cabinetName"),
    text(formData, "cabinetAddress"),
    JSON.stringify(prefs),
    user.id,
  );

  const newPassword = text(formData, "newPassword");
  if (newPassword) {
    const row = db.prepare("SELECT password_hash FROM users WHERE id = ?").get(user.id);
    if (!(await verifyPassword(text(formData, "currentPassword"), row.password_hash))) {
      refresh();
      return { error: "Le mot de passe actuel est incorrect." };
    }
    if (newPassword.length < 6) return { error: "Le nouveau mot de passe doit contenir au moins 6 caractères." };
    if (newPassword !== text(formData, "confirmPassword")) return { error: "Les deux mots de passe ne correspondent pas." };
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(await hashPassword(newPassword), user.id);
  }
  refresh();
  return { ok: true, message: "Paramètres enregistrés." };
}

