"use client";
import Link from "next/link";
import { useActionState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { loginAction, registerAction, type FormState } from "@/server/auth/actions";
import { Button } from "@/components/ui/button";

function Field({ label, name, type = "text", autoComplete, defaultValue, required = true, hint }: { label: string; name: string; type?: string; autoComplete?: string; defaultValue?: string; required?: boolean; hint?: string }) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
      <span className="relative block">
        <input name={name} type={isPw && show ? "text" : type} autoComplete={autoComplete} defaultValue={defaultValue} required={required} className="h-12 w-full rounded-2xl border border-line bg-surface-solid px-4 text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        {isPw && (
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Parolni yashirish" : "Parolni koʻrsatish"} className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 text-muted hover:text-fg">
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </span>
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function Alert({ state }: { state: FormState }) {
  if (!state?.error && !state?.ok) return null;
  return <p role="alert" className={state.error ? "rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger" : "rounded-2xl bg-success-soft px-4 py-3 text-sm text-success"}>{state.error ?? state.ok}</p>;
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? "/profil"} />
      <Alert state={state} />
      <Field label="Elektron pochta" name="email" type="email" autoComplete="email" defaultValue={state?.fields?.email} />
      <Field label="Parol" name="password" type="password" autoComplete="current-password" />
      <Button type="submit" className="w-full" disabled={pending}>{pending && <Loader2 size={17} className="animate-spin" />} Kirish</Button>
      <p className="text-center text-sm text-muted">Hisobingiz yoʻqmi? <Link href={`/royxatdan-otish${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-medium text-primary">Roʻyxatdan oʻting</Link></p>
      <p className="text-center text-xs leading-relaxed text-muted">Parolni unutgan boʻlsangiz, sayt administratoriga murojaat qiling. Elektron pochta orqali tiklash xizmati hali sozlanmagan.</p>
    </form>
  );
}

export function RegisterForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(registerAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next ?? "/profil"} />
      <Alert state={state} />
      <Field label="Ismingiz (ixtiyoriy)" name="name" autoComplete="nickname" required={false} defaultValue={state?.fields?.name} />
      <Field label="Elektron pochta" name="email" type="email" autoComplete="email" defaultValue={state?.fields?.email} />
      <Field label="Parol" name="password" type="password" autoComplete="new-password" hint="Kamida 8 belgi. Boshqa saytlarda ishlatmagan parolingizni tanlang." />
      <label className="flex items-start gap-3 text-sm text-fg-2">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
        <span><Link href="/maxfiylik" className="text-primary underline-offset-2 hover:underline">Maxfiylik siyosati</Link> bilan tanishdim. Shaxsiy maʼlumotlarim faqat hisobim ishlashi uchun saqlanishiga roziman.</span>
      </label>
      <Button type="submit" className="w-full" disabled={pending}>{pending && <Loader2 size={17} className="animate-spin" />} Hisob yaratish</Button>
      <p className="text-center text-sm text-muted">Hisobingiz bormi? <Link href="/kirish" className="font-medium text-primary">Kirish</Link></p>
    </form>
  );
}
