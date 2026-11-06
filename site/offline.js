"use strict";
// Keep a copy of the site on the device so it opens without a connection (see sw.js),
// and say so at the foot of the library once the copy is saved.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
  navigator.serviceWorker.ready.then(() => caches.match("index.html")).then(hit => {
    if (!hit) return;
    const note = document.createElement("p");
    note.className = "offline-note";
    note.textContent = "✓ Saved on this device: works offline";
    document.getElementById("lib").appendChild(note);
  }).catch(() => {});
}
