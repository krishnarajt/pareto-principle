// Random typing -> Zipf: hit random keys (letters + spacebar) and the resulting
// "words" STILL follow an ~80/20 distribution. Concentration from pure chance.
import { Pareto } from "./shared.js";
(function () {
  const genBtn = document.getElementById("monkeyGen");
  const lenSlider = document.getElementById("monkeyLen");
  const lenLabel = document.getElementById("monkeyLenLabel");
  const spaceSlider = document.getElementById("monkeySpace");
  const spaceLabel = document.getElementById("monkeySpaceLabel");
  const previewEl = document.getElementById("monkeyPreview");
  const listEl = document.getElementById("monkeyList");
  const topEl = document.getElementById("monkeyTop");
  const shareEl = document.getElementById("monkeyShare");
  const verdictEl = document.getElementById("monkeyVerdict");

  function generate() {
    const len = parseInt(lenSlider.value, 10);
    const pSpace = parseFloat(spaceSlider.value);
    const chars = new Array(len);
    for (let i = 0; i < len; i++) {
      chars[i] =
        Math.random() < pSpace
          ? " "
          : String.fromCharCode(97 + ((Math.random() * 26) | 0));
    }
    const text = chars.join("");
    const words = text.split(/\s+/).filter(Boolean);

    const counts = new Map();
    for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);
    const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const r = Pareto.analyze(entries.map((e) => e[1]));

    topEl.textContent = r.k;
    shareEl.textContent = Math.round(r.sharePct) + "%";
    verdictEl.innerHTML =
      Pareto.verdict(r, 'random "words"') +
      ` (${words.length.toLocaleString()} words, ${r.n.toLocaleString()} unique — ` +
      `and nobody typed on purpose.)`;
    previewEl.textContent = text.slice(0, 260) + (text.length > 260 ? "…" : "");
    renderList(entries.slice(0, 10), words.length, r.k);
  }

  function renderList(top, totalWords, vitalCount) {
    listEl.innerHTML = "";
    const maxVal = top.length ? top[0][1] : 1;
    top.forEach((e, i) => {
      const row = document.createElement("div");
      row.className = "word-row" + (i < vitalCount ? " vital" : "");
      const pct = ((e[1] / totalWords) * 100).toFixed(1);
      row.innerHTML =
        `<span class="word-rank">${i + 1}</span>` +
        `<span class="word-text">${e[0] || "·"}</span>` +
        `<span class="word-bar" style="width:${(e[1] / maxVal) * 100}%"></span>` +
        `<span class="word-count">${e[1]} · ${pct}%</span>`;
      listEl.appendChild(row);
    });
  }

  lenSlider.addEventListener("input", () => {
    lenLabel.textContent = parseInt(lenSlider.value, 10).toLocaleString();
  });
  spaceSlider.addEventListener("input", () => {
    spaceLabel.textContent = Math.round(parseFloat(spaceSlider.value) * 100) + "%";
  });
  genBtn.addEventListener("click", generate);

  generate();
})();
