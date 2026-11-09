import "server-only";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db } from "./db-core.mjs";
import { mapUser } from "./mappers";

const COOKIE = "medswap_session";
const DAYS = 7;

export async function createSession(userId) {
  const id = randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(id, userId, Date.now() + DAYS * 864e5);
  const store = await cookies();
  store.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  const store = await cookies();
  const id = store.get(COOKIE)?.value;
  if (id) db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
  store.delete(COOKIE);
}

export async function getCurrentUser() {
  await connection(); // rendu à chaque requête : la session dépend du cookie
  const store = await cookies();
  const id = store.get(COOKIE)?.value;
  if (!id) return null;
  const row = db
    .prepare(
      `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > ?`,
    )
    .get(id, Date.now());
  return row ? mapUser(row) : null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  return user;
}

export async function requireRole(role) {
  const user = await requireUser();
  if (user.role !== role) redirect(user.role === "installe" ? "/tableau-de-bord" : "/remplacant");
  return user;
}
