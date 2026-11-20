import { sql } from "drizzle-orm";
import type { PgDatabase } from "drizzle-orm/pg-core";
import { runMigrations } from "./migrate";

export type Db = PgDatabase<any, any, any>;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

type Holder = { db?: Promise<Db> };
const g = globalThis as unknown as { __hidoyatDb?: Holder };
const holder: Holder = (g.__hidoyatDb ??= {});

/** Bir vaqtda ishga tushgan server nusxalari migratsiya va seedni navbat bilan bajarishi uchun. */
const SETUP_LOCK = 72019001;

async function seedUnlessSkipped(db: Db) {
  if (process.env.SKIP_AUTO_SEED === "true") return;
  const { seedIfEmpty } = await import("./seed");
  await seedIfEmpty(db);
}

async function create(): Promise<Db> {
  // DATABASE_URL — Neon va boshqalar; POSTGRES_URL — baʼzi Vercel integratsiyalari shu nomni beradi.
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  let db: Db;
  let exec: (q: string) => Promise<unknown>;
  if (url) {
    const { default: postgres } = await import("postgres");
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const client = postgres(url, { max: Number(process.env.DATABASE_POOL_MAX ?? 5), prepare: false, idle_timeout: 20, onnotice: () => {} });
    db = drizzle(client) as unknown as Db;
    // Faqat tranzaksiya darajasidagi qulf: ulanish puli (PgBouncer, tranzaksiya rejimi) orqali ham
    // toʻgʻri ishlaydi va tranzaksiya tugashi bilan albatta boʻshaydi.
    await client.begin(async (t) => {
      await t.unsafe(`select pg_advisory_xact_lock(${SETUP_LOCK})`);
      await runMigrations((q) => t.unsafe(q), (q) => t.unsafe(q), { wrap: false });
    });
    if (process.env.SKIP_AUTO_SEED !== "true") {
      await db.transaction(async (tx) => {
        await tx.execute(sql.raw(`select pg_advisory_xact_lock(${SETUP_LOCK})`));
        const { seedIfEmpty } = await import("./seed");
        await seedIfEmpty(tx as unknown as Db);
      });
    }
    return db;
  } else {
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_PGLITE_IN_PRODUCTION !== "true") {
      throw new Error("Maʼlumotlar bazasi ulanmagan: DATABASE_URL (yoki POSTGRES_URL) oʻrnatilmagan. Vercel'da: Storage → Neon Postgres bazasini loyihaga ulang va qayta deploy qiling.");
    }
    const { PGlite } = await import("@electric-sql/pglite");
    const { drizzle } = await import("drizzle-orm/pglite");
    const dataDir = process.env.PGLITE_DIR ?? (process.env.NODE_ENV === "test" ? undefined : ".data/pglite");
    if (dataDir) (await import("node:fs")).mkdirSync(dataDir, { recursive: true });
    const client = dataDir ? new PGlite(dataDir) : new PGlite();
    await client.waitReady;
    db = drizzle(client) as unknown as Db;
    exec = (q) => client.exec(q);
  }
  await runMigrations(exec, (q) => db.execute(sql.raw(q)) as Promise<unknown>);
  await seedUnlessSkipped(db);
  return db;
}

/** Tizim ulanishi (RLS chetlab oʻtiladi). Faqat autentifikatsiya va tizim vazifalari uchun. */
export function getSystemDb(): Promise<Db> {
  holder.db ??= create().catch((e) => {
    holder.db = undefined;
    throw e;
  });
  return holder.db;
}

export const showPending = () => (process.env.CONTENT_VISIBILITY ?? "include_pending") === "include_pending";

/**
 * Foydalanuvchi kontekstida (RLS bilan) tranzaksiya. Barcha ilova soʻrovlari shu orqali bajariladi.
 * userId — sessiyadan olingan, mijozdan kelgan qiymat emas.
 */
export async function withContext<T>(userId: string | null, fn: (tx: Tx) => Promise<T>, opts: { includePending?: boolean } = {}): Promise<T> {
  const db = await getSystemDb();
  const pending = opts.includePending ?? showPending();
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.user_id', ${userId ?? ""}, true), set_config('app.show_pending', ${pending ? "on" : "off"}, true)`);
    await tx.execute(sql.raw("set local role app_user"));
    return fn(tx);
  });
}
