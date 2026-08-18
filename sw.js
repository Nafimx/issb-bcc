/* sw.js — makes the drills installable and usable without a connection.

   Strategy, chosen from what has actually gone wrong on this site before:
   - HTML and the small JS/CSS: NETWORK FIRST, cache as fallback. A cadet on a
     working connection always gets the current build; a stale page can never be
     served while online, which is the failure that plagued this app earlier.
   - Pictures and icons: CACHE FIRST. They are large, they never change once
     published, and re-downloading 7 MB of plates on every visit is wasteful.
   - Anything not in the cache and not reachable: fall back to the dashboard so
     the app opens rather than showing a browser error.

   The cache name carries the build, so a new deploy drops the old cache
   wholesale rather than leaving a half-old, half-new mixture behind. */

const BUILD = "202608181354z";
const SHELL = "issb-shell-" + BUILD;
const MEDIA = "issb-media-v1";              // plates are immutable; keep across builds

const SHELL_FILES = [
  "/", "/index.html",
  "/day1/iq.html", "/day1/ppdt.html", "/day1/tat.html",
  "/day1/wat.html", "/day1/srt.html", "/day1/sdt.html",
  "/day2/index.html", "/day3/index.html", "/day4/index.html",
  "/assets/css/app.css",
  "/assets/js/core.js", "/assets/js/iq-curated.js", "/assets/js/iq-gen.js",
  "/assets/js/iq-nonverbal.js", "/assets/js/wat-words.js", "/assets/js/srt-bank.js",
  "/assets/js/srt-completing.js", "/assets/js/srt-extra.js", "/assets/js/srt-stories.js",
  "/assets/js/topics.js", "/assets/js/ppdt-scenes.js", "/assets/js/ppdt-pictures.js",
  "/assets/ppdt/manifest.json",
  "/manifest.webmanifest",
];

const isMedia = (url) =>
  /\/assets\/(ppdt|icons)\/.*\.(png|jpe?g|webp|gif|avif|svg)$/i.test(url.pathname) ||
  url.pathname === "/assets/favicon.svg";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(SHELL)
      // one bad URL must not fail the whole install
      .then((c) => Promise.allSettled(SHELL_FILES.map((f) => c.add(f))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== SHELL && k !== MEDIA).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;      // never touch third parties

  // the build stamp must always come from the network, or self-healing breaks
  if (url.pathname.endsWith("/assets/build.json")) return;

  if (isMedia(url)) {
    e.respondWith(
      caches.open(MEDIA).then((cache) =>
        cache.match(req).then((hit) =>
          hit || fetch(req).then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
        )
      )
    );
    return;
  }

  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) =>
          hit || caches.match("/index.html").then((home) =>
            home || new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } })
          )
        )
      )
  );
});
