// Mouse heatmap: does a small fraction of the area absorb most of the activity?
// Move and click inside the pad; we accumulate dwell + clicks per grid cell.
import { Pareto } from "./shared.js";
(function () {
  const canvas = document.getElementById("mouseCanvas");
  const resetBtn = document.getElementById("mouseReset");
  const topEl = document.getElementById("mouseTop");
  const shareEl = document.getElementById("mouseShare");
  const verdictEl = document.getElementById("mouseVerdict");
  const ctx = canvas.getContext("2d");

  const COLS = 48, ROWS = 24;
  let grid = new Float64Array(COLS * ROWS);

  function cellFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * COLS;
    const y = ((e.clientY - rect.top) / rect.height) * ROWS;
    const cx = Math.min(COLS - 1, Math.max(0, x | 0));
    const cy = Math.min(ROWS - 1, Math.max(0, y | 0));
    return cy * COLS + cx;
  }

  function add(idx, weight) {
    grid[idx] += weight;
    draw();
    measure();
  }

  canvas.addEventListener("mousemove", (e) => add(cellFromEvent(e), 1));
  canvas.addEventListener("click", (e) => add(cellFromEvent(e), 25)); // clicks count more

  function measure() {
    const r = Pareto.analyze(Array.from(grid));
    topEl.textContent = r.n ? r.k : "—";
    shareEl.textContent = r.n ? Math.round(r.sharePct) + "%" : "—";
    verdictEl.innerHTML = r.n
      ? Pareto.verdict(r, "visited cells")
      : "Move and click around inside the pad to build a heatmap.";
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    const cw = w / COLS, ch = h / ROWS;
    let max = 0;
    for (let i = 0; i < grid.length; i++) if (grid[i] > max) max = grid[i];
    max = max || 1;
    ctx.fillStyle = "#0c1020";
    ctx.fillRect(0, 0, w, h);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const v = grid[r * COLS + c];
        if (!v) continue;
        const t = Math.sqrt(v / max); // sqrt so light use is still visible
        ctx.fillStyle = `rgba(255,122,89,${0.12 + t * 0.88})`;
        ctx.fillRect(c * cw, r * ch, cw, ch);
      }
    }
  }

  resetBtn.addEventListener("click", () => {
    grid = new Float64Array(COLS * ROWS);
    draw();
    measure();
  });

  draw();
  measure();
})();
