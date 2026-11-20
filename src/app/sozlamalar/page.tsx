import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/card";
import { SettingsForm } from "@/components/account/settings-form";

export const metadata: Metadata = { title: "Sozlamalar", robots: { index: false } };

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Sozlamalar" subtitle="Sozlamalar qurilmangizda saqlanadi va hisobingizga kirsangiz sinxronlanadi." />
      <SettingsForm />
    </div>
  );
}
