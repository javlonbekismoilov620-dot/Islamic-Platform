const { chromium } = require("playwright");
(async () => {
  const BASE = "http://localhost:3000";
  const b = await chromium.launch();
  const p = await (await b.newContext()).newPage();
  p.on("request", (r) => r.url().includes("/api/me") && console.log(">>", r.method(), r.url().replace(BASE, ""), r.method() === "PUT" ? (r.postData() || "").slice(0, 80) : ""));
  p.on("response", async (r) => r.url().includes("/api/me") && console.log("<<", r.status(), r.url().replace(BASE, "")));
  p.on("console", (m) => console.log("console:", m.type(), m.text().slice(0, 200)));
  await p.goto(BASE + "/duolar/namoz/sano", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Saqlash" }).first().click();
  await p.goto(BASE + "/royxatdan-otish", { waitUntil: "networkidle" });
  await p.fill('input[name="email"]', `dbg${Date.now()}@example.com`);
  await p.fill('input[name="password"]', "xavfsiz-parol-123");
  await p.check('input[name="consent"]');
  await Promise.all([p.waitForURL("**/profil"), p.locator('form button[type="submit"]').click()]);
  await p.waitForTimeout(3000);
  await b.close();
})();
