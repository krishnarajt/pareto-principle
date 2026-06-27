// Camera experiment: does the top 20% of colors cover ~80% of the image?
// Same honest method as typing: fix the cause side (top 20% of distinct colors),
// then MEASURE the share of pixels they account for.
(function () {
  const video = document.getElementById("camVideo");
  const canvas = document.getElementById("camCanvas");
  const startBtn = document.getElementById("camStart");
  const stopBtn = document.getElementById("camStop");
  const paletteEl = document.getElementById("camPalette");
  const topColorsEl = document.getElementById("camTopColors");
  const shareEl = document.getElementById("camShare");
  const verdictEl = document.getElementById("camVerdict");

  const BITS = 3; // bits per channel -> 8 levels each -> up to 512 color buckets
  const SHIFT = 8 - BITS;
  const SAMPLE_W = 200; // downscale width for speed

  let stream = null;
  let rafTimer = null;
  let lastRun = 0;

  function quantize(r, g, b) {
    return ((r >> SHIFT) << (BITS * 2)) | ((g >> SHIFT) << BITS) | (b >> SHIFT);
  }
  function bucketToColor(key) {
    const half = 1 << (SHIFT - 1);
    const qr = (key >> (BITS * 2)) & ((1 << BITS) - 1);
    const qg = (key >> BITS) & ((1 << BITS) - 1);
    const qb = key & ((1 << BITS) - 1);
    return [(qr << SHIFT) + half, (qg << SHIFT) + half, (qb << SHIFT) + half];
  }

  async function start() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    } catch (err) {
      verdictEl.innerHTML = errorMessage(err);
      return;
    }
    video.srcObject = stream;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    loop();
  }

  function stop() {
    if (rafTimer) cancelAnimationFrame(rafTimer);
    rafTimer = null;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stream = null;
    video.srcObject = null;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }

  function loop() {
    rafTimer = requestAnimationFrame(loop);
    const now = performance.now();
    if (now - lastRun < 500) return; // throttle to ~2 analyses/sec for calmer updates
    lastRun = now;
    analyze();
  }

  function analyze() {
    if (!video.videoWidth) return;
    const w = SAMPLE_W;
    const h = Math.round((video.videoHeight / video.videoWidth) * w) || 150;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(video, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;

    const counts = new Map();
    for (let i = 0; i < data.length; i += 4) {
      const key = quantize(data[i], data[i + 1], data[i + 2]);
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const distinct = entries.length;
    const totalPixels = w * h;
    const k = Math.max(1, Math.round(distinct * 0.2)); // the "20%"
    const top = entries.slice(0, k);
    const covered = top.reduce((s, e) => s + e[1], 0);
    const sharePct = (covered / totalPixels) * 100;

    // how many colors to actually reach 80%?
    let cum = 0, need = distinct;
    for (let i = 0; i < entries.length; i++) {
      cum += entries[i][1];
      if ((cum / totalPixels) * 100 >= 80) { need = i + 1; break; }
    }

    topColorsEl.textContent = k;
    shareEl.textContent = Math.round(sharePct) + "%";
    renderPalette(top.slice(0, 12));
    renderVerdict(sharePct, k, distinct, need);
  }

  function renderPalette(top) {
    // Reuse existing swatch nodes so colors morph (via CSS transition) instead
    // of being destroyed/recreated every frame — that recreation was the flicker.
    while (paletteEl.children.length < top.length) {
      const sw = document.createElement("div");
      sw.className = "swatch";
      paletteEl.appendChild(sw);
    }
    while (paletteEl.children.length > top.length) {
      paletteEl.removeChild(paletteEl.lastChild);
    }
    top.forEach((e, i) => {
      const [r, g, b] = bucketToColor(e[0]);
      paletteEl.children[i].style.background = `rgb(${r},${g},${b})`;
    });
  }

  function renderVerdict(sharePct, k, distinct, need) {
    const holds = sharePct >= 75;
    const verb = holds
      ? "≈ the 80/20 rule holds for what you're seeing."
      : "— concentrated, but short of a true 80/20 split.";
    verdictEl.innerHTML =
      `The top <b>20%</b> of colors (${k} of ${distinct} distinct buckets) cover ` +
      `<b>${Math.round(sharePct)}%</b> of the image ${verb} ` +
      `Reaching 80% takes the top <b>${need}</b> colors ` +
      `(${Math.round((need / distinct) * 100)}% of them).`;
  }

  function errorMessage(err) {
    const insecure = location.protocol === "file:";
    let msg = `Couldn't access the camera (${err && err.name ? err.name : "error"}).`;
    if (insecure) {
      msg +=
        " Browsers block the camera on <code>file://</code> pages — " +
        "run a local server (e.g. <code>python -m http.server</code>) and open " +
        "<code>http://localhost:8000</code>.";
    }
    return msg;
  }

  startBtn.addEventListener("click", start);
  stopBtn.addEventListener("click", stop);
  window.addEventListener("pagehide", stop);
  // Turn the camera off when the user navigates to another view.
  window.addEventListener("view:change", (e) => {
    if (e.detail !== "camera" && stream) stop();
  });
})();
