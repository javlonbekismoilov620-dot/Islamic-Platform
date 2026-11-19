const { chromium } = require("playwright");
(async () => {
  const BASE = "http://localhost:3000";
  const email = `test${Date.now()}@example.com`;
  const b = await chromium.launch();
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(e.message));
  // guest bookmarks something first
  await p.goto(BASE + "/duolar/namoz/sano", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Saqlash" }).first().click();
  await p.goto(BASE + "/royxatdan-otish", { waitUntil: "networkidle" });
  await p.fill('input[name="name"]', "Sinov");
  await p.fill('input[name="email"]', email);
  await p.fill('input[name="password"]', "xavfsiz-parol-123");
  await p.check('input[name="consent"]');
  await Promise.all([p.waitForURL("**/profil"), p.getByRole("button", { name: "Hisob yaratish" }).click()]);
  await p.waitForTimeout(2500);
  const api = await p.evaluate(async () => (await fetch("/api/me/data")).json());
  console.log("authenticated:", api.authenticated, "keys:", (api.items || []).map((i) => i.key).sort().join(","));
  const bm = (api.items || []).find((i) => i.key === "bookmarks");
  console.log("synced bookmark duas:", bm && bm.value.duas);
  // logout
  await p.getByRole("button", { name: "Chiqish" }).click();
  await p.waitForURL(BASE + "/");
  const api2 = await p.evaluate(async () => (await fetch("/api/me/data")).json());
  console.log("after logout authenticated:", api2.authenticated);
  // wrong password
  await p.goto(BASE + "/kirish", { waitUntil: "networkidle" });
  await p.fill('input[name="email"]', email);
  await p.fill('input[name="password"]', "notogri-parol");
  await p.locator('form button[type="submit"]').click();
  await p.waitForSelector('form [role="alert"]');
  console.log("wrong pw message:", await p.locator('form [role="alert"]').innerText());
  // correct login
  await p.fill('input[name="password"]', "xavfsiz-parol-123");
  await Promise.all([p.waitForURL("**/profil"), p.locator('form button[type="submit"]').click()]);
  console.log("login ok, cookie:", (await ctx.cookies()).map((c) => `${c.name} httpOnly=${c.httpOnly} sameSite=${c.sameSite}`).join("; "));
  // CSRF: cross-origin PUT should be rejected
  const csrf = await p.evaluate(async () => (await fetch("/api/me/data", { method: "PUT", headers: { "content-type": "application/json", origin: "https://evil.example" }, body: JSON.stringify({ items: [] }) })).status);
  console.log("same-origin PUT status:", csrf);
  console.log("errors:", errs);
  console.log("EMAIL=" + email);
  await b.close();
})();
