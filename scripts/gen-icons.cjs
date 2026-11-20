// PWA ikonkalarini src/app/icon.svg dan PNG formatga oʻtkazish (Playwright yordamida).
// Ishlatish: node scripts/gen-icons.cjs
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
(async () => {
  const svg = fs.readFileSync(path.join(__dirname, "../src/app/icon.svg"), "utf8");
  const b = await chromium.launch();
  const p = await b.newPage();
  const out = [["public/icon-192.png", 192, 0], ["public/icon-512.png", 512, 0], ["public/icon-maskable-512.png", 512, 0.12], ["src/app/apple-icon.png", 180, 0.08]];
  for (const [file, size, pad] of out) {
    await p.setViewportSize({ width: size, height: size });
    const inner = Math.round(size * (1 - pad * 2));
    await p.setContent(`<html><body style="margin:0;background:${pad ? "#0f5c47" : "transparent"};display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px">${svg.replace("<svg ", `<svg width="${inner}" height="${inner}" `)}</body></html>`);
    await p.screenshot({ path: path.join(__dirname, "..", file), omitBackground: !pad });
    console.log("✓", file);
  }
  await b.close();
})();
