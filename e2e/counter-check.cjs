const { chromium } = require("playwright");
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, colorScheme: "light" })).newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto("http://localhost:3000/zikrlar/namozdan-keyingi-zikrlar", { waitUntil: "networkidle" });
  const btn = p.getByRole("button", { name: /Sanash/ });
  for (let i = 0; i < 3; i++) await btn.click();
  await p.waitForTimeout(300);
  const label1 = await btn.getAttribute("aria-label");
  await btn.click(); // step 2 (antas-salom, count 1)
  await p.waitForTimeout(200);
  const title = await p.locator("h1").first().innerText();
  await p.screenshot({ path: out });
  console.log({ label1, titleAfter: title, errs });
  await b.close();
})();
