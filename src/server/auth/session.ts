import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { and, eq, gt, sql } from "drizzle-orm";
import { getSystemDb } from "@/server/db/client";
import { sessions, users, type Role } from "@/server/db/schema";

const SECURE = process.env.NODE_ENV === "production";
export const SESSION_COOKIE = SECURE ? "__Host-hidoyat_session" : "hidoyat_session";
const MAX_AGE_DAYS = 30;

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export type SessionUser = { id: string; email: string; displayName: string | null; role: Role; createdAt: string };

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const db = await getSystemDb();
  const ua = (await headers()).get("user-agent")?.slice(0, 200) ?? null;
  const expires = new Date(Date.now() + MAX_AGE_DAYS * 86400_000);
  await db.insert(sessions).values({ id: sha256(token), userId, expiresAt: expires, userAgent: ua });
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, userId));
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: SECURE, sameSite: "lax", path: "/", maxAge: MAX_AGE_DAYS * 86400 });
}

export async function endSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = await getSystemDb();
    await db.execute(sql`delete from sessions where id = ${sha256(token)}`);
  }
  jar.set(SESSION_COOKIE, "", { httpOnly: true, secure: SECURE, sameSite: "lax", path: "/", maxAge: 0 });
}

export async function endAllSessions(userId: string) {
  const db = await getSystemDb();
  await db.execute(sql`delete from sessions where user_id = ${userId}`);
}

/** Joriy foydalanuvchi (soʻrov davomida bir marta hisoblanadi). */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const db = await getSystemDb();
  const rows = await db
    .select({ id: users.id, email: users.email, displayName: users.displayName, role: users.role, status: users.status, createdAt: users.createdAt })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, sha256(token)), gt(sessions.expiresAt, sql`now()`)))
    .limit(1);
  const u = rows[0];
  if (!u || u.status !== "active") return null;
  return { id: u.id, email: u.email, displayName: u.displayName, role: u.role, createdAt: new Date(u.createdAt).toISOString() };
});

export const STAFF_ROLES: Role[] = ["editor", "reviewer", "admin"];
export const isStaff = (u: SessionUser | null) => !!u && STAFF_ROLES.includes(u.role);
export const canReview = (u: SessionUser | null) => !!u && (u.role === "reviewer" || u.role === "admin");
export const isAdmin = (u: SessionUser | null) => !!u && u.role === "admin";
