/** Boshlangʻich kontentni yozish. --force: AI qoralamalarini oʻchirib, qaytadan yozadi (tahrirlangan kontent saqlanadi). */
async function main() {
  process.env.SKIP_AUTO_SEED = "true";
  const { getSystemDb } = await import("../src/server/db/client");
  const { seedIfEmpty } = await import("../src/server/db/seed");
  const db = await getSystemDb();
  const r = await seedIfEmpty(db, { force: process.argv.includes("--force") });
  console.log(r.seeded ? "✓ kontent yozildi" : "Bazada kontent allaqachon mavjud (--force bilan qayta yozish mumkin)");
}
main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });
