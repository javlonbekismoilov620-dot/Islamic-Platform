"use client";
import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
import { BookOpen, BookmarkCheck, Brain, Download, Flame, GraduationCap, History, LogOut, Settings, ShieldCheck, Target, Trash2, UserRound } from "lucide-react";
import { useHydrated, useStore, todayKey, setStore } from "@/lib/store";
import { DEFAULTS, SYNC_KEYS } from "@/lib/store-schema";
import { changePasswordAction, deleteAccountAction, logoutAction, updateProfileAction, type FormState } from "@/server/auth/actions";
import { markLoggedOut, syncNow } from "@/lib/sync";
import { Ring } from "@/components/home/dashboard-widgets";
import { Button, LinkButton } from "@/components/ui/button";
import { Dialog } from "@/components/ui/controls";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";

export type DashUser = { email: string; displayName: string | null; role: string; createdAt: string } | null;
export type Lookups = {
  surahs: { n: number; uz: string; ayahs: number }[];
  duas: Record<string, { title: string; href: string }>;
  hadiths: Record<string, string>;
  articles: Record<string, string>;
  lessons: { slug: string; title: string }[];
};

function streak(days: string[]): number {
  const set = new Set(days);
  let n = 0;
  const d = new Date();
  for (;;) {
    const k = todayKey(new Date(d.getTime() - n * 86400_000));
    if (!set.has(k)) break;
    n++;
  }
  return n;
}

export function Dashboard({ user, lookups }: { user: DashUser; lookups: Lookups }) {
  const hydrated = useHydrated();
  const [bm] = useStore("bookmarks");
  const [learning] = useStore("learning");
  const [qp] = useStore("quranProgress");
  const [dhikr] = useStore("dhikr");
  const [goals, setGoals] = useStore("goals");
  const [history] = useStore("history");
  const [checklist] = useStore("checklist");
  const [lastRead] = useStore("lastRead");
  const day = todayKey();
  const loggedIn = !!user;
  useEffect(() => {
    if (loggedIn) syncNow();
  }, [loggedIn]);

  const activeDays = useMemo(() => {
    const s = new Set<string>();
    Object.entries(checklist).forEach(([k, v]) => Object.values(v).some(Boolean) && s.add(k));
    Object.keys(dhikr.daily).forEach((k) => s.add(k));
    Object.entries(qp.daily).forEach(([k, v]) => v > 0 && s.add(k));
    return [...s];
  }, [checklist, dhikr.daily, qp.daily]);

  if (!hydrated) return <div className="space-y-4"><div className="skeleton h-32" /><div className="skeleton h-48" /></div>;

  const totalRead = Object.values(qp.maxAyah).reduce((a, b) => a + b, 0);
  const todayAyahs = qp.daily[day] ?? 0;
  const todayDhikr = Object.values(dhikr.daily[day] ?? {}).reduce((a, b) => a + b, 0);
  const st = streak(activeDays);
  const lr = lastRead ? lookups.surahs.find((s) => s.n === lastRead.surah) : null;

  return (
    <div className="space-y-8">
      <section className="hero flex flex-wrap items-center gap-5 p-6 sm:p-7">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-2xl font-semibold">{user ? (user.displayName ?? user.email)[0]?.toUpperCase() : <UserRound size={28} />}</span>
        <div className="min-w-0 flex-1">
          <p className="text-xl font-semibold">{user ? user.displayName ?? "Assalomu alaykum" : "Mehmon rejimi"}</p>
          <p className="text-sm opacity-80">{user ? user.email : "Maʼlumotlaringiz faqat shu qurilmada saqlanmoqda"}</p>
          {user && user.role !== "user" && <Badge className="mt-2 border-white/20 bg-white/15 text-[var(--hero-text)]" icon={<ShieldCheck size={12} />}>{{ editor: "Muharrir", reviewer: "Tekshiruvchi", admin: "Administrator" }[user.role]}</Badge>}
        </div>
        <div className="flex flex-wrap gap-2">
          {!user && <LinkButton href="/royxatdan-otish" variant="secondary" size="sm">Hisob yaratish</LinkButton>}
          {!user && <LinkButton href="/kirish" variant="ghost" size="sm" className="text-[var(--hero-text)] hover:bg-white/10">Kirish</LinkButton>}
          {user && user.role !== "user" && <LinkButton href="/admin" variant="secondary" size="sm"><ShieldCheck size={15} /> Boshqaruv paneli</LinkButton>}
          <LinkButton href="/sozlamalar" variant="ghost" size="sm" className="text-[var(--hero-text)] hover:bg-white/10"><Settings size={15} /> Sozlamalar</LinkButton>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={<BookOpen size={16} />} label="Qurʼon" value={`${((totalRead / 6236) * 100).toFixed(1)}%`} sub={`${totalRead} oyat oʻqilgan`} ring={totalRead / 6236} />
        <Stat icon={<GraduationCap size={16} />} label="Namoz darslari" value={`${learning.completed.length}/${lookups.lessons.length}`} sub="tugallangan" ring={learning.completed.length / Math.max(1, lookups.lessons.length)} />
        <Stat icon={<Target size={16} />} label="Bugungi zikr" value={String(todayDhikr)} sub={`maqsad ${goals.dailyDhikr}`} ring={todayDhikr / Math.max(1, goals.dailyDhikr)} />
        <Stat icon={<Flame size={16} />} label="Faol kunlar ketma-ket" value={String(st)} sub={st ? "kun" : "bugundan boshlang"} ring={Math.min(1, st / 7)} />
      </section>

      <section className="card glass p-5 sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-fg"><Target size={17} className="text-primary" /> Kunlik maqsadlar</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <GoalInput label="Har kuni oʻqiladigan oyatlar" value={goals.dailyAyahs} onChange={(v) => setGoals((g) => ({ ...g, dailyAyahs: v }))} progress={`Bugun: ${todayAyahs}`} />
          <GoalInput label="Har kungi zikr soni" value={goals.dailyDhikr} onChange={(v) => setGoals((g) => ({ ...g, dailyDhikr: v }))} progress={`Bugun: ${todayDhikr}`} />
        </div>
        <p className="mt-3 text-xs text-muted">Bu shaxsiy maqsadlar — diniy majburiyat emas. Kichik, lekin doimiy amal Allohga sevimliroq.</p>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card glass p-5 sm:p-6">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-fg"><BookmarkCheck size={17} className="text-gold" /> Saqlanganlar</h2>
          <SavedGroup title="Oyatlar" items={bm.ayahs.map((id) => { const [s, a] = id.split(":"); return { key: id, label: `${lookups.surahs.find((x) => x.n === Number(s))?.uz} ${a}`, href: `/quron/${s}#oyat-${a}` }; })} />
          <SavedGroup title="Duolar" items={bm.duas.filter((s) => lookups.duas[s]).map((s) => ({ key: s, label: lookups.duas[s].title, href: lookups.duas[s].href }))} />
          <SavedGroup title="Hadislar" items={bm.hadiths.filter((s) => lookups.hadiths[s]).map((s) => ({ key: s, label: lookups.hadiths[s], href: `/hadislar/${s}` }))} />
          <SavedGroup title="Maqolalar" items={bm.articles.filter((s) => lookups.articles[s]).map((s) => ({ key: s, label: lookups.articles[s], href: `/bilimlar/${s}` }))} />
          {!bm.ayahs.length && !bm.duas.length && !bm.hadiths.length && !bm.articles.length && <p className="text-sm text-muted">Oyat, duo, hadis yoki maqola yonidagi belgi tugmasini bosib saqlang.</p>}
        </section>

        <section className="card glass p-5 sm:p-6">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-fg"><History size={17} className="text-primary" /> Oʻqish tarixi</h2>
          {lr && <Link href={`/quron/${lr.n}#oyat-${lastRead!.ayah}`} className="mb-3 block rounded-2xl bg-primary-soft px-4 py-3 text-sm text-fg">Qurʼon: <span className="font-semibold">{lr.uz} surasi, {lastRead!.ayah}-oyat</span> — davom ettirish</Link>}
          <ul className="space-y-1.5 text-sm">
            {history.slice(0, 8).map((h) => (
              <li key={h.kind + h.ref} className="flex justify-between gap-3 text-fg-2">
                <Link href={h.kind === "lesson" ? `/ibodat/namoz/${h.ref}` : "/"} className="hover:text-primary">{h.title}</Link>
                <span className="shrink-0 text-xs text-muted">{new Date(h.at).toLocaleDateString("uz-UZ")}</span>
              </li>
            ))}
          </ul>
          {!history.length && !lr && <p className="text-sm text-muted">Hali tarix yoʻq.</p>}
          <div className="mt-4 border-t border-line pt-3">
            <p className="mb-2 text-sm font-medium text-fg">Tugallangan darslar</p>
            <div className="flex flex-wrap gap-1.5">
              {lookups.lessons.map((l) => <Link key={l.slug} href={`/ibodat/namoz/${l.slug}`} className={cn("rounded-full px-3 py-1 text-xs", learning.completed.includes(l.slug) ? "bg-primary text-on-primary" : "bg-sunken text-muted")}>{l.title}</Link>)}
            </div>
          </div>
        </section>
      </div>

      <Memorization surahs={lookups.surahs} />

      {user ? <AccountSection user={user} /> : <GuestData />}
    </div>
  );
}

function Stat({ icon, label, value, sub, ring }: { icon: React.ReactNode; label: string; value: string; sub: string; ring: number }) {
  return (
    <div className="card glass flex items-center gap-3 p-4">
      <Ring value={ring} size={46} stroke={4}><span className="text-primary">{icon}</span></Ring>
      <div className="min-w-0">
        <p className="truncate text-xs text-muted">{label}</p>
        <p className="text-lg font-semibold text-fg tabular-nums">{value}</p>
        <p className="truncate text-xs text-muted">{sub}</p>
      </div>
    </div>
  );
}

function GoalInput({ label, value, onChange, progress }: { label: string; value: number; onChange: (v: number) => void; progress: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 flex justify-between"><span className="font-medium text-fg">{label}</span><span className="text-muted">{progress}</span></span>
      <input type="number" min={1} max={10000} value={value} onChange={(e) => onChange(Math.max(1, Math.min(10000, Number(e.target.value) || 1)))} className="h-11 w-full rounded-xl border border-line bg-surface-solid px-3 text-fg tabular-nums" />
    </label>
  );
}

function SavedGroup({ title, items }: { title: string; items: { key: string; label: string; href: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="mb-3">
      <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted uppercase">{title}</p>
      <div className="flex flex-wrap gap-1.5">{items.map((i) => <Link key={i.key} href={i.href} className="rounded-full bg-sunken px-3 py-1 text-sm text-fg-2 hover:text-primary">{i.label}</Link>)}</div>
    </div>
  );
}

function Memorization({ surahs }: { surahs: { n: number; uz: string; ayahs: number }[] }) {
  const [mem, setMem] = useStore("memorization");
  const [pick, setPick] = useState(112);
  const entries = Object.entries(mem).sort((a, b) => Number(b[0]) - Number(a[0]));
  const memorized = entries.filter(([, v]) => v.status === "memorized").reduce((s, [k]) => s + (surahs.find((x) => x.n === Number(k))?.ayahs ?? 0), 0);
  return (
    <section className="card glass p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-fg"><Brain size={17} className="text-primary" /> Qurʼon yodlash</h2>
          <p className="text-sm text-muted">Yodlangan oyatlar: {memorized}. Har bir sura uchun yodlash holatini belgilang.</p>
        </div>
        <div className="flex gap-2">
          <select value={pick} onChange={(e) => setPick(Number(e.target.value))} className="h-10 rounded-xl border border-line bg-surface-solid px-3 text-sm text-fg">
            {surahs.slice().reverse().map((s) => <option key={s.n} value={s.n}>{s.n}. {s.uz}</option>)}
          </select>
          <Button size="sm" onClick={() => { setMem((m) => ({ ...m, [pick]: m[pick] ?? { status: "learning", ayahs: 0, updatedAt: Date.now() } })); toast("Yodlash roʻyxatiga qoʻshildi"); }}>Qoʻshish</Button>
        </div>
      </div>
      {entries.length === 0 ? <p className="text-sm text-muted">Yodlash uchun sura qoʻshing. Qisqa suralardan boshlash tavsiya etiladi.</p> : (
        <ul className="divide-y divide-line">
          {entries.map(([k, v]) => {
            const s = surahs.find((x) => x.n === Number(k));
            if (!s) return null;
            return (
              <li key={k} className="flex flex-wrap items-center gap-3 py-3">
                <Link href={`/quron/${k}`} className="min-w-0 flex-1 font-medium text-fg hover:text-primary">{s.n}. {s.uz} <span className="text-xs font-normal text-muted">({s.ayahs} oyat)</span></Link>
                {v.status === "learning" && (
                  <label className="flex items-center gap-2 text-xs text-muted">
                    Yodlangan oyatlar
                    <input type="number" min={0} max={s.ayahs} value={v.ayahs} onChange={(e) => setMem((m) => ({ ...m, [k]: { ...v, ayahs: Math.max(0, Math.min(s.ayahs, Number(e.target.value) || 0)), updatedAt: Date.now() } }))} className="h-9 w-16 rounded-lg border border-line bg-surface-solid px-2 text-sm text-fg tabular-nums" />
                  </label>
                )}
                <button type="button" onClick={() => setMem((m) => ({ ...m, [k]: { ...v, status: v.status === "memorized" ? "learning" : "memorized", ayahs: v.status === "memorized" ? v.ayahs : s.ayahs, updatedAt: Date.now() } }))} className={cn("rounded-full px-3 py-1 text-xs font-medium", v.status === "memorized" ? "bg-primary text-on-primary" : "bg-sunken text-fg-2")}>
                  {v.status === "memorized" ? "Yodlangan ✓" : "Yodlanmoqda"}
                </button>
                <button type="button" aria-label="Olib tashlash" onClick={() => setMem((m) => { const n = { ...m }; delete n[k]; return n; })} className="rounded-full p-1.5 text-muted hover:text-danger"><Trash2 size={15} /></button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function GuestData() {
  const [open, setOpen] = useState(false);
  return (
    <section className="card glass p-5 sm:p-6">
      <h2 className="mb-1 font-semibold text-fg">Maʼlumotlarim</h2>
      <p className="mb-4 text-sm text-muted">Mehmon rejimida barcha maʼlumotlar faqat shu brauzerda saqlanadi va hech qayerga yuborilmaydi.</p>
      <Button variant="danger" size="sm" onClick={() => setOpen(true)}><Trash2 size={15} /> Barcha mahalliy maʼlumotlarni oʻchirish</Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Mahalliy maʼlumotlarni oʻchirasizmi?" footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Bekor qilish</Button><Button variant="danger" onClick={() => { SYNC_KEYS.forEach((k) => setStore(k, DEFAULTS[k] as never)); setOpen(false); toast("Maʼlumotlar oʻchirildi"); }}>Oʻchirish</Button></>}>
        Saqlanganlar, progress, zikr tarixi va sozlamalar shu qurilmadan oʻchiriladi. Bu amalni qaytarib boʻlmaydi.
      </Dialog>
    </section>
  );
}

function FormAlert({ s }: { s: FormState }) {
  if (!s?.error && !s?.ok) return null;
  return <p role="alert" className={cn("rounded-xl px-3 py-2 text-sm", s.error ? "bg-danger-soft text-danger" : "bg-success-soft text-success")}>{s.error ?? s.ok}</p>;
}

function AccountSection({ user }: { user: NonNullable<DashUser> }) {
  const [p1, a1, pend1] = useActionState(updateProfileAction, undefined);
  const [p2, a2, pend2] = useActionState(changePasswordAction, undefined);
  const [p3, a3, pend3] = useActionState(deleteAccountAction, undefined);
  const [del, setDel] = useState(false);
  const input = "h-11 w-full rounded-xl border border-line bg-surface-solid px-3 text-fg";
  return (
    <section className="card glass space-y-6 p-5 sm:p-6">
      <h2 className="font-semibold text-fg">Hisob</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <form action={a1} className="space-y-3">
          <p className="text-sm font-medium text-fg">Ism</p>
          <FormAlert s={p1} />
          <input name="name" defaultValue={user.displayName ?? ""} maxLength={80} className={input} aria-label="Ism" />
          <Button type="submit" size="sm" variant="soft" disabled={pend1}>Saqlash</Button>
        </form>
        <form action={a2} className="space-y-3">
          <p className="text-sm font-medium text-fg">Parolni oʻzgartirish</p>
          <FormAlert s={p2} />
          <input name="current" type="password" autoComplete="current-password" placeholder="Joriy parol" required className={input} aria-label="Joriy parol" />
          <input name="next" type="password" autoComplete="new-password" placeholder="Yangi parol (kamida 8 belgi)" required minLength={8} className={input} aria-label="Yangi parol" />
          <Button type="submit" size="sm" variant="soft" disabled={pend2}>Oʻzgartirish</Button>
        </form>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-line pt-5">
        <a href="/api/me/export" className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-sm font-medium text-fg-2 hover:bg-sunken"><Download size={15} /> Maʼlumotlarimni yuklab olish</a>
        <form action={logoutAction} onSubmit={() => markLoggedOut()}><Button type="submit" variant="ghost" size="sm"><LogOut size={15} /> Chiqish</Button></form>
        <Button variant="danger" size="sm" onClick={() => setDel(true)}><Trash2 size={15} /> Hisobni oʻchirish</Button>
      </div>
      <Dialog open={del} onClose={() => setDel(false)} title="Hisobni butunlay oʻchirasizmi?">
        <form action={a3} className="space-y-3">
          <p>Hisobingiz va serverdagi barcha maʼlumotlaringiz oʻchiriladi. Tasdiqlash uchun parolingizni kiriting.</p>
          <FormAlert s={p3} />
          <input name="password" type="password" required autoComplete="current-password" className={input} aria-label="Parol" />
          <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setDel(false)}>Bekor qilish</Button><Button type="submit" variant="danger" disabled={pend3}>Oʻchirish</Button></div>
        </form>
      </Dialog>
      <p className="text-xs text-muted">Hisob yaratilgan: {new Date(user.createdAt).toLocaleDateString("uz-UZ")}</p>
    </section>
  );
}
