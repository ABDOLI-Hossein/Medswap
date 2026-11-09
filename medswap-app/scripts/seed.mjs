// Données de démonstration : `npm run seed`. Réinitialise la base locale.
import fs from "node:fs";
import { db, dbFile } from "../src/lib/db-core.mjs";
import { hashPassword } from "../src/lib/password.mjs";

const DEMO_PASSWORD = "demo1234";

for (const table of ["notifications", "messages", "conversations", "availabilities", "candidatures", "absences", "sessions", "users"]) {
  db.prepare(`DELETE FROM ${table}`).run();
}

const hash = await hashPassword(DEMO_PASSWORD);
const insertUser = db.prepare(`
  INSERT INTO users (email, password_hash, first_name, last_name, role, phone, specialty, zone, rpps, cabinet_name, cabinet_address)
  VALUES (@email, @hash, @first, @last, @role, @phone, @specialty, @zone, @rpps, @cabinet, @address)
`);
const id = {};
const addUser = (key, row) => {
  id[key] = insertUser.run({ hash, specialty: "Médecine générale", zone: "Lyon · Rayon de 30 km", rpps: "", cabinet: "", address: "", phone: "", ...row }).lastInsertRowid;
};

addUser("alice", { email: "alice@medswap.test", first: "Alice", last: "Bernard", role: "installe", cabinet: "Cabinet des Brotteaux", address: "24 rue Cuvier, 69006 Lyon", phone: "06 00 00 00 01" });
addUser("claire", { email: "claire@medswap.test", first: "Claire", last: "Martin", role: "remplacant", rpps: "10101234567", phone: "06 00 00 00 02" });
addUser("antoine", { email: "antoine@medswap.test", first: "Antoine", last: "Dubois", role: "remplacant", zone: "Villeurbanne · 5 km" });
addUser("sarah", { email: "sarah@medswap.test", first: "Sarah", last: "Benali", role: "remplacant", zone: "Bron · 9 km" });
addUser("julien", { email: "julien@medswap.test", first: "Julien", last: "Moreau", role: "remplacant", zone: "Lyon · Rayon de 30 km" });
addUser("emma", { email: "emma@medswap.test", first: "Emma", last: "Laurent", role: "remplacant", zone: "Lyon · Rayon de 30 km" });

const addAvailability = db.prepare("INSERT INTO availabilities (user_id, start_date, end_date) VALUES (?, ?, ?)");
addAvailability.run(id.claire, "2026-11-10", "2026-11-24");
addAvailability.run(id.antoine, "2026-11-10", "2026-11-24");
addAvailability.run(id.sarah, "2026-11-10", "2026-11-18");
addAvailability.run(id.julien, "2026-10-05", "2026-10-09");
addAvailability.run(id.emma, "2026-11-23", "2026-11-27");

const addAbsence = db.prepare(`
  INSERT INTO absences (owner_id, start_date, end_date, motif, cabinet_name, cabinet_address, specialty, activities, schedule, retrocession, lodging, notes, status, replacer_id)
  VALUES (@owner, @start, @end, @motif, 'Cabinet des Brotteaux', '24 rue Cuvier, 69006 Lyon', 'Médecine générale', 'Consultations', '9 h–12 h 30 · 14 h–18 h, du lundi au vendredi', '80 % des honoraires', 'Non proposé', 'Consultations sur rendez-vous, patientèle familiale et deux confrères présents. Secrétariat sur place · Doctolib.', @status, @replacer)
`);
const absNov = addAbsence.run({ owner: id.alice, start: "2026-11-10", end: "2026-11-24", motif: "Congés", status: "publiee", replacer: null }).lastInsertRowid;
const absOct = addAbsence.run({ owner: id.alice, start: "2026-10-19", end: "2026-10-23", motif: "Congés", status: "publiee", replacer: null }).lastInsertRowid;
const absDone = addAbsence.run({ owner: id.alice, start: "2026-10-05", end: "2026-10-09", motif: "Congés", status: "confirmee", replacer: id.julien }).lastInsertRowid;

const addCandidature = db.prepare("INSERT INTO candidatures (absence_id, candidate_id, status, message) VALUES (?, ?, ?, ?)");
addCandidature.run(absNov, id.claire, "en_discussion", "Habituée aux cabinets de ville et à Doctolib, je serais ravie d’échanger avec vous.");
addCandidature.run(absNov, id.antoine, "envoyee", "Disponible sur la période, avec visites à domicile si besoin.");
addCandidature.run(absNov, id.sarah, "envoyee", "Disponible du 10 au 18 novembre.");
addCandidature.run(absDone, id.julien, "confirmee", "Disponible sur toute la période.");

const conv = db.prepare("INSERT INTO conversations (user_a, user_b) VALUES (?, ?)").run(Math.min(id.alice, id.claire), Math.max(id.alice, id.claire)).lastInsertRowid;
const addMessage = db.prepare("INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)");
addMessage.run(conv, id.alice, "Bonjour Claire, je recherche un remplacement du 10 au 24 novembre à Lyon. Seriez-vous disponible sur cette période ?");
addMessage.run(conv, id.claire, "Bonjour Dr Bernard ! Oui, je suis disponible. Pourriez-vous me préciser les horaires et l’organisation du cabinet ?");
addMessage.run(conv, id.alice, "Bien sûr : 9 h–12 h 30 et 14 h–18 h, du lundi au vendredi. Le secrétariat est sur place et nous utilisons Doctolib.");
addMessage.run(conv, id.claire, "Cela me convient très bien. Je vous confirme ma disponibilité pour les 5 jours !");

const addNotification = db.prepare("INSERT INTO notifications (user_id, text, href) VALUES (?, ?, ?)");
addNotification.run(id.alice, "Claire Martin a répondu à votre message.", "/messagerie");
addNotification.run(id.alice, "Une nouvelle candidature a été reçue pour votre absence du 10 au 24 novembre.", "/absences/" + absNov);
addNotification.run(id.claire, "Dr Alice Bernard a répondu à votre candidature.", "/remplacant/candidature");

db.close();
console.log(`Base prête : ${dbFile}`);
console.log(`Comptes de démonstration : alice@medswap.test (médecin installé), claire@medswap.test (remplaçante) — mot de passe : ${DEMO_PASSWORD}`);
