import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { LoginForm } from "@/components/account/auth-forms";
import { LogoMark } from "@/components/ui/logo";

export const metadata: Metadata = { title: "Kirish", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getCurrentUser()) redirect("/profil");
  return (
    <div className="mx-auto max-w-md pt-6">
      <div className="card glass p-6 sm:p-8">
        <div className="mb-6 text-center">
          <LogoMark size={44} className="mx-auto" />
          <h1 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-fg">Hisobga kirish</h1>
          <p className="mt-1 text-sm text-muted">Saqlanganlar va progressingiz barcha qurilmalarda sinxronlanadi.</p>
        </div>
        <LoginForm next={typeof next === "string" ? next : undefined} />
      </div>
      <p className="mt-6 text-center text-sm text-muted">Hisobsiz ham saytning barcha imkoniyatlaridan foydalanish mumkin — maʼlumotlar qurilmangizda saqlanadi.</p>
    </div>
  );
}
