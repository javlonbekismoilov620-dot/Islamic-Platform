import "server-only";

/**
 * CSRF himoyasi: holatni oʻzgartiruvchi API soʻrovlari faqat shu saytdan kelishi kerak.
 * (Server Action'larda Next.js Origin tekshiruvini avtomatik bajaradi.)
 */
export function assertSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function clientIp(h: Headers): string {
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "local").trim().slice(0, 64);
}
