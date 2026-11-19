import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { withContext } from "@/server/db/client";
import { userData, users } from "@/server/db/schema";
import { getCurrentUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

/** Foydalanuvchining barcha maʼlumotlarini JSON fayl sifatida yuklab olish (maxfiylik huquqi). */
export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Hisobga kiring" }, { status: 401 });
  const data = await withContext(me.id, async (tx) => {
    const [profile] = await tx.select({ email: users.email, displayName: users.displayName, createdAt: users.createdAt, lastLoginAt: users.lastLoginAt }).from(users).where(eq(users.id, me.id));
    const items = await tx.select({ key: userData.key, value: userData.value, updatedAt: userData.updatedAt }).from(userData).where(eq(userData.userId, me.id));
    return { profile, items };
  });
  return new NextResponse(JSON.stringify({ exportedAt: new Date().toISOString(), ...data }, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8", "content-disposition": 'attachment; filename="hidoyat-maʼlumotlarim.json"'.replace("ʼ", ""), "cache-control": "no-store" },
  });
}
