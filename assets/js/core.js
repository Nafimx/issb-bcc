/* core.js — shared helpers for the ISSB prep dashboard.
   Loaded by every page before the page script. */
(function (global) {
  "use strict";

  /* ---------- DOM ---------- */
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  /* ---------- seeded RNG ----------
     mulberry32: same seed => same sequence, so a batch number always
     produces the identical question set for every cadet. */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const randInt = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
  const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];

  function seededShuffle(arr, rng) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const shuffle = (arr) => seededShuffle(arr, Math.random);

  /* ---------- countdown ----------
     One implementation used by IQ, PPDT and WAT. Ticks on wall-clock time
     so a backgrounded tab does not drift. */
  class Countdown {
    constructor({ onTick, onDone } = {}) {
      this.onTick = onTick || (() => {});
      this.onDone = onDone || (() => {});
      this._id = null;
      this.total = 0;
      this.remaining = 0;
      this.running = false;
    }
    start(seconds) {
      if (seconds != null) {
        this.total = seconds;
        this.remaining = seconds;
      }
      if (this.running) return;
      this.running = true;
      this._end = Date.now() + this.remaining * 1000;
      this.onTick(this.remaining, this.total);
      this._id = setInterval(() => {
        const left = Math.max(0, Math.round((this._end - Date.now()) / 1000));
        if (left === this.remaining) return;
        this.remaining = left;
        this.onTick(left, this.total);
        if (left <= 0) {
          this.stop();
          this.onDone();
        }
      }, 200);
    }
    pause() {
      if (!this.running) return;
      clearInterval(this._id);
      this._id = null;
      this.running = false;
      this.remaining = Math.max(0, Math.round((this._end - Date.now()) / 1000));
      this.onTick(this.remaining, this.total);
    }
    stop() {
      clearInterval(this._id);
      this._id = null;
      this.running = false;
    }
    reset(seconds) {
      this.stop();
      this.total = seconds;
      this.remaining = seconds;
      this.onTick(this.remaining, this.total);
    }
  }

  const fmtClock = (s) => {
    s = Math.max(0, Math.floor(s));
    const m = Math.floor(s / 60);
    return m + ":" + String(s % 60).padStart(2, "0");
  };

  /* ---------- storage ---------- */
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem("issb." + key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem("issb." + key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },
    del(key) {
      try {
        localStorage.removeItem("issb." + key);
      } catch (e) {}
    },
  };

  /* ---------- shared header ---------- */
  function mountHeader(title, subtitle, backHref) {
    const host0 = document.querySelector(".wrap") || document.body;
    if (!document.querySelector(".skip-link")) {
      const skip = el("a", "skip-link", "Skip to content");
      skip.href = "#main";
      document.body.insertBefore(skip, document.body.firstChild);
      host0.id = host0.id || "main";
      host0.setAttribute("role", "main");
      host0.setAttribute("tabindex", "-1");
    }
    const head = el("header", "site-head");
    head.setAttribute("role", "banner");
    head.innerHTML =
      '<div class="crest">BCC</div>' +
      '<div><h1>' + esc(title) + "</h1>" +
      (subtitle ? '<p class="sub">' + esc(subtitle) + "</p>" : "") +
      "</div>" +
      (backHref
        ? '<a class="back no-print" href="' + backHref + '" aria-label="Back to the dashboard">&larr; Dashboard</a>'
        : "");
    const host = document.querySelector(".wrap") || document.body;
    host.insertBefore(head, host.firstChild);
    const stamp = el("div", "build-stamp no-print", "build " + BUILD);
    stamp.setAttribute("aria-hidden", "true");
    head.appendChild(stamp);
  }

  /* any name/college/number kept by an older version is no longer used */
  store.del("cadet");

  /* Compatibility shims. A cadet may still be holding a cached copy of a page
     from before the identity gate was removed; those pages call askCadet() and
     cadetLine(). Without these they throw and the Start button does nothing.
     The shim just runs the drill straight away. */
  const askCadet = (segment, onReady) => { if (typeof onReady === "function") onReady(); };
  const cadetLine = () => "";
  const getCadet = () => ({ name: "", college: "", number: "" });

  /* Self-heal a stale page. Browsers on slow mobile connections were holding an
     old copy of a drill and reporting it as broken. Each build carries a stamp;
     if the server is serving a newer one, reload once (guarded, never loops). */
  const BUILD = "202608180626f";
  function checkBuild() {
    fetch("/assets/build.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data || !data.build || data.build === BUILD) return;
        if (global.ISSB_BUSY) return;            // a drill is running — leave it alone
        const key = "issb.reloaded." + data.build;
        try {
          if (sessionStorage.getItem(key)) return;
          sessionStorage.setItem(key, "1");
        } catch (e) { return; }
        location.reload();
      })
      .catch(() => {});
  }
  if (typeof fetch === "function") setTimeout(checkBuild, 800);

  global.ISSB = {
    BUILD,
    $, el, esc,
    askCadet, cadetLine, getCadet,
    mulberry32, randInt, pick, seededShuffle, shuffle,
    Countdown, fmtClock,
    store, mountHeader,
  };
})(window);
