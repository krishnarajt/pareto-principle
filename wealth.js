// Wealth simulation: the distribution Pareto actually discovered.
// Agents start equal, then repeatedly trade. We measure what share of total
// wealth the richest 20% hold as inequality emerges.
import { Pareto } from "./shared.js";
(function () {
  const canvas = document.getElementById("wealthCanvas");
  const toggleBtn = document.getElementById("wealthToggle");
  const resetBtn = document.getElementById("wealthReset");
  const taxSlider = document.getElementById("wealthTax");
  const taxLabel = document.getElementById("wealthTaxLabel");
  const topEl = document.getElementById("wealthTop");
  const shareEl = document.getElementById("wealthShare");
  const verdictEl = document.getElementById("wealthVerdict");
  const ctx = canvas.getContext("2d");

  const N = 500; // agents
  const START = 100; // starting wealth each
  let wealth = new Float64Array(N).fill(START);
  let running = false;
  let raf = null;

  function reset() {
    wealth = new Float64Array(N).fill(START);
    draw();
    measure();
  }

  // "Yard-sale" exchange: two random agents stake a fraction of the poorer's
  // wealth; a coin flip moves it. Optional redistribution acts like a flat tax.
  function step(transactions) {
    const tax = parseFloat(taxSlider.value); // 0..0.02 redistribution per round
    for (let t = 0; t < transactions; t++) {
      const i = (Math.random() * N) | 0;
      let j = (Math.random() * N) | 0;
      if (i === j) continue;
      const stake = 0.2 * Math.min(wealth[i], wealth[j]);
      if (Math.random() < 0.5) { wealth[i] += stake; wealth[j] -= stake; }
      else { wealth[i] -= stake; wealth[j] += stake; }
    }
    if (tax > 0) {
      let pot = 0;
      for (let k = 0; k < N; k++) { const cut = wealth[k] * tax; wealth[k] -= cut; pot += cut; }
      const share = pot / N;
      for (let k = 0; k < N; k++) wealth[k] += share;
    }
  }

  function measure() {
    const r = Pareto.analyze(Array.from(wealth));
    // bottom 50% share, for contrast
    const sorted = Array.from(wealth).sort((a, b) => a - b);
    const total = sorted.reduce((s, v) => s + v, 0) || 1;
    let bottomHalf = 0;
    for (let k = 0; k < N / 2; k++) bottomHalf += sorted[k];
    const bottomPct = Math.round((bottomHalf / total) * 100);

    topEl.textContent = r.k;
    shareEl.textContent = Math.round(r.sharePct) + "%";
    const holds = r.sharePct >= 75;
    verdictEl.innerHTML =
      `The richest <b>20%</b> hold <b>${Math.round(r.sharePct)}%</b> of the wealth ` +
      `${holds ? "≈ the 80/20 rule." : "and climbing…"} ` +
      `Meanwhile the poorest <b>50%</b> hold just <b>${bottomPct}%</b>.`;
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const sorted = Array.from(wealth).sort((a, b) => b - a); // richest first
    const max = sorted[0] || 1;
    const barW = w / N;
    const cutoff = Math.round(N * 0.2);
    for (let k = 0; k < N; k++) {
      const barH = (sorted[k] / max) * (h - 4);
      ctx.fillStyle = k < cutoff ? "#ff7a59" : "#2c3550";
      ctx.fillRect(k * barW, h - barH, Math.max(barW - 0.3, 1), barH);
    }
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    step(3000);
    draw();
    measure();
  }

  function toggle() {
    running = !running;
    toggleBtn.textContent = running ? "Pause" : "Start trading";
    if (running) loop();
    else if (raf) cancelAnimationFrame(raf);
  }

  taxSlider.addEventListener("input", () => {
    taxLabel.textContent = (parseFloat(taxSlider.value) * 100).toFixed(1) + "%";
  });
  toggleBtn.addEventListener("click", toggle);
  resetBtn.addEventListener("click", () => {
    if (running) toggle();
    reset();
  });
  // Pause the (otherwise endless) simulation when the user leaves this view.
  window.addEventListener("view:change", (e) => {
    if (e.detail !== "wealth" && running) toggle();
  });

  reset();
})();
