// Barcha asosiy sahifalarni brauzerda tekshiradi: HTTP holati, konsol xatolari,
// mobil gorizontal toshib ketish, arabcha matnning RTL yoʻnalishi.
// Ishlatish: (server ishga tushgan holda) npm run test:e2e  [BASE_URL=http://localhost:3000]
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require("playwright"); } catch { playwright = require(execSync("npm root -g").toString().trim() + "/playwright"); }
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const ROUTES = ["/", "/quron", "/quron/1", "/quron/2", "/quron/36", "/quron/112", "/ibodat", "/ibodat/namoz", "/ibodat/namoz/namozga-kirish", "/ibodat/namoz/tahorat", "/ibodat/namoz/gusl", "/ibodat/namoz/namoz-sozlari", "/ibodat/namoz/amaliy-namoz", "/ibodat/namoz/bilimni-sinash", "/duolar", "/duolar/ertalab", "/duolar/namoz/tashahhud", "/duolar/safar/safar-duosi", "/zikrlar", "/zikrlar/subhanalloh", "/zikrlar/ertalabki-zikrlar", "/zikrlar/tarix", "/bilimlar", "/bilimlar/namoz", "/bilimlar/roza/roza-ahkomlari", "/hadislar", "/hadislar/niyat", "/namoz-vaqtlari", "/qibla", "/taqvim", "/qidiruv?q=namoz", "/lugat", "/talaffuz", "/manbalar", "/maxfiylik", "/profil", "/sozlamalar", "/kirish", "/royxatdan-otish", "/offline"];
const VIEWPORTS = [{ name: "mobil", width: 390, height: 844, scheme: "dark" }, { name: "desktop", width: 1280, height: 900, scheme: "light" }];

const b = await playwright.chromium.launch();
let failures = 0;
for (const vp of VIEWPORTS) {
  const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height }, colorScheme: vp.scheme });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(e.message));
    page.on("console", (m) => { if (m.type() === "error" && !/everyayah|favicon/.test(m.text())) errs.push(m.text()); });
    const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(150);
    const info = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - window.innerWidth;
      const arabic = [...document.querySelectorAll('[lang="ar"]')];
      const badDir = arabic.filter((el) => getComputedStyle(el).direction !== "rtl").length;
      const english = /\b(Lorem|TODO|placeholder|Loading\.\.\.|Submit|Cancel|Click here)\b/.test(document.body.innerText);
      return { overflow, arabic: arabic.length, badDir, english, title: document.title };
    });
    const problems = [];
    if (!res || res.status() >= 400) problems.push(`HTTP ${res?.status()}`);
    if (errs.length) problems.push(`xatolar: ${errs.slice(0, 2).join(" | ").slice(0, 200)}`);
    if (info.overflow > 1) problems.push(`gorizontal toshish ${info.overflow}px`);
    if (info.badDir) problems.push(`${info.badDir} ta arabcha element RTL emas`);
    if (info.english) problems.push("inglizcha toʻldiruvchi matn");
    if (problems.length) failures++;
    console.log(`${problems.length ? "✗" : "✓"} [${vp.name}] ${route} — ${info.arabic} arabcha blok${problems.length ? " — " + problems.join("; ") : ""}`);
    await page.close();
  }
  await ctx.close();
}
await b.close();
console.log(failures ? `\n${failures} ta muammo topildi` : "\nBarcha sahifalar tekshiruvdan oʻtdi");
process.exit(failures ? 1 : 0);
