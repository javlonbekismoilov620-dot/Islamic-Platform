import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = { title: "Internet aloqasi yoʻq", robots: { index: false } };

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <WifiOff size={36} className="mx-auto text-muted" />
      <h1 className="mt-4 text-2xl font-bold text-fg">Internet aloqasi yoʻq</h1>
      <p className="mt-3 text-fg-2">Avval ochilgan sahifalar (suralar, duolar, darslar) oflayn ham ochiladi. Aloqa tiklangach, sahifani yangilang.</p>
      <p className="mt-6 text-sm"><Link href="/" className="text-primary">Bosh sahifa</Link> · <Link href="/quron" className="text-primary">Qurʼon</Link> · <Link href="/zikrlar" className="text-primary">Zikrlar</Link></p>
    </div>
  );
}
