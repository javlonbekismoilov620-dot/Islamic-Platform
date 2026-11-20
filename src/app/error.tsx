"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-3xl font-bold tracking-[-0.02em] text-fg">Kutilmagan xatolik</h1>
      <p className="mt-3 text-fg-2">Sahifani yuklashda muammo yuz berdi. Iltimos, qayta urinib koʻring.</p>
      {error.digest && <p className="mt-2 font-mono text-xs text-muted">Kod: {error.digest}</p>}
      <Button className="mt-6" onClick={reset}>Qayta urinish</Button>
    </div>
  );
}
