import { NextResponse } from "next/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { withContext } from "@/server/db/client";
import { userData } from "@/server/db/schema";
import { getCurrentUser } from "@/server/auth/session";
import { assertSameOrigin } from "@/server/auth/request";
import { rateLimit } from "@/server/auth/rate-limit";
import { SYNC_KEYS } from "@/lib/store-schema";

export const dynamic = "force-dynamic";

const KEYS = new Set<string>(SYNC_KEYS);
const MAX_BYTES = 256 * 1024;

export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ authenticated: false }, { headers: { "cache-control": "no-store" } });
  const rows = await withContext(me.id, (tx) => tx.select().from(userData).where(eq(userData.userId, me.id)));
  return NextResponse.json(
    { authenticated: true, user: { email: me.email, displayName: me.displayName, role: me.role }, items: rows.map((r) => ({ key: r.key, value: r.value, updatedAt: new Date(r.updatedAt).toISOString() })) },
    { headers: { "cache-control": "no-store" } },
  );
}

const PutBody = z.object({ items: z.array(z.object({ key: z.string(), value: z.unknown() })).max(20) });

export async function PUT(req: Request) {
  if (!assertSameOrigin(req)) return NextResponse.json({ error: "Ruxsat etilmagan manba" }, { status: 403 });
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Hisobga kiring" }, { status: 401 });
  const rl = await rateLimit(`sync:${me.id}`, 120, 60);
  if (!rl.ok) return NextResponse.json({ error: "Juda koʻp soʻrov" }, { status: 429 });

  const raw = await req.text();
  if (raw.length > MAX_BYTES * 4) return NextResponse.json({ error: "Maʼlumot hajmi juda katta" }, { status: 413 });
  let parsed;
  try {
    parsed = PutBody.parse(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Notoʻgʻri format" }, { status: 400 });
  }
  // null = standart qiymat; JSON null oʻrniga yozuv saqlanmaydi
  const items = parsed.items.filter((i) => KEYS.has(i.key) && i.value !== null && i.value !== undefined && JSON.stringify(i.value).length <= MAX_BYTES);
  if (!items.length) return NextResponse.json({ saved: 0 });

  await withContext(me.id, async (tx) => {
    for (const it of items) {
      await tx
        .insert(userData)
        .values({ userId: me.id, key: it.key, value: it.value as never, updatedAt: new Date() })
        .onConflictDoUpdate({ target: [userData.userId, userData.key], set: { value: it.value as never, updatedAt: sql`now()` } });
    }
  });
  return NextResponse.json({ saved: items.length });
}

export async function DELETE(req: Request) {
  if (!assertSameOrigin(req)) return NextResponse.json({ error: "Ruxsat etilmagan manba" }, { status: 403 });
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Hisobga kiring" }, { status: 401 });
  await withContext(me.id, (tx) => tx.delete(userData).where(and(eq(userData.userId, me.id), inArray(userData.key, [...KEYS]))));
  return NextResponse.json({ cleared: true });
}
