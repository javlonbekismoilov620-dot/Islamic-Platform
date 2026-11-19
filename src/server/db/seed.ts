import { sql } from "drizzle-orm";
import type { Db } from "./client";
import { categories, contentItems, sources } from "./schema";
import { buildSeed, seedSearchText } from "@/content/seed";
import { CATEGORIES } from "@/content/seed/categories";
import { SOURCES_CATALOG } from "./sources-catalog";

/** Boʻsh bazaga boshlangʻich maʼlumotlarni yozadi. Tizim (egasi) ulanishida bajariladi. */
export async function seedIfEmpty(db: Db, opts: { force?: boolean } = {}) {
  const res = (await db.execute(sql`select count(*)::int as n from content_items`)) as unknown as { rows?: { n: number }[] } | { n: number }[];
  const rows = Array.isArray(res) ? res : (res.rows ?? []);
  if (!opts.force && (rows[0]?.n ?? 0) > 0) return { seeded: false };

  await db.transaction(async (tx) => {
    if (opts.force) {
      await tx.execute(sql`delete from content_items where origin in ('ai_draft', 'import')`);
      await tx.execute(sql`delete from categories`);
      await tx.execute(sql`delete from sources`);
    }
    await tx.insert(categories).values(CATEGORIES.map((c) => ({ ...c }))).onConflictDoNothing();
    await tx.insert(sources).values(SOURCES_CATALOG.map((s) => ({ ...s, publisher: s.publisher ?? null, url: s.url ?? null, notes: s.notes ?? null }))).onConflictDoNothing();
    const items = buildSeed();
    const chunk = 50;
    for (let i = 0; i < items.length; i += chunk) {
      await tx
        .insert(contentItems)
        .values(
          items.slice(i, i + chunk).map((it) => ({
            type: it.type,
            slug: it.slug,
            category: it.category,
            title: it.title,
            summary: it.summary ?? null,
            body: it.body as unknown as Record<string, unknown>,
            refs: it.refs,
            status: "in_review" as const,
            origin: "ai_draft" as const,
            sort: it.sort ?? 0,
            searchText: seedSearchText(it),
            submittedAt: new Date(),
          })),
        )
        .onConflictDoNothing();
    }
  });
  console.log("[db] boshlangʻich kontent yozildi (holat: tekshiruvda)");
  return { seeded: true };
}
