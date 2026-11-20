const { chromium } = require("playwright");
(async () => {
  const [path, out, width = "1280", y = "0", theme = "light"] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: Number(width), height: 900 }, colorScheme: theme })).newPage();
  await p.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
  await p.evaluate((yy) => window.scrollTo(0, yy), Number(y));
  await p.waitForTimeout(500);
  await p.screenshot({ path: out });
  await b.close();
})();
