/**
 * Foydalanuvchi rolini oʻrnatish (birinchi administratorni tayinlash uchun).
 * Ishlatish: npm run user:role -- --email ali@example.com --role admin
 * Rollar: user | editor | reviewer | admin
 */
async function main() {
  process.env.SKIP_AUTO_SEED = "true";
  const args = process.argv.slice(2);
  const get = (k: string) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
  const email = get("email")?.toLowerCase();
  const role = get("role");
  if (!email || !role || !["user", "editor", "reviewer", "admin"].includes(role)) {
    console.error("Ishlatish: npm run user:role -- --email <email> --role <user|editor|reviewer|admin>");
    process.exit(1);
  }
  const { getSystemDb } = await import("../src/server/db/client");
  const { users } = await import("../src/server/db/schema");
  const { eq } = await import("drizzle-orm");
  const db = await getSystemDb();
  const res = await db.update(users).set({ role: role as never }).where(eq(users.email, email)).returning({ id: users.id });
  if (!res.length) { console.error(`Foydalanuvchi topilmadi: ${email}. Avval saytda roʻyxatdan oʻting.`); process.exit(1); }
  console.log(`✓ ${email} → ${role}`);
}
main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
