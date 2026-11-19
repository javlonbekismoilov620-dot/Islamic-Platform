const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(); const p = await (await b.newContext()).newPage();
  await p.goto("http://localhost:3000/royxatdan-otish", { waitUntil: "networkidle" });
  await p.fill('input[name="email"]', `x${Date.now()}@example.com`); await p.fill('input[name="password"]', "xavfsiz-parol-123"); await p.check('input[name="consent"]');
  await p.locator('form button[type="submit"]').click(); await p.waitForTimeout(2000);
  console.log(await p.locator('form [role="alert"]').allInnerTexts());
  await b.close();
})();
