import "server-only";
import { and, asc, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { withContext } from "@/server/db/client";
import { categories, contentItems, type ContentRow } from "@/server/db/schema";
import type { BodyByType, Content, ContentType } from "@/content/types";

export const CONTENT_TAG = "content";

export function toContent<T extends ContentType>(r: ContentRow): Content<T> {
  return {
    id: r.id,
    type: r.type as T,
    slug: r.slug,
    category: r.category,
    title: r.title,
    summary: r.summary,
    body: r.body as unknown as BodyByType[T],
    refs: r.refs ?? [],
    status: r.status,
    origin: r.origin,
    sort: r.sort,
    version: r.version,
    reviewedAt: r.reviewedAt ? new Date(r.reviewedAt).toISOString() : null,
    updatedAt: new Date(r.updatedAt).toISOString(),
  };
}

async function listRaw<T extends ContentType>(type: T, category?: string): Promise<Content<T>[]> {
  const rows = await withContext(null, (tx) =>
    tx
      .select()
      .from(contentItems)
      .where(and(eq(contentItems.type, type), category ? sql`(${contentItems.category} = ${category} or ${contentItems.body}->'categories' ? ${category})` : undefined))
      .orderBy(asc(contentItems.sort), asc(contentItems.title)),
  );
  return rows.filter((r) => r.status === "published" || r.status === "in_review").map((r) => toContent<T>(r));
}

async function getRaw<T extends ContentType>(type: T, slug: string): Promise<Content<T> | null> {
  const rows = await withContext(null, (tx) => tx.select().from(contentItems).where(and(eq(contentItems.type, type), eq(contentItems.slug, slug))).limit(1));
  const r = rows[0];
  if (!r || (r.status !== "published" && r.status !== "in_review")) return null;
  return toContent<T>(r);
}

/** Ommaviy (anonim) oʻqish — RLS bilan, natija kesh qilinadi va nashrda yangilanadi. */
export const listContent = unstable_cache(listRaw, ["content-list"], { tags: [CONTENT_TAG], revalidate: 600 }) as typeof listRaw;
export const getContent = unstable_cache(getRaw, ["content-get"], { tags: [CONTENT_TAG], revalidate: 600 }) as typeof getRaw;

export const listCategories = unstable_cache(
  async (type: string) => withContext(null, (tx) => tx.select().from(categories).where(eq(categories.type, type)).orderBy(asc(categories.sort))),
  ["categories"],
  { tags: [CONTENT_TAG], revalidate: 600 },
);

export const getContentStats = unstable_cache(
  async () => {
    const rows = await withContext(null, (tx) => tx.select({ type: contentItems.type, status: contentItems.status, n: sql<number>`count(*)::int` }).from(contentItems).groupBy(contentItems.type, contentItems.status));
    return rows;
  },
  ["content-stats"],
  { tags: [CONTENT_TAG], revalidate: 600 },
);

/** Kunlik kontent: sanaga bogʻliq, deterministik tanlov (barcha foydalanuvchilarda bir xil). */
export function pickDaily<T>(items: T[], salt: number, date = new Date()): T | null {
  if (!items.length) return null;
  const day = Math.floor((date.getTime() + 5 * 3600_000) / 86_400_000); // Asia/Tashkent (UTC+5)
  return items[(day * 31 + salt) % items.length];
}
