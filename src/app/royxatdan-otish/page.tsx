import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { RegisterForm } from "@/components/account/auth-forms";
import { LogoMark } from "@/components/ui/logo";

export const metadata: Metadata = { title: "Roʻyxatdan oʻtish", robots: { index: false } };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getCurrentUser()) redirect("/profil");
  return (
    <div className="mx-auto max-w-md pt-6">
      <div className="card glass p-6 sm:p-8">
        <div className="mb-6 text-center">
          <LogoMark size={44} className="mx-auto" />
          <h1 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-fg">Hisob yaratish</h1>
          <p className="mt-1 text-sm text-muted">Ixtiyoriy. Hozirgacha qurilmangizda saqlangan belgilar va progress hisobingizga koʻchiriladi.</p>
        </div>
        <RegisterForm next={typeof next === "string" ? next : undefined} />
      </div>
    </div>
  );
}
