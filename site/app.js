"use strict";
// Quick Classics: a library with shelves (Classics at #library, Non-Fiction at #nonfiction) and a
// swipeable deck of ideas per book (#<id>). Classics live in data/lessons.json, non-fiction in
// data/nonfiction.json; a book's saved ideas are kept on the device (localStorage).
const LABEL = {preview:"The big picture", story:"The story", character:"Characters", theme:"Big idea", lesson:"Lesson", reflect:"Reflect", quote:"Key line",
  argument:"The argument", concept:"Key concept", case:"Case study", critique:"The debate"};
// non-fiction kinds borrow the classics' card colours
const COLOR = {quote:"reflect", argument:"story", concept:"theme", case:"character", critique:"reflect"};
const SHELF = {
  classics:   {hash:"library",    cover:"Today's classic", eyebrow:"A classic a day",
               sub:"Great books, one swipeable idea at a time: the story, the people, the big ideas and what they can teach you."},
  nonfiction: {hash:"nonfiction", cover:"Non-Fiction", eyebrow:"Ideas that changed how we think",
               sub:"Landmark non-fiction, one swipeable idea at a time: the argument, the key concepts, the evidence behind them and what they mean for you."}
};
const SAVE_KEY = "qc-saved-v2-";
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const bm = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>';
const $ = id => document.getElementById(id);
let BOOKS = {classics: [], nonfiction: []}, shelf = "classics", book = null, deck = [], cards = [], barEls = [], cur = 0, saved = new Set();

function renderLibrary(s){
  shelf = s;
  const S = SHELF[s];
  $("eyebrow").textContent = S.eyebrow; $("sub").textContent = S.sub;
  for (const k of Object.keys(SHELF)) {
    const a = $("shelf-" + k);
    k === s ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
  }
  const list = [...BOOKS[s]].reverse();
  $("grid").innerHTML = list.length ? list.map((l, i) => `<a class="tile g${i % 4}" href="#${esc(l.id)}">
      <span class="day">${esc(l.category || l.label)} · ${esc(l.minutes)} min</span>
      <h2>${esc(l.title)}</h2><span class="by">${esc(l.author)} · ${esc(yr(l.year))}</span>
      <span class="n">${l.cards.length} ideas</span></a>`).join("")
    : '<p class="note">No books on this shelf yet.</p>';
}

// ancient works store negative years for BC
const yr = y => y < 0 ? `${-y} BC` : y < 1000 ? `AD ${y}` : y;

function openDeck(l){
  book = l; deck = [{k:"cover"}, ...l.cards]; cur = 0;
  // v2 keys: every deck gained a "What you'll learn" card at the front, so saves made before it moved up by one
  try {
    let raw = localStorage.getItem(SAVE_KEY + l.id);
    if (raw === null) { const old = localStorage.getItem("qc-saved-" + l.id); raw = old ? JSON.stringify(JSON.parse(old).map(i => i + 1)) : "[]"; }
    saved = new Set(JSON.parse(raw));
  } catch(e) { saved = new Set(); }
  const stage = $("stage"), bars = $("bars"); stage.innerHTML = ""; bars.innerHTML = "";
  const n = k => l.cards.filter(x => x.k === k).length;
  const legend = l.shelf === "nonfiction"
    ? [[n("concept"), "key concepts"], [n("case"), "case studies"], [n("lesson"), "lessons"]]
    : [[n("story"), "story beats"], [n("character"), "characters"], [n("theme"), "big ideas"], [n("lesson"), "lessons"]];
  deck.forEach((c, i) => {
    const el = document.createElement("article");
    el.className = "card " + (COLOR[c.k] || c.k);
    if (c.k === "cover") {
      el.innerHTML = `<span class="day">${esc(l.category || l.label)} · ${esc(l.minutes)} min read</span><h2>${esc(l.title)}</h2>
        ${l.subtitle ? `<div class="subtitle">${esc(l.subtitle)}</div>` : ""}
        <div class="by">${esc(l.author)} · ${esc(yr(l.year))}</div>
        <div class="legend">${legend.filter(x => x[0]).map(x => `<span>${x[0]} ${x[1]}</span>`).join("")}</div>`;
    } else if (c.k === "preview") {
      el.innerHTML = `<span class="tag">${LABEL[c.k]}</span><h2>${esc(c.t)}</h2><p>${esc(c.b)}</p>
        <ul class="pts">${(c.pts || []).map(p => `<li><b>${esc(p.h)}:</b> ${esc(p.d)}</li>`).join("")}</ul>
        <div class="foot"><span>${esc(l.title)}</span></div>`;
    } else {
      el.innerHTML = `<span class="tag">${LABEL[c.k]}</span><h2>${esc(c.t)}</h2>
        ${c.q ? `<blockquote>${esc(c.q)}</blockquote>` : ""}<p>${esc(c.b)}</p>
        <div class="foot"><span>${esc(l.title)}</span>
        <button class="save" data-i="${i}" aria-pressed="${saved.has(i)}">${bm}<span>${saved.has(i) ? "Saved" : "Save idea"}</span></button></div>`;
    }
    stage.appendChild(el);
    const b = document.createElement("span"); b.innerHTML = "<i></i>"; bars.appendChild(b);
  });
  cards = [...stage.children]; barEls = [...bars.children];
  $("home").textContent = "← " + (l.shelf === "nonfiction" ? "Non-Fiction" : "Library");
  $("lib").hidden = true; $("app").hidden = false; document.body.classList.add("reading");
  document.title = l.title + " · Quick Classics";
  show(0);
}
function closeDeck(s){
  renderLibrary(s);
  $("app").hidden = true; $("lib").hidden = false; document.body.classList.remove("reading"); book = null;
  document.title = s === "nonfiction" ? "Non-Fiction · Quick Classics" : "Quick Classics";
}
const shelfHash = () => SHELF[book ? book.shelf : shelf].hash;

function show(n){
  cur = Math.max(0, Math.min(deck.length - 1, n));
  cards.forEach((c, i) => { c.classList.toggle("hidden-left", i < cur); c.classList.toggle("hidden-right", i > cur); c.setAttribute("aria-hidden", i !== cur); });
  barEls.forEach((b, i) => b.classList.toggle("done", i <= cur));
  $("section").textContent = deck[cur].k === "cover" ? SHELF[book.shelf].cover : LABEL[deck[cur].k];
  $("count").textContent = (cur + 1) + " / " + deck.length;
  $("prev").disabled = cur === 0;
  $("next").textContent = cur === 0 ? "Start reading" : cur === deck.length - 1 ? "Back to library" : "Next idea";
}
$("prev").onclick = () => show(cur - 1);
$("next").onclick = () => cur === deck.length - 1 ? (location.hash = shelfHash()) : show(cur + 1);
$("home").onclick = () => { location.hash = shelfHash(); };
document.addEventListener("keydown", e => { if (!book) return; if (e.key === "ArrowRight") show(cur + 1); if (e.key === "ArrowLeft") show(cur - 1); });
$("stage").addEventListener("click", e => {
  const s = e.target.closest(".save"); if (!s) return;
  const i = +s.dataset.i; saved.has(i) ? saved.delete(i) : saved.add(i);
  s.setAttribute("aria-pressed", saved.has(i)); s.querySelector("span").textContent = saved.has(i) ? "Saved" : "Save idea";
  try { localStorage.setItem(SAVE_KEY + book.id, JSON.stringify([...saved])); } catch(err) {}
});

// Swipe (touch or mouse drag). Styles are set through CSSOM, which the site's CSP allows.
let sx = null, sy = null, lock = null;
function dragStart(x, y){ if (book) { sx = x; sy = y; lock = null; } }
function dragMove(x, y, e){
  if (sx === null) return;
  const dx = x - sx, dy = y - sy;
  if (lock === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) lock = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
  if (lock !== "x") return;
  if (e.cancelable) e.preventDefault();
  const c = cards[cur]; c.style.transition = "none"; c.style.transform = `translateX(${dx}px) rotate(${dx / 30}deg)`;
}
function dragEnd(x){
  if (sx === null) return;
  const dx = x - sx, horizontal = lock === "x";
  const c = cards[cur]; c.style.transition = ""; c.style.transform = "";
  sx = null; lock = null;
  if (horizontal && Math.abs(dx) > 60) show(cur + (dx < 0 ? 1 : -1));
}
const st = $("stage");
st.addEventListener("touchstart", e => { const t = e.touches[0]; dragStart(t.clientX, t.clientY); }, {passive:true});
st.addEventListener("touchmove", e => { const t = e.touches[0]; dragMove(t.clientX, t.clientY, e); }, {passive:false});
st.addEventListener("touchend", e => dragEnd(e.changedTouches[0].clientX));
st.addEventListener("touchcancel", () => { if (sx !== null) dragEnd(sx); });
st.addEventListener("mousedown", e => { if (!e.target.closest(".save")) dragStart(e.clientX, e.clientY); });
window.addEventListener("mousemove", e => dragMove(e.clientX, e.clientY, e));
window.addEventListener("mouseup", e => dragEnd(e.clientX));

function route(){
  const id = location.hash.slice(1);
  const l = [...BOOKS.classics, ...BOOKS.nonfiction].find(x => x.id === id);
  if (l) return openDeck(l);
  closeDeck(id === "nonfiction" ? "nonfiction" : "classics");
}
window.addEventListener("hashchange", route);
const load = (file, s) => fetch(file).then(r => r.json()).then(d => d.map(b => ({...b, shelf: s})));
Promise.all([load("data/lessons.json", "classics"), load("data/nonfiction.json", "nonfiction").catch(() => [])])
  .then(([c, nf]) => { BOOKS = {classics: c, nonfiction: nf}; route(); })
  .catch(() => { $("grid").innerHTML = '<p class="note">The library could not load. Refresh the page to try again.</p>'; });
