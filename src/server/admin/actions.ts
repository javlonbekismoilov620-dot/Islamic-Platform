"use server";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { withContext } from "@/server/db/client";
import { auditLog, categories, contentItems, reviewEvents, sources, users, type Reference } from "@/server/db/schema";
import { endAllSessions, getCurrentUser, isAdmin, isStaff, type SessionUser } from "@/server/auth/session";
import { CONTENT_TAG } from "@/server/content/repo";
import { FIELDS, STATUS_TRANSITIONS } from "./fields";
import { searchTextFor, slugify } from "@/content/seed";

export type AdminState = { error?: string; ok?: string } | undefined;

async function requireStaff(): Promise<SessionUser> {
  const u = await getCurrentUser();
  if (!isStaff(u)) throw new Error("Ruxsat yoʻq");
  return u!;
}

/** Postgres trigger/RLS xatolarini foydalanuvchiga tushunarli matnga aylantirish. */
function dbError(e: unknown): string {
  const err = e as { cause?: { message?: string; code?: string }; message?: string; code?: string };
  const code = err.cause?.code ?? err.code;
  const msg = err.cause?.message ?? err.message ?? "";
  if (code === "42501") return msg.replace(/^.*?: /, "") || "Ruxsat yoʻq";
  if (code === "23505") return "Bu slug bilan kontent allaqachon mavjud";
  if (code === "23514") return "Maʼlumot cheklovlarga mos emas (masalan, slug faqat lotin harflari, raqam va «-» dan iborat boʻlishi kerak)";
  console.error(e);
  return "Saqlashda xatolik yuz berdi";
}

async function audit(userId: string, action: string, targetType: string, targetId: string, meta: Record<string, unknown> = {}) {
  await withContext(userId, (tx) => tx.insert(auditLog).values({ actorId: userId, action, targetType, targetId, meta }));
}

const httpsUrl = z.string().url().refine((u) => u.startsWith("https://"), "Faqat https havolalar");

function parseRefs(raw: string): Reference[] {
  const arr = z.array(z.object({ title: z.string().trim().min(1).max(300), author: z.string().trim().max(300).optional(), locator: z.string().trim().max(300).optional(), url: z.string().trim().max(500).optional(), kind: z.string().max(30).optional() })).max(30).parse(JSON.parse(raw || "[]"));
  return arr.map((r) => {
    const url = r.url ? (r.url.startsWith("/") && !r.url.startsWith("//") ? r.url : httpsUrl.parse(r.url)) : undefined;
    return { title: r.title, author: r.author || undefined, locator: r.locator || undefined, url, kind: r.kind };
  });
}

function readBody(type: string, form: FormData, prev: Record<string, unknown>) {
  const body: Record<string, unknown> = { ...prev };
  for (const f of FIELDS[type] ?? []) {
    if (f.kind === "readonly") continue;
    const raw = form.get(`body.${f.name}`);
    const v = typeof raw === "string" ? raw.replace(/\r\n/g, "\n").trim() : "";
    if (f.required && !v && f.kind !== "checkbox") throw new Error(`«${f.label}» maydoni toʻldirilishi shart`);
    switch (f.kind) {
      case "number": body[f.name] = v === "" ? null : Number(v); if (v !== "" && !Number.isFinite(body[f.name] as number)) throw new Error(`«${f.label}» raqam boʻlishi kerak`); break;
      case "checkbox": body[f.name] = raw === "on"; break;
      case "lines": body[f.name] = v.split("\n").map((x) => x.trim()).filter(Boolean); break;
      case "json": if (v) { try { body[f.name] = JSON.parse(v); } catch { throw new Error(`«${f.label}» toʻgʻri JSON emas`); } } break;
      case "url": body[f.name] = v ? httpsUrl.parse(v) : null; break;
      case "select": body[f.name] = v || null; break;
      default: body[f.name] = v || (f.required ? v : undefined);
    }
  }
  if (type === "dua") {
    body.categories = String(form.get("body.categories") ?? "").split(",").map((c) => c.trim()).filter(Boolean);
    if (!(body.categories as string[]).length) throw new Error("Kamida bitta toifa koʻrsating");
    if (prev.arabic !== undefined && prev.arabic !== body.arabic) {
      body.arabicVerified = false;
      body.checks = [];
      body.origin = { kind: "manual", note: "Arabcha matn tahririyat tomonidan oʻzgartirildi — qayta solishtirish talab etiladi." };
    }
    if (prev.arabic === undefined) { body.arabicVerified = false; body.checks = []; body.grades = []; body.origin = { kind: "manual", note: "Tahririyat tomonidan kiritilgan — manba bilan qoʻlda solishtirilishi kerak." }; }
  }
  if (type === "quiz") {
    z.array(z.object({ q: z.string().min(1), options: z.array(z.string().min(1)).min(2).max(6), answer: z.number().int().min(0), explain: z.string() })).min(1).parse(body.questions);
  }
  if (type === "dhikr" && !body.kind) body.kind = Array.isArray(body.steps) ? "set" : "single";
  return body;
}

export async function saveContentAction(_: AdminState, form: FormData): Promise<AdminState> {
  const me = await requireStaff();
  const id = String(form.get("id") ?? "");
  const type = String(form.get("type") ?? "");
  if (!FIELDS[type]) return { error: "Notoʻgʻri kontent turi" };
  let newId = id;
  try {
    const title = z.string().trim().min(1, "Sarlavha kiritilmagan").max(200).parse(form.get("title"));
    const slug = slugify(String(form.get("slug") || title));
    if (!slug) return { error: "Slug notoʻgʻri" };
    const category = String(form.get("category") ?? "").trim() || null;
    const summary = String(form.get("summary") ?? "").trim() || null;
    const sort = Number(form.get("sort") ?? 0) || 0;
    const refs = parseRefs(String(form.get("refs") ?? "[]"));

    await withContext(me.id, async (tx) => {
      const prevRow = id ? (await tx.select().from(contentItems).where(eq(contentItems.id, id)).limit(1))[0] : undefined;
      if (id && !prevRow) throw new Error("Kontent topilmadi");
      const body = readBody(type, form, (prevRow?.body as Record<string, unknown>) ?? {});
      const b = body as Record<string, unknown>;
      const searchText = searchTextFor([title, summary, ...["meaning", "translit", "translation", "definition", "occasion", "narrator", "markdown", "description", "arabic", "matn"].map((k) => (typeof b[k] === "string" ? (b[k] as string) : ""))]);
      if (prevRow) {
        await tx.update(contentItems).set({ title, slug, category, summary, sort, refs, body, searchText }).where(eq(contentItems.id, id));
        await tx.insert(reviewEvents).values({ contentId: id, actorId: me.id, action: "edit", fromStatus: prevRow.status, toStatus: prevRow.status === "published" ? "in_review" : prevRow.status });
      } else {
        const [row] = await tx.insert(contentItems).values({ type: type as never, title, slug, category, summary, sort, refs, body, searchText, status: "draft", origin: "editor", createdBy: me.id }).returning({ id: contentItems.id });
        newId = row.id;
        await tx.insert(reviewEvents).values({ contentId: row.id, actorId: me.id, action: "create", toStatus: "draft" });
      }
    });
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0]?.message ?? "Maʼlumot notoʻgʻri" };
    if (e instanceof Error && !("cause" in e && e.cause)) return { error: e.message };
    return { error: dbError(e) };
  }
  updateTag(CONTENT_TAG);
  if (!id) redirect(`/admin/kontent/${newId}?yangi=1`);
  return { ok: "Saqlandi. Tasdiqlangan kontent tahrirlangan boʻlsa, u qayta tekshiruvga yuborildi." };
}

export async function transitionAction(_: AdminState, form: FormData): Promise<AdminState> {
  const me = await requireStaff();
  const id = String(form.get("id") ?? "");
  const action = String(form.get("action") ?? "");
  const note = String(form.get("note") ?? "").trim().slice(0, 2000) || null;
  try {
    await withContext(me.id, async (tx) => {
      const [row] = await tx.select().from(contentItems).where(eq(contentItems.id, id)).limit(1);
      if (!row) throw new Error("Kontent topilmadi");
      const t = (STATUS_TRANSITIONS[row.status] ?? []).find((x) => x.action === action);
      if (!t) throw new Error("Bu holatdan ushbu amal mumkin emas");
      if (!t.roles.includes(me.role)) throw new Error("Bu amal uchun ruxsatingiz yoʻq");
      if (action === "approve" && form.get("confirm") !== "on") throw new Error("Tasdiqlashdan oldin tekshiruv bandini belgilang");
      if ((action === "reject" || action === "request_changes") && !note) throw new Error("Sababini izohda yozing");
      await tx.update(contentItems).set({ status: t.to as never, reviewNote: note ?? row.reviewNote }).where(eq(contentItems.id, id));
      await tx.insert(reviewEvents).values({ contentId: id, actorId: me.id, action, fromStatus: row.status, toStatus: t.to, note });
    });
  } catch (e) {
    if (e instanceof Error && !("cause" in e && e.cause)) return { error: e.message };
    return { error: dbError(e) };
  }
  updateTag(CONTENT_TAG);
  return { ok: "Holat yangilandi" };
}

export async function deleteContentAction(_: AdminState, form: FormData): Promise<AdminState> {
  const me = await requireStaff();
  if (!isAdmin(me)) return { error: "Faqat administrator oʻchira oladi" };
  const id = String(form.get("id") ?? "");
  try {
    await withContext(me.id, (tx) => tx.delete(contentItems).where(eq(contentItems.id, id)));
    await audit(me.id, "content.delete", "content", id);
  } catch (e) {
    return { error: dbError(e) };
  }
  updateTag(CONTENT_TAG);
  redirect("/admin/kontent");
}

export async function saveSourceAction(_: AdminState, form: FormData): Promise<AdminState> {
  const me = await requireStaff();
  try {
    const data = z.object({
      id: z.string().optional(),
      key: z.string().trim().regex(/^[a-z0-9-]{1,60}$/, "Kalit: lotin kichik harflar, raqam va «-»"),
      title: z.string().trim().min(1).max(300),
      author: z.string().trim().max(300).optional(),
      kind: z.enum(["quran", "translation", "hadith", "book", "website", "dataset", "institution"]),
      publisher: z.string().trim().max(300).optional(),
      url: z.union([httpsUrl, z.literal("")]).optional(),
      notes: z.string().trim().max(2000).optional(),
    }).parse(Object.fromEntries(form));
    const values = { key: data.key, title: data.title, author: data.author || null, kind: data.kind, publisher: data.publisher || null, url: data.url || null, notes: data.notes || null };
    await withContext(me.id, async (tx) => {
      if (data.id) await tx.update(sources).set(values).where(eq(sources.id, data.id));
      else await tx.insert(sources).values(values);
    });
    await audit(me.id, data.id ? "source.update" : "source.create", "source", data.key);
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0]?.message };
    return { error: dbError(e) };
  }
  return { ok: "Manba saqlandi" };
}

export async function deleteSourceAction(_: AdminState, form: FormData): Promise<AdminState> {
  const me = await requireStaff();
  if (!isAdmin(me)) return { error: "Faqat administrator oʻchira oladi" };
  try {
    await withContext(me.id, (tx) => tx.delete(sources).where(eq(sources.id, String(form.get("id")))));
    await audit(me.id, "source.delete", "source", String(form.get("id")));
  } catch (e) {
    return { error: dbError(e) };
  }
  return { ok: "Oʻchirildi" };
}

export async function saveCategoryAction(_: AdminState, form: FormData): Promise<AdminState> {
  const me = await requireStaff();
  if (!isAdmin(me)) return { error: "Faqat administrator toifalarni boshqaradi" };
  try {
    const d = z.object({
      id: z.string().optional(),
      type: z.enum(["dua", "dhikr", "hadith", "article", "glossary"]),
      slug: z.string().trim().regex(/^[a-z0-9-]{1,60}$/, "Slug: lotin kichik harflar, raqam va «-»"),
      title: z.string().trim().min(1).max(120),
      description: z.string().trim().max(500).optional(),
      icon: z.string().trim().max(30).optional(),
      sort: z.coerce.number().int().min(0).max(999).default(0),
    }).parse(Object.fromEntries(form));
    const values = { type: d.type, slug: d.slug, title: d.title, description: d.description || null, icon: d.icon || null, sort: d.sort };
    await withContext(me.id, async (tx) => {
      if (d.id) await tx.update(categories).set(values).where(eq(categories.id, d.id));
      else await tx.insert(categories).values(values);
    });
    await audit(me.id, d.id ? "category.update" : "category.create", "category", `${d.type}/${d.slug}`);
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0]?.message };
    return { error: dbError(e) };
  }
  updateTag(CONTENT_TAG);
  return { ok: "Toifa saqlandi" };
}

export async function deleteCategoryAction(_: AdminState, form: FormData): Promise<AdminState> {
  const me = await requireStaff();
  if (!isAdmin(me)) return { error: "Faqat administrator" };
  const id = String(form.get("id"));
  try {
    await withContext(me.id, async (tx) => {
      const [c] = await tx.select().from(categories).where(eq(categories.id, id));
      if (!c) throw new Error("Topilmadi");
      const used = await tx.select({ n: sql<number>`count(*)::int` }).from(contentItems).where(and(sql`${contentItems.category} = ${c.slug}`, sql`${contentItems.type} = ${c.type}`));
      if ((used[0]?.n ?? 0) > 0) throw new Error("Bu toifada kontent bor — avval kontentni boshqa toifaga koʻchiring");
      await tx.delete(categories).where(eq(categories.id, id));
    });
    await audit(me.id, "category.delete", "category", id);
  } catch (e) {
    if (e instanceof Error && !("cause" in e && e.cause)) return { error: e.message };
    return { error: dbError(e) };
  }
  updateTag(CONTENT_TAG);
  return { ok: "Oʻchirildi" };
}

export async function setUserAction(_: AdminState, form: FormData): Promise<AdminState> {
  const me = await requireStaff();
  if (!isAdmin(me)) return { error: "Faqat administrator" };
  try {
    const d = z.object({ id: z.string().uuid(), role: z.enum(["user", "editor", "reviewer", "admin"]), status: z.enum(["active", "disabled"]) }).parse(Object.fromEntries(form));
    if (d.id === me.id && (d.role !== "admin" || d.status !== "active")) return { error: "Oʻz administrator huquqingizni olib tashlay olmaysiz" };
    await withContext(me.id, (tx) => tx.update(users).set({ role: d.role, status: d.status }).where(eq(users.id, d.id)));
    if (d.status === "disabled") await endAllSessions(d.id);
    await audit(me.id, "user.update", "user", d.id, { role: d.role, status: d.status });
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0]?.message };
    return { error: dbError(e) };
  }
  return { ok: "Foydalanuvchi yangilandi" };
}
