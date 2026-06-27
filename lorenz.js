// Lorenz curve & Gini: the formal way to measure concentration.
// Drag the inequality slider; we build a distribution, plot the Lorenz curve
// against the line of equality, and report the Gini coefficient + top-20% share.
import { Pareto } from "./shared.js";
(function () {
  const canvas = document.getElementById("lorenzCanvas");
  const slider = document.getElementById("lorenzSlider");
  const label = document.getElementById("lorenzLabel");
  const giniEl = document.getElementById("lorenzGini");
  const shareEl = document.getElementById("lorenzShare");
  const verdictEl = document.getElementById("lorenzVerdict");
  const ctx = canvas.getContext("2d");

  const N = 200;
  const PAD_L = 46, PAD_B = 34, PAD_T = 16, PAD_R = 16;

  // A Zipf-style distribution: value of rank r is 1 / r^s. s=0 -> all equal.
  function distribution(s) {
    return Array.from({ length: N }, (_, i) => 1 / Math.pow(i + 1, s));
  }

  function lorenzPoints(vals) {
    const asc = [...vals].sort((a, b) => a - b);
    const total = asc.reduce((a, b) => a + b, 0) || 1;
    const X = [0], Y = [0];
    let cum = 0;
    for (let i = 0; i < N; i++) {
      cum += asc[i];
      X.push((i + 1) / N);
      Y.push(cum / total);
    }
    return { X, Y };
  }

  function interpY(X, Y, x0) {
    for (let i = 1; i < X.length; i++) {
      if (X[i] >= x0) {
        const t = (x0 - X[i - 1]) / (X[i] - X[i - 1] || 1);
        return Y[i - 1] + t * (Y[i] - Y[i - 1]);
      }
    }
    return 1;
  }

  function compute() {
    const s = parseFloat(slider.value);
    label.textContent = s.toFixed(2);
    const vals = distribution(s);
    const { X, Y } = lorenzPoints(vals);

    // Gini = 1 - 2 * area under Lorenz curve (trapezoid rule)
    let area = 0;
    for (let i = 1; i < X.length; i++) {
      area += ((X[i] - X[i - 1]) * (Y[i] + Y[i - 1])) / 2;
    }
    const gini = 1 - 2 * area;

    const bottom80 = interpY(X, Y, 0.8);
    const top20 = (1 - bottom80) * 100;

    giniEl.textContent = gini.toFixed(2);
    shareEl.textContent = Math.round(top20) + "%";

    const near = gini >= 0.55 && gini <= 0.65;
    verdictEl.innerHTML =
      `The top <b>20%</b> hold <b>${Math.round(top20)}%</b>, Gini <b>${gini.toFixed(2)}</b> ` +
      `${near ? "≈ this is right around a true 80/20 world." : "."} ` +
      `Perfect equality is the diagonal (Gini 0); a literal 80/20 split sits near Gini 0.6.`;

    draw(X, Y, top20);
  }

  function px(x) { return PAD_L + x * (canvas.width - PAD_L - PAD_R); }
  function py(y) { return canvas.height - PAD_B - y * (canvas.height - PAD_T - PAD_B); }

  function draw(X, Y, top20) {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // axes
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px(0), py(0)); ctx.lineTo(px(1), py(0));
    ctx.moveTo(px(0), py(0)); ctx.lineTo(px(0), py(1));
    ctx.stroke();

    // shaded inequality gap (between equality line and Lorenz curve)
    ctx.beginPath();
    ctx.moveTo(px(0), py(0));
    ctx.lineTo(px(1), py(1));
    for (let i = X.length - 1; i >= 0; i--) ctx.lineTo(px(X[i]), py(Y[i]));
    ctx.closePath();
    ctx.fillStyle = "rgba(255,122,89,0.15)";
    ctx.fill();

    // line of equality
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.moveTo(px(0), py(0)); ctx.lineTo(px(1), py(1)); ctx.stroke();
    ctx.setLineDash([]);

    // Lorenz curve
    ctx.strokeStyle = "#ff7a59";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    X.forEach((x, i) => (i ? ctx.lineTo(px(x), py(Y[i])) : ctx.moveTo(px(x), py(Y[i]))));
    ctx.stroke();

    // 80% population marker
    const y80 = interpY(X, Y, 0.8);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(px(0.8), py(0)); ctx.lineTo(px(0.8), py(y80));
    ctx.lineTo(px(0), py(y80));
    ctx.stroke();
    ctx.setLineDash([]);

    // labels
    ctx.fillStyle = "rgba(232,236,245,0.7)";
    ctx.font = "11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("cumulative population →", (px(0) + px(1)) / 2, h - 8);
    ctx.save();
    ctx.translate(12, (py(0) + py(1)) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("cumulative share →", 0, 0);
    ctx.restore();
    ctx.textAlign = "left";
    ctx.fillStyle = "#ff7a59";
    ctx.fillText(`top 20% = ${Math.round(top20)}%`, px(0.45), py(0.12));
  }

  slider.addEventListener("input", compute);
  compute();
})();
