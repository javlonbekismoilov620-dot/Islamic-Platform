import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { listCategories, listContent } from "@/server/content/repo";
import { duaHref, hadithHref } from "@/components/content/cards";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const u = (p: string) => `${siteConfig.url}${p}`;
  const staticPaths = ["/", "/quron", "/ibodat", "/ibodat/namoz", "/duolar", "/zikrlar", "/bilimlar", "/hadislar", "/namoz-vaqtlari", "/qibla", "/taqvim", "/qidiruv", "/lugat", "/talaffuz", "/manbalar", "/maxfiylik"];
  const [duas, dhikr, hadiths, articles, lessons, duaCats, artCats] = await Promise.all([listContent("dua"), listContent("dhikr"), listContent("hadith"), listContent("article"), listContent("lesson"), listCategories("dua"), listCategories("article")]);
  return [
    ...staticPaths.map((p) => ({ url: u(p), changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.8 })),
    ...Array.from({ length: 114 }, (_, i) => ({ url: u(`/quron/${i + 1}`), changeFrequency: "yearly" as const, priority: 0.9 })),
    ...duaCats.map((c) => ({ url: u(`/duolar/${c.slug}`), priority: 0.7 })),
    ...duas.map((d) => ({ url: u(duaHref(d)), lastModified: d.updatedAt, priority: 0.6 })),
    ...dhikr.map((d) => ({ url: u(`/zikrlar/${d.slug}`), priority: 0.5 })),
    ...hadiths.map((h) => ({ url: u(hadithHref(h)), lastModified: h.updatedAt, priority: 0.6 })),
    ...artCats.map((c) => ({ url: u(`/bilimlar/${c.slug}`), priority: 0.6 })),
    ...articles.map((a) => ({ url: u(`/bilimlar/${a.category}/${a.slug}`), lastModified: a.updatedAt, priority: 0.7 })),
    ...lessons.map((l) => ({ url: u(`/ibodat/namoz/${l.slug}`), lastModified: l.updatedAt, priority: 0.8 })),
  ];
}
