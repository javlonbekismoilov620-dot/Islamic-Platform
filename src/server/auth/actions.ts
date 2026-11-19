"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getSystemDb, withContext } from "@/server/db/client";
import { users } from "@/server/db/schema";
import { fakeVerify, hashPassword, verifyPassword } from "./password";
import { createSession, endAllSessions, endSession, getCurrentUser } from "./session";
import { rateLimit } from "./rate-limit";
import { clientIp } from "./request";

export type FormState = { error?: string; ok?: string; fields?: Record<string, string> } | undefined;

const email = z.string().trim().toLowerCase().email("Elektron pochta manzili notoʻgʻri").max(254);
const password = z.string().min(8, "Parol kamida 8 belgidan iborat boʻlishi kerak").max(200, "Parol juda uzun");

/** BOOTSTRAP_ADMIN_EMAILS muhit oʻzgaruvchisidagi manzillar birinchi kirishda administrator boʻladi. */
async function bootstrapAdmin(userId: string, email: string) {
  const list = (process.env.BOOTSTRAP_ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  if (!list.includes(email)) return;
  const db = await getSystemDb();
  await db.update(users).set({ role: "admin" }).where(eq(users.id, userId));
}

function safeNext(v: FormDataEntryValue | null): string {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/\\") ? s : "/profil";
}

export async function registerAction(_: FormState, form: FormData): Promise<FormState> {
  const ip = clientIp(await headers());
  const rl = await rateLimit(`register:${ip}`, 5, 3600);
  if (!rl.ok) return { error: "Juda koʻp urinish. Birozdan soʻng qayta urinib koʻring." };

  const parsed = z
    .object({ email, password, name: z.string().trim().max(80).optional(), consent: z.literal("on", { message: "Maxfiylik shartlariga rozilik bildiring" }) })
    .safeParse({ email: form.get("email"), password: form.get("password"), name: form.get("name") || undefined, consent: form.get("consent") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Maʼlumotlar notoʻgʻri", fields: { email: String(form.get("email") ?? ""), name: String(form.get("name") ?? "") } };

  const db = await getSystemDb();
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, parsed.data.email)).limit(1);
  if (existing.length) return { error: "Bu elektron pochta bilan hisob allaqachon mavjud. Kirish sahifasidan foydalaning.", fields: { email: parsed.data.email } };

  const hash = await hashPassword(parsed.data.password);
  const [u] = await db.insert(users).values({ email: parsed.data.email, passwordHash: hash, displayName: parsed.data.name ?? null }).returning({ id: users.id });
  await bootstrapAdmin(u.id, parsed.data.email);
  await createSession(u.id);
  redirect(safeNext(form.get("next")));
}

export async function loginAction(_: FormState, form: FormData): Promise<FormState> {
  const ip = clientIp(await headers());
  const parsed = z.object({ email, password: z.string().min(1).max(200) }).safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "Elektron pochta yoki parol notoʻgʻri", fields: { email: String(form.get("email") ?? "") } };

  const [byIp, byEmail] = await Promise.all([rateLimit(`login-ip:${ip}`, 20, 900), rateLimit(`login-email:${parsed.data.email}`, 8, 900)]);
  if (!byIp.ok || !byEmail.ok) return { error: `Juda koʻp urinish. ${Math.ceil(Math.max(byIp.retryAfter, byEmail.retryAfter) / 60)} daqiqadan soʻng qayta urinib koʻring.`, fields: { email: parsed.data.email } };

  const db = await getSystemDb();
  const [u] = await db.select().from(users).where(eq(users.email, parsed.data.email)).limit(1);
  if (!u) {
    await fakeVerify(parsed.data.password);
    return { error: "Elektron pochta yoki parol notoʻgʻri", fields: { email: parsed.data.email } };
  }
  const ok = await verifyPassword(parsed.data.password, u.passwordHash);
  if (!ok || u.status !== "active") return { error: u.status !== "active" && ok ? "Hisob faol emas. Administrator bilan bogʻlaning." : "Elektron pochta yoki parol notoʻgʻri", fields: { email: parsed.data.email } };

  await bootstrapAdmin(u.id, u.email);
  await createSession(u.id);
  redirect(safeNext(form.get("next")));
}

export async function logoutAction() {
  await endSession();
  redirect("/");
}

export async function updateProfileAction(_: FormState, form: FormData): Promise<FormState> {
  const me = await getCurrentUser();
  if (!me) return { error: "Avval hisobga kiring" };
  const parsed = z.object({ name: z.string().trim().max(80) }).safeParse({ name: form.get("name") ?? "" });
  if (!parsed.success) return { error: "Ism 80 belgidan oshmasligi kerak" };
  await withContext(me.id, (tx) => tx.update(users).set({ displayName: parsed.data.name || null }).where(eq(users.id, me.id)));
  return { ok: "Profil saqlandi" };
}

export async function changePasswordAction(_: FormState, form: FormData): Promise<FormState> {
  const me = await getCurrentUser();
  if (!me) return { error: "Avval hisobga kiring" };
  const rl = await rateLimit(`pwchange:${me.id}`, 5, 3600);
  if (!rl.ok) return { error: "Juda koʻp urinish. Keyinroq urinib koʻring." };
  const parsed = z.object({ current: z.string().min(1).max(200), next: password }).safeParse({ current: form.get("current"), next: form.get("next") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Maʼlumotlar notoʻgʻri" };
  const db = await getSystemDb();
  const [u] = await db.select().from(users).where(eq(users.id, me.id)).limit(1);
  if (!u || !(await verifyPassword(parsed.data.current, u.passwordHash))) return { error: "Joriy parol notoʻgʻri" };
  await db.update(users).set({ passwordHash: await hashPassword(parsed.data.next) }).where(eq(users.id, me.id));
  await endAllSessions(me.id);
  await createSession(me.id);
  return { ok: "Parol oʻzgartirildi. Boshqa qurilmalardagi seanslar yopildi." };
}

export async function deleteAccountAction(_: FormState, form: FormData): Promise<FormState> {
  const me = await getCurrentUser();
  if (!me) return { error: "Avval hisobga kiring" };
  if (me.role === "admin") {
    const db0 = await getSystemDb();
    const res = (await db0.execute(sql`select count(*)::int as n from users where role = 'admin' and status = 'active'`)) as unknown as { rows?: { n: number }[] } | { n: number }[];
    const rows = Array.isArray(res) ? res : (res.rows ?? []);
    if ((rows[0]?.n ?? 0) <= 1) return { error: "Yagona administrator hisobini oʻchirib boʻlmaydi. Avval boshqa administrator tayinlang." };
  }
  const pw = String(form.get("password") ?? "");
  const db = await getSystemDb();
  const [u] = await db.select().from(users).where(eq(users.id, me.id)).limit(1);
  if (!u || !(await verifyPassword(pw, u.passwordHash))) return { error: "Parol notoʻgʻri" };
  await endSession();
  await db.execute(sql`delete from users where id = ${me.id}`);
  redirect("/?hisob=ochirildi");
}
