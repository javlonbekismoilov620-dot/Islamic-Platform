import "server-only";
import { notFound, redirect } from "next/navigation";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { withContext } from "@/server/db/client";
import { auditLog, categories, contentItems, contentRevisions, reviewEvents, sources, users } from "@/server/db/schema";
import { getCurrentUser, isStaff, type SessionUser } from "@/server/auth/session";

/** Boshqaruv paneliga kirish: kirmagan — kirish sahifasiga, oddiy foydalanuvchi — 404 (panel mavjudligi oshkor qilinmaydi). */
export async function requireStaffPage(path = "/admin"): Promise<SessionUser> {
  const u = await getCurrentUser();
  if (!u) redirect(`/kirish?next=${encodeURIComponent(path)}`);
  if (!isStaff(u)) notFound();
  return u;
}

export async function adminStats(uid: string) {
  return withContext(uid, async (tx) => {
    const byStatus = await tx.select({ type: contentItems.type, status: contentItems.status, n: sql<number>`count(*)::int` }).from(contentItems).groupBy(contentItems.type, contentItems.status);
    const recent = await tx
      .select({ id: reviewEvents.id, action: reviewEvents.action, note: reviewEvents.note, createdAt: reviewEvents.createdAt, contentId: reviewEvents.contentId, title: contentItems.title, type: contentItems.type, actor: users.email })
      .from(reviewEvents)
      .leftJoin(contentItems, eq(contentItems.id, reviewEvents.contentId))
      .leftJoin(users, eq(users.id, reviewEvents.actorId))
      .orderBy(desc(reviewEvents.createdAt))
      .limit(12);
    return { byStatus, recent };
  });
}

export async function adminList(uid: string, f: { type?: string; status?: string; q?: string; page?: number; origin?: string }) {
  const page = Math.max(1, f.page ?? 1), size = 30;
  return withContext(uid, async (tx) => {
    const where = and(
      f.type ? eq(contentItems.type, f.type as never) : undefined,
      f.status ? eq(contentItems.status, f.status as never) : undefined,
      f.origin ? eq(contentItems.origin, f.origin as never) : undefined,
      f.q ? or(ilike(contentItems.title, `%${f.q}%`), ilike(contentItems.slug, `%${f.q}%`)) : undefined,
    );
    const rows = await tx
      .select({ id: contentItems.id, type: contentItems.type, slug: contentItems.slug, title: contentItems.title, status: contentItems.status, origin: contentItems.origin, category: contentItems.category, updatedAt: contentItems.updatedAt, submittedAt: contentItems.submittedAt })
      .from(contentItems)
      .where(where)
      .orderBy(f.status === "in_review" ? asc(contentItems.submittedAt) : desc(contentItems.updatedAt))
      .limit(size)
      .offset((page - 1) * size);
    const [{ n }] = await tx.select({ n: sql<number>`count(*)::int` }).from(contentItems).where(where);
    return { rows, total: n, page, pages: Math.max(1, Math.ceil(n / size)) };
  });
}

export async function adminGet(uid: string, id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  return withContext(uid, async (tx) => {
    const [row] = await tx.select().from(contentItems).where(eq(contentItems.id, id)).limit(1);
    if (!row) return null;
    const events = await tx
      .select({ id: reviewEvents.id, action: reviewEvents.action, fromStatus: reviewEvents.fromStatus, toStatus: reviewEvents.toStatus, note: reviewEvents.note, createdAt: reviewEvents.createdAt, actor: users.email })
      .from(reviewEvents)
      .leftJoin(users, eq(users.id, reviewEvents.actorId))
      .where(eq(reviewEvents.contentId, id))
      .orderBy(desc(reviewEvents.createdAt))
      .limit(50);
    const revisions = await tx.select({ id: contentRevisions.id, version: contentRevisions.version, createdAt: contentRevisions.createdAt, snapshot: contentRevisions.snapshot }).from(contentRevisions).where(eq(contentRevisions.contentId, id)).orderBy(desc(contentRevisions.version)).limit(20);
    const [editor] = row.updatedBy ? await tx.select({ email: users.email }).from(users).where(eq(users.id, row.updatedBy)) : [];
    const [reviewer] = row.reviewedBy ? await tx.select({ email: users.email }).from(users).where(eq(users.id, row.reviewedBy)) : [];
    return { row, events, revisions, editorEmail: editor?.email ?? null, reviewerEmail: reviewer?.email ?? null };
  });
}

export const adminCategories = (uid: string) => withContext(uid, (tx) => tx.select().from(categories).orderBy(asc(categories.type), asc(categories.sort)));
export const adminSources = (uid: string) => withContext(uid, (tx) => tx.select().from(sources).orderBy(asc(sources.kind), asc(sources.title)));
export const adminUsers = (uid: string) => withContext(uid, (tx) => tx.select({ id: users.id, email: users.email, displayName: users.displayName, role: users.role, status: users.status, createdAt: users.createdAt, lastLoginAt: users.lastLoginAt }).from(users).orderBy(desc(users.createdAt)).limit(200));
export const adminAudit = (uid: string) =>
  withContext(uid, (tx) => tx.select({ id: auditLog.id, action: auditLog.action, targetType: auditLog.targetType, targetId: auditLog.targetId, meta: auditLog.meta, createdAt: auditLog.createdAt, actor: users.email }).from(auditLog).leftJoin(users, eq(users.id, auditLog.actorId)).orderBy(desc(auditLog.createdAt)).limit(200));
