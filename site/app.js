"use strict";
// Classics Stash: a library of books (home) and a swipeable deck of ideas per book (#<id>).
// Books live in data/lessons.json; a book's saved ideas are kept on the device (localStorage).
const LABEL = {story:"The story", character:"Characters", theme:"Big idea", lesson:"Lesson", reflect:"Reflect", quote:"Key line", cover:"Today's classic"};
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const bm = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>';
const $ = id => document.getElementById(id);
let LESSONS = [], book = null, deck = [], cards = [], barEls = [], cur = 0, saved = new Set();

function renderLibrary(){
  const list = [...LESSONS].reverse();
  $("grid").innerHTML = list.map((l, i) => `<a class="tile g${i % 4}" href="#${esc(l.id)}">
      <span class="day">${esc(l.label)} · ${esc(l.minutes)} min</span>
      <h2>${esc(l.title)}</h2><span class="by">${esc(l.author)} · ${esc(l.year)}</span>
      <span class="n">${l.cards.length} ideas</span></a>`).join("");
}

function openDeck(l){
  book = l; deck = [{k:"cover"}, ...l.cards]; cur = 0;
  try { saved = new Set(JSON.parse(localStorage.getItem("stash-saved-" + l.id) || "[]")); } catch(e) { saved = new Set(); }
  const stage = $("stage"), bars = $("bars"); stage.innerHTML = ""; bars.innerHTML = "";
  deck.forEach((c, i) => {
    const el = document.createElement("article");
    el.className = "card " + (c.k === "quote" ? "reflect" : c.k);
    if (c.k === "cover") {
      const n = k => l.cards.filter(x => x.k === k).length;
      el.innerHTML = `<span class="day">${esc(l.label)} · ${esc(l.minutes)} min read</span><h2>${esc(l.title)}</h2>
        <div class="by">${esc(l.author)} · ${esc(l.year)}</div>
        <div class="legend"><span>${n("story")} story beats</span><span>${n("character")} characters</span><span>${n("theme")} big ideas</span><span>${n("lesson")} lessons</span></div>`;
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
  $("lib").hidden = true; $("app").hidden = false; document.body.classList.add("reading");
  document.title = l.title + " · Classics Stash";
  show(0);
}
function closeDeck(){ $("app").hidden = true; $("lib").hidden = false; document.body.classList.remove("reading"); book = null; document.title = "Classics Stash"; }

function show(n){
  cur = Math.max(0, Math.min(deck.length - 1, n));
  cards.forEach((c, i) => { c.classList.toggle("hidden-left", i < cur); c.classList.toggle("hidden-right", i > cur); c.setAttribute("aria-hidden", i !== cur); });
  barEls.forEach((b, i) => b.classList.toggle("done", i <= cur));
  $("section").textContent = LABEL[deck[cur].k];
  $("count").textContent = (cur + 1) + " / " + deck.length;
  $("prev").disabled = cur === 0;
  $("next").textContent = cur === 0 ? "Start reading" : cur === deck.length - 1 ? "Back to library" : "Next idea";
}
$("prev").onclick = () => show(cur - 1);
$("next").onclick = () => cur === deck.length - 1 ? (location.hash = "library") : show(cur + 1);
$("home").onclick = () => { location.hash = "library"; };
document.addEventListener("keydown", e => { if (!book) return; if (e.key === "ArrowRight") show(cur + 1); if (e.key === "ArrowLeft") show(cur - 1); });
$("stage").addEventListener("click", e => {
  const s = e.target.closest(".save"); if (!s) return;
  const i = +s.dataset.i; saved.has(i) ? saved.delete(i) : saved.add(i);
  s.setAttribute("aria-pressed", saved.has(i)); s.querySelector("span").textContent = saved.has(i) ? "Saved" : "Save idea";
  try { localStorage.setItem("stash-saved-" + book.id, JSON.stringify([...saved])); } catch(err) {}
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
  const l = LESSONS.find(x => x.id === id);
  l ? openDeck(l) : closeDeck();
}
window.addEventListener("hashchange", route);
fetch("data/lessons.json").then(r => r.json()).then(d => { LESSONS = d; renderLibrary(); route(); })
  .catch(() => { $("grid").innerHTML = '<p class="note">The library could not load. Refresh the page to try again.</p>'; });
