import { sql } from "drizzle-orm";
import { getSystemDb } from "@/server/db/client";

/**
 * Bazaga asoslangan oddiy cheklovchi (serverless nusxalar orasida ham ishlaydi).
 * ok=true — soʻrovga ruxsat, ok=false — limit oshgan.
 */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<{ ok: boolean; retryAfter: number }> {
  const db = await getSystemDb();
  const res = (await db.execute(sql`
    insert into rate_limits(key, count, reset_at) values (${key}, 1, now() + make_interval(secs => ${windowSec}))
    on conflict (key) do update set
      count = case when rate_limits.reset_at < now() then 1 else rate_limits.count + 1 end,
      reset_at = case when rate_limits.reset_at < now() then now() + make_interval(secs => ${windowSec}) else rate_limits.reset_at end
    returning count, extract(epoch from (reset_at - now()))::int as retry
  `)) as unknown as { rows?: { count: number; retry: number }[] } | { count: number; retry: number }[];
  const rows = Array.isArray(res) ? res : (res.rows ?? []);
  const row = rows[0] ?? { count: 0, retry: 0 };
  return { ok: Number(row.count) <= limit, retryAfter: Math.max(0, Number(row.retry)) };
}
