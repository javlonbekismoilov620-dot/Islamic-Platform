const { chromium } = require("playwright");
const BASE = "http://localhost:3000";
async function register(b, email, name) {
  const ctx = await b.newContext(); const p = await ctx.newPage();
  await p.goto(BASE + "/royxatdan-otish", { waitUntil: "networkidle" });
  await p.fill('input[name="name"]', name); await p.fill('input[name="email"]', email); await p.fill('input[name="password"]', "xavfsiz-parol-123"); await p.check('input[name="consent"]');
  await p.locator('form button[type="submit"]').click();
  try { await p.waitForURL("**/profil", { timeout: 8000 }); } catch {
    await p.goto(BASE + "/kirish", { waitUntil: "networkidle" });
    await p.fill('input[name="email"]', email); await p.fill('input[name="password"]', "xavfsiz-parol-123");
    await Promise.all([p.waitForURL("**/profil"), p.locator('form button[type="submit"]').click()]);
  }
  return p;
}
(async () => {
  const b = await chromium.launch();
  const anon = await (await b.newContext()).newPage();
  await anon.goto(BASE + "/admin"); console.log("anon /admin ->", anon.url().replace(BASE, ""));
  const user = await register(b, `u${Date.now()}@example.com`, "Oddiy");
  const r = await user.goto(BASE + "/admin"); console.log("user /admin status:", r.status());
  const admin = await register(b, "admin@hidoyat.test", "Admin");
  await admin.goto(BASE + "/admin", { waitUntil: "networkidle" }); console.log("admin /admin title:", await admin.locator("h1").first().innerText());
  // second reviewer
  const revEmail = `rev${Date.now()}@example.com`;
  const rev = await register(b, revEmail, "Tekshiruvchi");
  await admin.goto(BASE + "/admin/foydalanuvchilar", { waitUntil: "networkidle" });
  const row = admin.locator("tr", { hasText: revEmail });
  await row.locator('select[name="role"]').selectOption("reviewer");
  await row.getByRole("button", { name: "Saqlash" }).click(); await admin.waitForTimeout(800);
  console.log("set reviewer:", await row.locator('[role="alert"]').innerText().catch(() => "?"));
  // find dua 'sano' in admin list
  await admin.goto(BASE + "/admin/kontent?q=sano&type=dua", { waitUntil: "networkidle" });
  await admin.locator("tbody a").first().click(); await admin.waitForURL(/\/admin\/kontent\/[0-9a-f-]{36}$/); await admin.waitForLoadState("networkidle");
  const editUrl = admin.url(); console.log("edit page:", editUrl.replace(BASE, ""));
  // admin approve without confirm -> error
  if (!(await admin.getByRole("button", { name: "Tasdiqlash va nashr qilish" }).count())) { console.log("already published; skipping first approval"); } else {
  await admin.getByRole("button", { name: "Tasdiqlash va nashr qilish" }).click(); await admin.waitForTimeout(800);
  console.log("approve w/o confirm:", await admin.locator('form [role="alert"]').last().innerText());
  await admin.check('input[name="confirm"]');
  await admin.getByRole("button", { name: "Tasdiqlash va nashr qilish" }).click(); await admin.waitForTimeout(1200);
  console.log("approve:", await admin.locator('form [role="alert"]').last().innerText()); }
  const pub = await (await b.newContext()).newPage();
  await pub.goto(BASE + "/duolar/namoz/sano", { waitUntil: "networkidle" });
  console.log("public badge:", (await pub.locator("article").first().innerText()).includes("Ulamolar tekshirgan"));
  // reviewer edits the published item then tries to approve own edit
  await rev.goto(editUrl, { waitUntil: "networkidle" });
  await rev.fill('textarea[name="body.meaning"]', "Allohim, Sen poksan, Senga hamd aytaman. Sening isming barakalidir, ulugʻliging oliydir va Sendan oʻzga iloh yoʻq.");
  await rev.getByRole("button", { name: "Saqlash", exact: true }).click(); await rev.waitForTimeout(1500);
  console.log("reviewer save:", await rev.locator('form [role="alert"]').first().innerText());
  await rev.reload({ waitUntil: "networkidle" });
  console.log("status after edit:", (await rev.locator("header").first().innerText()).includes("Tekshiruv kutilmoqda"));
  await rev.check('input[name="confirm"]');
  await rev.getByRole("button", { name: "Tasdiqlash va nashr qilish" }).click(); await rev.waitForTimeout(1200);
  console.log("self-approve:", await rev.locator('form [role="alert"]').last().innerText());
  // admin (different person) approves
  await admin.reload({ waitUntil: "networkidle" }); await admin.check('input[name="confirm"]');
  await admin.getByRole("button", { name: "Tasdiqlash va nashr qilish" }).click(); await admin.waitForTimeout(1200);
  console.log("admin approve after reviewer edit:", await admin.locator('form [role="alert"]').last().innerText());
  await b.close();
})();
