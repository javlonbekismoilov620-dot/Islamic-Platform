import Link from "next/link";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="text-[0.8rem] font-semibold tracking-[0.1em] text-gold uppercase">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-fg">Sahifa topilmadi</h1>
      <p className="mt-3 text-fg-2">Siz izlagan sahifa mavjud emas yoki koʻchirilgan boʻlishi mumkin.</p>
      <div className="mt-6 flex justify-center gap-2">
        <LinkButton href="/">Bosh sahifa</LinkButton>
        <LinkButton href="/qidiruv" variant="secondary">Qidiruv</LinkButton>
      </div>
      <p className="mt-8 text-sm text-muted"><Link href="/quron" className="hover:text-primary">Qurʼon</Link> · <Link href="/duolar" className="hover:text-primary">Duolar</Link> · <Link href="/ibodat/namoz" className="hover:text-primary">Namoz darslari</Link></p>
    </div>
  );
}
