/** PostgreSQL (DATABASE_URL) yoki lokal PGlite bazasiga migratsiyalarni qoʻllash. */
async function main() {
  process.env.SKIP_AUTO_SEED = "true";
  const { getSystemDb } = await import("../src/server/db/client");
  await getSystemDb();
  console.log("✓ migratsiyalar qoʻllandi");
}
main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
