import { NextResponse } from "next/server";
import { search } from "@/server/search";
import { rateLimit } from "@/server/auth/rate-limit";
import { clientIp } from "@/server/auth/request";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const rl = await rateLimit(`search:${clientIp(req.headers)}`, 120, 60);
  if (!rl.ok) return NextResponse.json({ error: "Juda koʻp soʻrov" }, { status: 429 });
  const res = await search(q);
  return NextResponse.json(res, { headers: { "cache-control": "public, max-age=60" } });
}
