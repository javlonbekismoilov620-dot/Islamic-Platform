import type { Metadata } from "next";
import { getCurrentUser } from "@/server/auth/session";
import { listContent } from "@/server/content/repo";
import { getQuranMeta } from "@/server/quran";
import { Dashboard } from "@/components/account/dashboard";
import { PageHeader } from "@/components/ui/card";
import { duaHref } from "@/components/content/cards";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Profil va shaxsiy kabinet", robots: { index: false } };

export default async function ProfilePage() {
  const [user, meta, duas, hadiths, articles, lessons] = await Promise.all([getCurrentUser(), getQuranMeta(), listContent("dua"), listContent("hadith"), listContent("article"), listContent("lesson")]);
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Profil" subtitle="Saqlanganlar, oʻrganish progressi, kunlik maqsadlar va hisob sozlamalari." />
      <Dashboard
        user={user ? { email: user.email, displayName: user.displayName, role: user.role, createdAt: user.createdAt } : null}
        lookups={{
          surahs: meta.surahs.map((s) => ({ n: s.n, uz: s.uz, ayahs: s.ayahs })),
          duas: Object.fromEntries(duas.map((d) => [d.slug, { title: d.title, href: duaHref(d) }])),
          hadiths: Object.fromEntries(hadiths.map((h) => [h.slug, h.title])),
          articles: Object.fromEntries(articles.map((a) => [`${a.category}/${a.slug}`, a.title])),
          lessons: lessons.sort((a, b) => a.body.order - b.body.order).map((l) => ({ slug: l.slug, title: l.title })),
        }}
      />
    </div>
  );
}
