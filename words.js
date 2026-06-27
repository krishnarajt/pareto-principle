// Word frequency (Zipf's law): do the top 20% of distinct words make ~80% of text?
// Plus a live log–log rank/frequency plot — the visual signature of Zipf's law.
import { Pareto } from "./shared.js";
(function () {
  const input = document.getElementById("wordInput");
  const sampleBtn = document.getElementById("wordSample");
  const topEl = document.getElementById("wordTop");
  const shareEl = document.getElementById("wordShare");
  const listEl = document.getElementById("wordList");
  const verdictEl = document.getElementById("wordVerdict");
  const plot = document.getElementById("zipfPlot");
  const pctx = plot ? plot.getContext("2d") : null;

  const SAMPLE =
    "It was the best of times, it was the worst of times, it was the age of " +
    "wisdom, it was the age of foolishness, it was the epoch of belief, it was " +
    "the epoch of incredulity, it was the season of Light, it was the season of " +
    "Darkness, it was the spring of hope, it was the winter of despair, we had " +
    "everything before us, we had nothing before us, we were all going direct to " +
    "Heaven, we were all going direct the other way.";

  function analyze() {
    const words = (input.value.toLowerCase().match(/[a-z']+/g) || []);
    if (!words.length) {
      topEl.textContent = shareEl.textContent = "—";
      listEl.innerHTML = "";
      verdictEl.textContent = "Type or paste some text to test it.";
      drawPlot([]);
      return;
    }
    const counts = new Map();
    for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);

    const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const r = Pareto.analyze(entries.map((e) => e[1]));

    topEl.textContent = r.k;
    shareEl.textContent = Math.round(r.sharePct) + "%";
    verdictEl.innerHTML =
      Pareto.verdict(r, "words") +
      ` (${words.length} words total, ${r.n} unique.)`;
    renderList(entries.slice(0, 10), words.length, r.k);
    drawPlot(entries.map((e) => e[1]));
  }

  function renderList(top, totalWords, vitalCount) {
    listEl.innerHTML = "";
    top.forEach((e, i) => {
      const row = document.createElement("div");
      row.className = "word-row" + (i < vitalCount ? " vital" : "");
      const pct = ((e[1] / totalWords) * 100).toFixed(1);
      row.innerHTML =
        `<span class="word-rank">${i + 1}</span>` +
        `<span class="word-text">${e[0]}</span>` +
        `<span class="word-bar" style="width:${(e[1] / top[0][1]) * 100}%"></span>` +
        `<span class="word-count">${e[1]} · ${pct}%</span>`;
      listEl.appendChild(row);
    });
  }

  // ---- log–log rank vs frequency plot (the Zipf signature) ----
  function drawPlot(countsDesc) {
    if (!pctx) return;
    const W = plot.width, H = plot.height;
    pctx.clearRect(0, 0, W, H);
    const padL = 56, padR = 18, padT = 18, padB = 42;
    const plotW = W - padL - padR, plotH = H - padT - padB;

    // axes frame
    pctx.strokeStyle = "rgba(255,255,255,0.18)";
    pctx.lineWidth = 1;
    pctx.strokeRect(padL, padT, plotW, plotH);

    if (!countsDesc.length) {
      pctx.fillStyle = "rgba(154,164,198,0.7)";
      pctx.font = "14px 'Inter', sans-serif";
      pctx.textAlign = "center";
      pctx.fillText("Type or load text to plot the rank–frequency curve.", padL + plotW / 2, padT + plotH / 2);
      drawAxisTitles(W, H, padL, padT, plotW, plotH);
      return;
    }

    const n = countsDesc.length;
    const maxCount = countsDesc[0];
    const maxLogR = Math.log10(Math.max(n, 1)) || 1;       // x range: 0..log10(n)
    const maxLogC = Math.log10(Math.max(maxCount, 1)) || 1; // y range: 0..log10(maxCount)
    const xR = maxLogR || 1, yR = maxLogC || 1;

    const X = (logR) => padL + (logR / xR) * plotW;
    const Y = (logC) => padT + plotH - (logC / yR) * plotH;

    // gridlines at powers of ten
    pctx.font = "10px 'JetBrains Mono', monospace";
    pctx.fillStyle = "rgba(154,164,198,0.65)";
    pctx.strokeStyle = "rgba(255,255,255,0.06)";
    pctx.textAlign = "center";
    for (let p = 0; Math.pow(10, p) <= n * 1.0000001; p++) {
      const x = X(p);
      pctx.beginPath(); pctx.moveTo(x, padT); pctx.lineTo(x, padT + plotH); pctx.stroke();
      pctx.fillText("10" + supr(p), x, padT + plotH + 14);
    }
    pctx.textAlign = "right";
    for (let p = 0; Math.pow(10, p) <= maxCount * 1.0000001; p++) {
      const y = Y(p);
      pctx.beginPath(); pctx.moveTo(padL, y); pctx.lineTo(padL + plotW, y); pctx.stroke();
      pctx.fillText("10" + supr(p), padL - 6, y + 3);
    }

    // ideal Zipf line: count ≈ maxCount / rank  ->  logC = logMax - logR.
    // Only meaningful with >1 rank AND a top count above 1; otherwise the data
    // collapses onto an axis and a full-height reference line would mislead.
    const showIdeal = n >= 2 && maxCount >= 2;
    if (showIdeal) {
      pctx.strokeStyle = "rgba(139,123,255,0.85)";
      pctx.setLineDash([6, 4]);
      pctx.lineWidth = 2;
      pctx.beginPath();
      pctx.moveTo(X(0), Y(Math.min(yR, maxLogC)));
      const endLogC = Math.max(0, maxLogC - maxLogR);
      pctx.lineTo(X(maxLogR), Y(endLogC));
      pctx.stroke();
      pctx.setLineDash([]);
    } else {
      pctx.fillStyle = "rgba(154,164,198,0.85)";
      pctx.font = "12px 'Inter', sans-serif";
      pctx.textAlign = "center";
      pctx.fillText("Add more varied text to reveal the 1/rank slope.", padL + plotW / 2, padT + plotH / 2);
    }

    // observed points
    const cap = Math.min(n, 6000);
    pctx.fillStyle = "rgba(255,122,89,0.85)";
    for (let i = 0; i < cap; i++) {
      const x = X(Math.log10(i + 1));
      const y = Y(Math.log10(countsDesc[i]));
      const rad = n > 400 ? 1.5 : 2.6;
      pctx.beginPath();
      pctx.arc(x, y, rad, 0, Math.PI * 2);
      pctx.fill();
    }

    // legend
    pctx.textAlign = "left";
    pctx.font = "11px 'Inter', sans-serif";
    pctx.fillStyle = "rgba(255,122,89,0.95)";
    pctx.fillText("● your words", padL + 10, padT + 16);
    if (showIdeal) {
      pctx.fillStyle = "rgba(139,123,255,0.95)";
      pctx.fillText("– – ideal 1/rank", padL + 10, padT + 32);
    }

    drawAxisTitles(W, H, padL, padT, plotW, plotH);
  }

  function drawAxisTitles(W, H, padL, padT, plotW, plotH) {
    pctx.fillStyle = "rgba(154,164,198,0.85)";
    pctx.font = "11px 'Inter', sans-serif";
    pctx.textAlign = "center";
    pctx.fillText("word rank (log scale) →", padL + plotW / 2, H - 8);
    pctx.save();
    pctx.translate(14, padT + plotH / 2);
    pctx.rotate(-Math.PI / 2);
    pctx.fillText("frequency (log scale) →", 0, 0);
    pctx.restore();
  }

  function supr(p) {
    const map = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
    return String(p).split("").map((c) => map[c] || c).join("");
  }

  input.addEventListener("input", analyze);
  sampleBtn.addEventListener("click", () => {
    input.value = SAMPLE;
    analyze();
  });

  // Pre-fill the sample so the flagship page is alive on arrival.
  input.value = SAMPLE;
  analyze();
})();
