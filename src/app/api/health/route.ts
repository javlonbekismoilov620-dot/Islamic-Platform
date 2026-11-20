import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { databaseEnvNames, getSystemDb, resolveDatabaseUrl } from "@/server/db/client";

export const dynamic = "force-dynamic";

/** Xato matnidan manzil va xost nomlarini olib tashlaydi; parol va ulanish satri hech qachon chiqmaydi. */
function safeError(e: unknown): string {
  const err = e as { code?: unknown; message?: unknown };
  const msg = String(err?.message ?? e)
    .split("\n")[0]
    .replace(/[a-z][a-z0-9+.-]*:\/\/\S+/gi, "<url>")
    .replace(/\b[\w-]+(?:\.[\w-]+){2,}\b/g, "<host>")
    .slice(0, 300);
  return typeof err?.code === "string" ? `${err.code}: ${msg}` : msg;
}

function rowsOf<T>(res: unknown): T[] {
  return Array.isArray(res) ? (res as T[]) : ((res as { rows?: T[] }).rows ?? []);
}

/**
 * Holat tekshiruvi: sayt egasi Vercel loglarisiz ham bazaning ulanganini, migratsiya va kontent
 * yozilganini koʻra oladi. Maxfiy qiymatlar (ulanish satri, parol) qaytarilmaydi.
 */
export async function GET() {
  const started = Date.now();
  const database = {
    configured: Boolean(resolveDatabaseUrl()),
    envNames: databaseEnvNames(),
    connected: false,
    migrations: [] as string[],
    contentItems: null as number | null,
    error: null as string | null,
    ms: 0,
  };
  try {
    const db = await getSystemDb();
    database.migrations = rowsOf<{ name: string }>(await db.execute(sql`select name from schema_migrations order by name`)).map((r) => r.name);
    database.contentItems = rowsOf<{ n: number }>(await db.execute(sql`select count(*)::int as n from content_items`))[0]?.n ?? 0;
    database.connected = true;
  } catch (e) {
    database.error = safeError(e);
  }
  database.ms = Date.now() - started;
  const ok = database.connected && (database.contentItems ?? 0) > 0;
  const body = {
    ok,
    deployment: {
      env: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? null,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
      region: process.env.VERCEL_REGION ?? null,
    },
    database,
  };
  return NextResponse.json(body, { status: ok ? 200 : 503, headers: { "cache-control": "no-store" } });
}
