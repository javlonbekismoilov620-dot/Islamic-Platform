/* Hidoyat service worker — oflayn oʻqish uchun keshlash. */
const VERSION = "v1";
const STATIC = `hidoyat-static-${VERSION}`;
const PAGES = `hidoyat-pages-${VERSION}`;
const DATA = `hidoyat-data-${VERSION}`;
const PRECACHE = ["/", "/offline", "/quron", "/duolar", "/zikrlar", "/ibodat/namoz", "/namoz-vaqtlari", "/quron/1", "/quran/meta.json", "/icon-192.png"];
// Shaxsiy yoki xodimlar sahifalari hech qachon keshlanmaydi.
const NEVER = [/^\/api\//, /^\/admin/, /^\/profil/, /^\/kirish/, /^\/royxatdan-otish/, /^\/sozlamalar/];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(PAGES).then((c) => c.addAll(PRECACHE)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !k.endsWith(VERSION)).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (NEVER.some((r) => r.test(url.pathname))) return;

  if (url.pathname.startsWith("/_next/static/") || /\.(?:woff2?|png|svg|ico)$/.test(url.pathname)) {
    event.respondWith(caches.open(STATIC).then(async (c) => (await c.match(req)) || fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; })));
    return;
  }
  if (url.pathname.startsWith("/quran/") && url.pathname.endsWith(".json")) {
    event.respondWith(
      caches.open(DATA).then(async (c) => {
        const cached = await c.match(req);
        const network = fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => cached);
        return cached || network;
      }),
    );
    return;
  }
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && res.headers.get("content-type")?.includes("text/html")) caches.open(PAGES).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match("/offline")) || Response.error()),
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: "window" }).then((cs) => (cs[0] ? cs[0].focus() : self.clients.openWindow("/namoz-vaqtlari"))));
});
