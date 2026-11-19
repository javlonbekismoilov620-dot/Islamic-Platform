import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "@/components/ui/logo";

const groups = [
  { title: "Boʻlimlar", links: [["/quron", "Qurʼoni karim"], ["/ibodat/namoz", "Namoz darslari"], ["/duolar", "Duolar"], ["/zikrlar", "Zikrlar"], ["/hadislar", "Hadislar"]] },
  { title: "Vositalar", links: [["/namoz-vaqtlari", "Namoz vaqtlari"], ["/qibla", "Qibla"], ["/taqvim", "Hijriy taqvim"], ["/qidiruv", "Qidiruv"], ["/talaffuz", "Talaffuz qoʻllanmasi"]] },
  { title: "Ishonch", links: [["/manbalar", "Manbalar va tekshiruv"], ["/lugat", "Islomiy atamalar"], ["/maxfiylik", "Maxfiylik"], ["/sozlamalar", "Sozlamalar"]] },
] as const;

export function Footer() {
  return (
    <footer className="no-print mx-auto mt-20 max-w-6xl px-5 pb-10">
      <div className="card glass grid gap-8 p-6 sm:p-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{siteConfig.tagline}. Sunniy aqida, {siteConfig.madhhab} mazhabi asosida.</p>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-muted">
            Saytdagi maʼlumotlar fatvo emas. Shaxsiy masalalar boʻyicha malakali ulamoga yoki Oʻzbekiston musulmonlari idorasiga murojaat qiling.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <p className="mb-3 text-sm font-semibold text-fg">{g.title}</p>
            <ul className="space-y-2">
              {g.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted transition-colors hover:text-primary">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted">
        Qurʼon matni: Tanzil loyihasi (CC BY 3.0). Tarjimalar: QuranEnc.com. © {new Date().getFullYear()} {siteConfig.name}
      </p>
    </footer>
  );
}
