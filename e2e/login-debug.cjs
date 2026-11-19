const { chromium } = require("playwright");
(async () => {
  const BASE = "http://localhost:3000";
  const b = await chromium.launch();
  const p = await (await b.newContext()).newPage();
  await p.goto(BASE + "/kirish", { waitUntil: "networkidle" });
  await p.fill('input[name="email"]', process.argv[2]);
  await p.fill('input[name="password"]', "notogri-parol");
  await p.locator('form button[type="submit"]').click();
  await p.waitForTimeout(2500);
  console.log("alerts:", await p.locator('form [role="alert"]').allInnerTexts());
  console.log("email after:", await p.inputValue('input[name="email"]'));
  await p.fill('input[name="password"]', "xavfsiz-parol-123");
  await p.locator('form button[type="submit"]').click();
  await p.waitForTimeout(3000);
  console.log("url:", p.url(), "alerts:", await p.locator('form [role="alert"]').allInnerTexts());
  await b.close();
})();
