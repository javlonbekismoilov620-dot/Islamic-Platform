// Usage: node e2e/shot.cjs <path> <out.png> [width] [theme]
const { chromium } = require("playwright");
(async () => {
  const [path = "/", out = "shot.png", width = "1280", theme = "light"] = process.argv.slice(2);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: Number(width), height: 900 }, deviceScaleFactor: 1, colorScheme: theme });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
  await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: out, fullPage: process.env.FULL !== "0" });
  console.log(errors.length ? errors.join("\n") : "no errors");
  await browser.close();
})();
