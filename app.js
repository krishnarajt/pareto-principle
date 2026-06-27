// App shell: tabbed routing, lesson injection, mobile drawer, animated hero,
// and subtle stat pulses. Activity logic lives in its own modules — this file
// only orchestrates navigation and presentation.
import { LESSONS } from "./lessons.js";

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ----------------------------------------------------------------- *
 * Metadata
 * ----------------------------------------------------------------- */
const EXPERIMENTS = [
  { key: "typing",  ico: "⌨️", name: "Typing",        desc: "Top 20% of letters vs your keystrokes" },
  { key: "words",   ico: "🔤", name: "Words · Zipf",  desc: "The cleanest 80/20 — word frequency" },
  { key: "monkeys", ico: "🐒", name: "Monkeys",       desc: "Zipf emerging from pure randomness" },
  { key: "camera",  ico: "📷", name: "Camera",        desc: "Do 20% of colors fill the frame?" },
  { key: "voice",   ico: "🎤", name: "Voice",         desc: "Where the sound energy hides" },
  { key: "mouse",   ico: "🖱️", name: "Mouse",         desc: "The few inches you actually use" },
  { key: "wealth",  ico: "💰", name: "Wealth",        desc: "Inequality from fair random trades" },
  { key: "lorenz",  ico: "📈", name: "Lorenz & Gini", desc: "Put a number on concentration" },
];

const TITLES = {
  dashboard: "The Pareto Principle — field guide",
  typing: "Typing · The Pareto Principle",
  words: "Words & Zipf's law · The Pareto Principle",
  monkeys: "Monkeys · The Pareto Principle",
  camera: "Camera · The Pareto Principle",
  voice: "Voice · The Pareto Principle",
  mouse: "Mouse · The Pareto Principle",
  wealth: "Wealth · The Pareto Principle",
  lorenz: "Lorenz & Gini · The Pareto Principle",
};

/* ----------------------------------------------------------------- *
 * Lesson injection
 * ----------------------------------------------------------------- */
document.querySelectorAll("[data-lesson]").forEach((el) => {
  const html = LESSONS[el.dataset.lesson];
  if (html) el.innerHTML = html;
});

/* ----------------------------------------------------------------- *
 * Launcher tiles (dashboard)
 * ----------------------------------------------------------------- */
const launchGrid = document.getElementById("launchGrid");
if (launchGrid) {
  EXPERIMENTS.forEach((x) => {
    const tile = document.createElement("button");
    tile.className = "launch-tile";
    tile.dataset.goto = x.key;
    tile.innerHTML =
      `<span class="launch-ico" aria-hidden="true">${x.ico}</span>` +
      `<span class="lt-name">${x.name}</span>` +
      `<span class="lt-desc">${x.desc}</span>`;
    launchGrid.appendChild(tile);
  });
}

/* ----------------------------------------------------------------- *
 * Routing
 * ----------------------------------------------------------------- */
const views = [...document.querySelectorAll(".view")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const validKeys = new Set(views.map((v) => v.dataset.view));

function keyFromHash() {
  const k = (location.hash || "").replace(/^#/, "");
  return validKeys.has(k) ? k : "dashboard";
}

function setView(key) {
  const target = views.find((v) => v.dataset.view === key) || views[0];
  const k = target.dataset.view;

  views.forEach((v) => v.classList.toggle("active", v === target));
  navLinks.forEach((n) => {
    const on = n.dataset.view === k;
    n.classList.toggle("active", on);
    if (on) n.setAttribute("aria-current", "page");
    else n.removeAttribute("aria-current");
  });

  document.title = TITLES[k] || "The Pareto Principle";
  window.scrollTo({ top: 0, behavior: "auto" });
  closeNav();

  // let continuous activities (camera / mic / wealth) pause when navigated away
  window.dispatchEvent(new CustomEvent("view:change", { detail: k }));

  if (k === "dashboard") animateHero();
}

// Sidebar links are real hash anchors (#key) — the browser updates the hash and
// our hashchange handler renders the view. Buttons use data-goto instead.
document.addEventListener("click", (e) => {
  const goto = e.target.closest("[data-goto]");
  if (!goto) return;
  e.preventDefault();
  const key = goto.dataset.goto;
  if (location.hash.replace(/^#/, "") === key) setView(key); // already there → refresh
  else location.hash = key;
});

window.addEventListener("hashchange", () => setView(keyFromHash()));

/* ----------------------------------------------------------------- *
 * Mobile drawer
 * ----------------------------------------------------------------- */
const menuBtn = document.getElementById("menuBtn");
const scrim = document.getElementById("scrim");
const sidebar = document.getElementById("sidebar");
function openNav() {
  document.body.classList.add("nav-open");
  if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
  const first = sidebar && sidebar.querySelector(".nav-link");
  if (first) first.focus();
}
function closeNav() {
  document.body.classList.remove("nav-open");
  if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
}
if (menuBtn) menuBtn.addEventListener("click", openNav);
if (scrim) scrim.addEventListener("click", closeNav);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("nav-open")) closeNav();
});

/* ----------------------------------------------------------------- *
 * Animated hero Pareto curve
 * ----------------------------------------------------------------- */
const heroCanvas = document.getElementById("heroChart");
let heroRaf = null;
function animateHero() {
  if (!heroCanvas) return;
  const ctx = heroCanvas.getContext("2d");
  const W = heroCanvas.width, H = heroCanvas.height;
  const vals = [40, 22, 13, 8, 6, 4.2, 3, 2.1, 1.3, 0.6];
  const n = vals.length;
  const total = vals.reduce((a, b) => a + b, 0);
  const maxV = vals[0];
  const padL = 18, padR = 40, padT = 22, padB = 30;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const barW = plotW / n;
  const cutoff = Math.max(1, Math.round(n * 0.2));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  if (heroRaf) cancelAnimationFrame(heroRaf);

  // Honor reduced-motion: paint the finished chart immediately, skip the animation.
  if (REDUCED) { render(1); return; }

  const start = performance.now();
  const DUR = 1100;
  function frame(now) {
    const p = easeOut(Math.min(1, (now - start) / DUR));
    render(p);
    if (p < 1) heroRaf = requestAnimationFrame(frame);
  }
  heroRaf = requestAnimationFrame(frame);

  function render(p) {
    ctx.clearRect(0, 0, W, H);

    // 80% reference line
    const y80 = padT + plotH - 0.8 * plotH;
    ctx.strokeStyle = "rgba(255,122,89,0.4)";
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(padL, y80); ctx.lineTo(padL + plotW, y80);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,122,89,0.6)";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText("80%", padL + plotW + 4, y80 + 4);

    // bars (grow with progress)
    for (let i = 0; i < n; i++) {
      const bh = (vals[i] / maxV) * plotH * p;
      const x = padL + i * barW + 1.5;
      const wBar = barW - 3;
      if (i < cutoff) {
        const grad = ctx.createLinearGradient(0, padT + plotH - bh, 0, padT + plotH);
        grad.addColorStop(0, "#ffb454");
        grad.addColorStop(1, "#ff7a59");
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = "rgba(120,134,178,0.5)";
      }
      roundRectTop(ctx, x, padT + plotH - bh, wBar, bh, 4);
      ctx.fill();
    }

    // cumulative curve (revealed with progress)
    const pts = [];
    let cum = 0;
    for (let i = 0; i < n; i++) {
      cum += vals[i];
      pts.push([padL + i * barW + barW / 2, padT + plotH - (cum / total) * plotH]);
    }
    const reveal = Math.max(1, Math.floor(p * n + 0.0001));
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < reveal; i++) {
      const [cx, cy] = pts[i];
      i ? ctx.lineTo(cx, cy) : ctx.moveTo(cx, cy);
    }
    ctx.stroke();
    ctx.fillStyle = "#fff";
    for (let i = 0; i < reveal; i++) {
      ctx.beginPath();
      ctx.arc(pts[i][0], pts[i][1], 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

  }
}

function roundRectTop(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h);
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

/* ----------------------------------------------------------------- *
 * Subtle pulse on discrete stat updates
 * ----------------------------------------------------------------- */
function attachPulse(ids) {
  if (REDUCED) return; // no decorative motion
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    let last = el.textContent;
    let lastTime = 0;
    const obs = new MutationObserver(() => {
      if (el.textContent === last) return;
      last = el.textContent;
      const now = performance.now();
      if (now - lastTime < 220) return;
      lastTime = now;
      el.classList.remove("pulse");
      void el.offsetWidth; // force reflow so the animation restarts
      el.classList.add("pulse");
    });
    obs.observe(el, { childList: true, characterData: true, subtree: true });
  });
}
// Only discrete (user-paced) stats — skip continuously-animating ones.
attachPulse(["topShare", "topLetters", "wordShare", "wordTop", "monkeyShare", "monkeyTop", "lorenzGini", "lorenzShare"]);

/* ----------------------------------------------------------------- *
 * Boot
 * ----------------------------------------------------------------- */
setView(keyFromHash());
