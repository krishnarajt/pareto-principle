// Typical English letter frequencies (% of all letters).
const ENGLISH_FREQ = {
  e: 12.70, t: 9.06, a: 8.17, o: 7.51, i: 6.97, n: 6.75, s: 6.33,
  h: 6.09, r: 5.99, d: 4.25, l: 4.03, c: 2.78, u: 2.76, m: 2.41,
  w: 2.36, f: 2.23, g: 2.02, y: 1.97, p: 1.93, b: 1.49, v: 0.98,
  k: 0.77, j: 0.15, x: 0.15, q: 0.10, z: 0.07,
};

const KB_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
];

const PARETO_THRESHOLD = 80; // cumulative % we call the "vital few"

const keyboardEl = document.getElementById("keyboard");
const chartEl = document.getElementById("chart");
const typeBox = document.getElementById("typeBox");
const resetBtn = document.getElementById("resetBtn");
const modeToggle = document.getElementById("modeToggle");

const keyEls = {}; // letter -> key element
const userCounts = {}; // letter -> count typed

// --- Determine the vital few (smallest set reaching the threshold) ---
function sortedByFreq(freqMap) {
  return Object.keys(freqMap).sort((a, b) => freqMap[b] - freqMap[a]);
}

// Honest Pareto test: FIX the cause side at the top 20% of letters, then
// MEASURE what share of keystrokes those letters actually cover. We do NOT
// search for whatever set hits 80% — that would force the answer.
const VITAL_FRACTION = 0.2; // the "20%" in 80/20

function vitalFewSet(freqMap) {
  const total = Object.values(freqMap).reduce((s, v) => s + v, 0) || 1;
  const order = sortedByFreq(freqMap);
  // 20% of the 26-letter alphabet -> 5 letters (rounded).
  const count = Math.max(1, Math.round(order.length * VITAL_FRACTION));
  const top = order.slice(0, count);
  const set = new Set(top);
  const covered = top.reduce((s, l) => s + (freqMap[l] || 0), 0);
  return { set, count, sharePct: (covered / total) * 100, total };
}

// How many of the top letters are needed before they cover `threshold`%?
function lettersToReach(freqMap, threshold) {
  const total = Object.values(freqMap).reduce((s, v) => s + v, 0) || 1;
  const order = sortedByFreq(freqMap);
  let cum = 0;
  for (let i = 0; i < order.length; i++) {
    cum += freqMap[order[i]] || 0;
    if ((cum / total) * 100 >= threshold) return { count: i + 1, sharePct: (cum / total) * 100 };
  }
  return { count: order.length, sharePct: 100 };
}

// --- Build the keyboard ---
function buildKeyboard() {
  KB_ROWS.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "kb-row";
    row.forEach((letter) => {
      const key = document.createElement("div");
      key.className = "key";
      key.dataset.letter = letter;
      key.innerHTML = `${letter.toUpperCase()}<span class="freq"></span>`;
      rowEl.appendChild(key);
      keyEls[letter] = key;
    });
    keyboardEl.appendChild(rowEl);
  });
}

// Map a 0..1 intensity to a color between the cool and hot palette.
function heatColor(t) {
  // cool: #2c3550 (44,53,80) -> hot: #ff7a59 (255,122,89)
  const c1 = [44, 53, 80];
  const c2 = [255, 122, 89];
  const mix = c1.map((v, i) => Math.round(v + (c2[i] - v) * t));
  return `rgb(${mix[0]}, ${mix[1]}, ${mix[2]})`;
}

// --- Render the heatmap + chart for the active frequency map ---
function activeFreqMap() {
  if (modeToggle.checked) return ENGLISH_FREQ;
  // build a freq map from user counts (letters not typed default to 0)
  const map = {};
  Object.keys(ENGLISH_FREQ).forEach((l) => {
    map[l] = userCounts[l] || 0;
  });
  return map;
}

function render() {
  const freqMap = activeFreqMap();
  const max = Math.max(...Object.values(freqMap), 0.0001);
  const { set, count, sharePct, total } = vitalFewSet(freqMap);
  const hasData = total > 1 || modeToggle.checked;

  // keyboard heatmap — the "vital few" = the top 20% of letters
  Object.keys(keyEls).forEach((letter) => {
    const key = keyEls[letter];
    const val = freqMap[letter] || 0;
    const t = val / max;
    key.style.background = heatColor(t);
    key.classList.toggle("vital", set.has(letter) && val > 0);
    const freqSpan = key.querySelector(".freq");
    if (modeToggle.checked) {
      freqSpan.textContent = val.toFixed(1);
    } else {
      freqSpan.textContent = val > 0 ? val : "";
    }
  });

  // stat cards: cause side is fixed at 20% of letters; we measure the effect.
  document.getElementById("topLetters").textContent = hasData ? count : "—";
  document.getElementById("topShare").textContent =
    hasData ? Math.round(sharePct) + "%" : "—";

  renderVerdict(freqMap, set, count, sharePct, hasData);
  renderChart(freqMap, set);
}

// Honest read-out: state the measured effect, and how far it is from a true 80/20.
function renderVerdict(freqMap, set, count, sharePct, hasData) {
  const el = document.getElementById("verdict");
  if (!el) return;
  if (!hasData) {
    el.textContent = "Type something to test the 80/20 rule on your own text.";
    return;
  }
  const topLetters = [...set]
    .filter((l) => (freqMap[l] || 0) > 0)
    .map((l) => l.toUpperCase())
    .join(", ");
  const need = lettersToReach(freqMap, 80);
  const holds = sharePct >= 75; // give "roughly 80" some slack
  const verb = holds ? "≈ the 80/20 rule roughly holds." : "— short of a true 80/20 split.";
  el.innerHTML =
    `The top <b>20%</b> of letters (${topLetters}) cover <b>${Math.round(sharePct)}%</b> ` +
    `of keystrokes ${verb} ` +
    `To actually reach 80% you'd need the top <b>${need.count}</b> letters ` +
    `(${Math.round((need.count / 26) * 100)}% of the alphabet).`;
}

// --- Pareto bar chart, sorted descending ---
function renderChart(freqMap, vitalSet) {
  chartEl.innerHTML = "";
  const order = sortedByFreq(freqMap).filter((l) => (freqMap[l] || 0) > 0);
  const display = order.length ? order : sortedByFreq(ENGLISH_FREQ);
  const max = Math.max(...display.map((l) => freqMap[l] || 0), 0.0001);

  display.forEach((letter) => {
    const val = freqMap[letter] || 0;
    const wrap = document.createElement("div");
    wrap.className = "bar-wrap";

    const bar = document.createElement("div");
    bar.className = "bar" + (vitalSet.has(letter) ? " vital" : "");
    bar.style.height = `${Math.max((val / max) * 100, 2)}%`;
    bar.title = `${letter.toUpperCase()}: ${val.toFixed(2)}`;

    const label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = letter;

    wrap.appendChild(bar);
    wrap.appendChild(label);
    chartEl.appendChild(wrap);
  });
}

// --- Typing interaction ---
typeBox.addEventListener("input", () => {
  // recount from scratch so deletes are handled correctly
  Object.keys(userCounts).forEach((k) => delete userCounts[k]);
  for (const ch of typeBox.value.toLowerCase()) {
    if (ch >= "a" && ch <= "z") {
      userCounts[ch] = (userCounts[ch] || 0) + 1;
    }
  }
  // As soon as the user types, switch to their live data so the
  // keyboard, stats and chart update on every keystroke.
  if (typeBox.value.trim().length > 0 && modeToggle.checked) {
    modeToggle.checked = false;
  }
  render();
});

typeBox.addEventListener("keydown", (e) => {
  const letter = e.key.toLowerCase();
  if (keyEls[letter]) {
    const key = keyEls[letter];
    key.classList.add("pressed");
    setTimeout(() => key.classList.remove("pressed"), 120);
  }
});

resetBtn.addEventListener("click", () => {
  typeBox.value = "";
  Object.keys(userCounts).forEach((k) => delete userCounts[k]);
  modeToggle.checked = true; // back to the typical-English view
  render();
});

modeToggle.addEventListener("change", render);

// --- Init ---
buildKeyboard();
render();
