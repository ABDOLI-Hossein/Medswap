import "server-only";
import { db } from "./db-core.mjs";
import { mapUser } from "./mappers";

const userRow = (id) => db.prepare("SELECT * FROM users WHERE id = ?").get(id);

export function getUser(id) {
  return mapUser(userRow(id));
}

export function listAvailabilities(userId) {
  return db
    .prepare("SELECT id, start_date AS start, end_date AS end FROM availabilities WHERE user_id = ? ORDER BY start_date")
    .all(userId);
}

export function listRemplacants() {
  return db
    .prepare("SELECT * FROM users WHERE role = 'remplacant' ORDER BY last_name")
    .all()
    .map((row) => ({
      ...mapUser(row),
      availabilities: listAvailabilities(row.id),
    }));
}

const absenceSelect = `
  SELECT a.*, o.first_name AS owner_first, o.last_name AS owner_last,
         r.first_name AS replacer_first, r.last_name AS replacer_last
  FROM absences a
  JOIN users o ON o.id = a.owner_id
  LEFT JOIN users r ON r.id = a.replacer_id`;

export function mapAbsence(row) {
  if (!row) return null;
  return {
    id: row.id,
    ownerId: row.owner_id,
    ownerName: `Dr ${row.owner_first} ${row.owner_last}`,
    start: row.start_date,
    end: row.end_date,
    motif: row.motif,
    cabinetName: row.cabinet_name,
    cabinetAddress: row.cabinet_address,
    specialty: row.specialty,
    activities: row.activities,
    schedule: row.schedule,
    retrocession: row.retrocession,
    lodging: row.lodging,
    notes: row.notes,
    status: row.status,
    replacerId: row.replacer_id,
    replacerName: row.replacer_id ? `Dr ${row.replacer_first} ${row.replacer_last}` : null,
    createdAt: row.created_at,
  };
}

export function listAbsencesByOwner(ownerId) {
  return db.prepare(`${absenceSelect} WHERE a.owner_id = ? ORDER BY a.start_date`).all(ownerId).map(mapAbsence);
}

export function getAbsence(id) {
  return mapAbsence(db.prepare(`${absenceSelect} WHERE a.id = ?`).get(id));
}

/** Missions publiées visibles par les remplaçants (hors les leurs). */
export function listPublishedMissions(excludeUserId) {
  return db
    .prepare(`${absenceSelect} WHERE a.status = 'publiee' AND a.owner_id != ? ORDER BY a.start_date`)
    .all(excludeUserId)
    .map(mapAbsence);
}

export function listCandidaturesForAbsence(absenceId) {
  return db
    .prepare(
      `SELECT c.*, u.first_name, u.last_name, u.zone, u.specialty
       FROM candidatures c JOIN users u ON u.id = c.candidate_id
       WHERE c.absence_id = ? ORDER BY c.created_at`,
    )
    .all(absenceId)
    .map((row) => ({
      id: row.id,
      absenceId: row.absence_id,
      candidateId: row.candidate_id,
      candidateName: `Dr ${row.first_name} ${row.last_name}`,
      candidateInitials: `${row.first_name[0]}${row.last_name[0]}`.toUpperCase(),
      zone: row.zone,
      specialty: row.specialty,
      status: row.status,
      message: row.message,
      createdAt: row.created_at,
    }));
}

export function listCandidaturesForUser(userId) {
  return db
    .prepare(
      `SELECT c.*, a.start_date, a.end_date, a.status AS absence_status, a.cabinet_name, a.id AS absence_id,
              o.first_name AS owner_first, o.last_name AS owner_last
       FROM candidatures c
       JOIN absences a ON a.id = c.absence_id
       JOIN users o ON o.id = a.owner_id
       WHERE c.candidate_id = ? ORDER BY c.created_at DESC`,
    )
    .all(userId)
    .map((row) => ({
      id: row.id,
      absenceId: row.absence_id,
      start: row.start_date,
      end: row.end_date,
      status: row.status,
      absenceStatus: row.absence_status,
      cabinetName: row.cabinet_name,
      ownerName: `Dr ${row.owner_first} ${row.owner_last}`,
      message: row.message,
      createdAt: row.created_at,
    }));
}

export function getCandidatureFor(absenceId, userId) {
  return db.prepare("SELECT * FROM candidatures WHERE absence_id = ? AND candidate_id = ?").get(absenceId, userId) ?? null;
}

export function listConversations(userId) {
  return db
    .prepare(
      `SELECT c.id,
              CASE WHEN c.user_a = @u THEN c.user_b ELSE c.user_a END AS other_id,
              (SELECT body FROM messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) AS last_body,
              (SELECT created_at FROM messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) AS last_at
       FROM conversations c
       WHERE c.user_a = @u OR c.user_b = @u
       ORDER BY last_at DESC, c.id DESC`,
    )
    .all({ u: userId })
    .map((row) => {
      const other = userRow(row.other_id);
      return {
        id: row.id,
        otherId: other.id,
        name: `Dr ${other.first_name} ${other.last_name}`,
        initials: `${other.first_name[0]}${other.last_name[0]}`.toUpperCase(),
        meta: `${other.role === "installe" ? "Médecin installé" : "Médecin remplaçant"} · ${other.zone}`,
        last: row.last_body ?? "Aucun message pour le moment.",
        lastAt: row.last_at,
      };
    });
}

export function getConversationFor(conversationId, userId) {
  const c = db.prepare("SELECT * FROM conversations WHERE id = ? AND (user_a = ? OR user_b = ?)").get(conversationId, userId, userId);
  if (!c) return null;
  const otherId = c.user_a === userId ? c.user_b : c.user_a;
  return { id: c.id, otherId, other: getUser(otherId) };
}

export function listMessages(conversationId) {
  return db
    .prepare("SELECT id, sender_id, body, created_at FROM messages WHERE conversation_id = ? ORDER BY id")
    .all(conversationId)
    .map((m) => ({ id: m.id, senderId: m.sender_id, body: m.body, createdAt: m.created_at }));
}

export function listNotifications(userId, limit = 8) {
  return db
    .prepare("SELECT id, text, href, read, created_at FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT ?")
    .all(userId, limit)
    .map((n) => ({ id: n.id, text: n.text, href: n.href, read: !!n.read, createdAt: n.created_at }));
}

export function unreadNotificationCount(userId) {
  return db.prepare("SELECT COUNT(*) AS n FROM notifications WHERE user_id = ? AND read = 0").get(userId).n;
}
