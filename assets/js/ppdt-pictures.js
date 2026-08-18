/* ppdt-pictures.js — where the PPDT and TAT slides come from.

   Order of preference:
     1. pictures the cadet has added on this device (kept in IndexedDB)
     2. real plates committed to assets/ppdt/ and listed in its manifest
     3. the drawn SVG scenes in ppdt-scenes.js

   A real plate is always better practice than a drawing, so anything supplied
   wins over the fallback. */
(function (global) {
  "use strict";

  const DB = "issb-pics", STORE = "pics";

  function openDb() {
    return new Promise((res, rej) => {
      if (!global.indexedDB) return rej(new Error("no IndexedDB"));
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => { r.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true }); };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }

  function localPics() {
    return openDb().then((db) => new Promise((res) => {
      const tx = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
      tx.onsuccess = () => res(tx.result || []);
      tx.onerror = () => res([]);
    })).catch(() => []);
  }

  function addLocalPics(files) {
    return openDb().then((db) => Promise.all([...files].map((f) => new Promise((res) => {
      const fr = new FileReader();
      fr.onload = () => {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).add({ name: f.name, data: fr.result });
        tx.oncomplete = () => res(true);
        tx.onerror = () => res(false);
      };
      fr.onerror = () => res(false);
      fr.readAsDataURL(f);
    }))));
  }

  function clearLocalPics() {
    return openDb().then((db) => new Promise((res) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => res(true);
      tx.onerror = () => res(false);
    })).catch(() => false);
  }

  function manifestPics(base) {
    return fetch(base + "assets/ppdt/manifest.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => (m && Array.isArray(m.pictures) ? m.pictures : []))
      .catch(() => []);
  }

  /* Returns [{id, kind:"img"|"svg", src?, svg?}] */
  function load(base) {
    base = base || "../";
    return Promise.all([localPics(), manifestPics(base)]).then(([local, listed]) => {
      const out = [];
      local.forEach((p, i) => out.push({ id: "own-" + (i + 1), kind: "img", src: p.data, label: p.name }));
      listed.forEach((f, i) => out.push({
        id: "plate-" + (i + 1),
        kind: "img",
        src: base + "assets/ppdt/" + (typeof f === "string" ? f : f.file),
        label: (typeof f === "string" ? f : (f.title || f.file))
      }));
      if (!out.length && global.PPDT_SCENES) {
        global.PPDT_SCENES.forEach((s) => out.push({ id: "scene-" + s.id, kind: "svg", svg: s.svg, label: s.hint }));
      }
      return out;
    });
  }

  global.PPDT_PICTURES = { load, addLocalPics, clearLocalPics, localPics };
})(window);
