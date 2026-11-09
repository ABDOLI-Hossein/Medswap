// Connexion SQLite et schéma. Utilisé par l’application Next.js et par scripts/seed.mjs.
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dbFile = process.env.MEDSWAP_DB ?? path.join(process.cwd(), "data", "medswap.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('installe','remplacant')),
  phone TEXT NOT NULL DEFAULT '',
  specialty TEXT NOT NULL DEFAULT 'Médecine générale',
  zone TEXT NOT NULL DEFAULT 'Lyon · Rayon de 30 km',
  rpps TEXT NOT NULL DEFAULT '',
  cabinet_name TEXT NOT NULL DEFAULT '',
  cabinet_address TEXT NOT NULL DEFAULT '',
  prefs TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS absences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  motif TEXT NOT NULL DEFAULT 'Congés',
  cabinet_name TEXT NOT NULL DEFAULT '',
  cabinet_address TEXT NOT NULL DEFAULT '',
  specialty TEXT NOT NULL DEFAULT 'Médecine générale',
  activities TEXT NOT NULL DEFAULT 'Consultations',
  schedule TEXT NOT NULL DEFAULT '',
  retrocession TEXT NOT NULL DEFAULT '',
  lodging TEXT NOT NULL DEFAULT 'Non proposé',
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('brouillon','publiee','confirmee')),
  replacer_id INTEGER REFERENCES users(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS candidatures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  absence_id INTEGER NOT NULL REFERENCES absences(id) ON DELETE CASCADE,
  candidate_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'envoyee' CHECK (status IN ('envoyee','en_discussion','confirmee','refusee')),
  message TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (absence_id, candidate_id)
);
CREATE TABLE IF NOT EXISTS availabilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_a INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_a, user_b)
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  href TEXT NOT NULL DEFAULT '/tableau-de-bord',
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

function open() {
  fs.mkdirSync(path.dirname(dbFile), { recursive: true });
  const db = new Database(dbFile);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA);
  return db;
}

// Une seule connexion par processus (évite les ouvertures multiples en dev avec le hot reload).
export const db = globalThis.__medswapDb ?? (globalThis.__medswapDb = open());
export { dbFile };
