// Voice experiment: do the top 20% of frequency bins carry ~80% of the energy?
// We accumulate energy per frequency bin over the whole clip, then fix the
// cause side (top 20% of active bins) and MEASURE the energy share they carry.
(function () {
  const canvas = document.getElementById("spectrum");
  const startBtn = document.getElementById("micStart");
  const stopBtn = document.getElementById("micStop");
  const topFreqEl = document.getElementById("micTopFreq");
  const shareEl = document.getElementById("micShare");
  const verdictEl = document.getElementById("micVerdict");
  const rangeSlider = document.getElementById("micRange");
  const rangeLabel = document.getElementById("micRangeLabel");
  const ctx = canvas.getContext("2d");

  let displayMaxHz = 4000; // how far up the spectrum the chart zooms (display only)

  let audioCtx = null;
  let analyser = null;
  let stream = null;
  let source = null;
  let rafTimer = null;
  let freqData = null; // Float32Array of dB values
  let energy = null; // accumulated linear power per bin (the "clip")
  let sampleRate = 44100; // set from the live AudioContext
  let lastMeasure = 0; // throttle the verdict computation

  async function start() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch (err) {
      verdictEl.innerHTML = errorMessage(err);
      return;
    }
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 4096; // -> 2048 frequency bins
    analyser.smoothingTimeConstant = 0;
    sampleRate = audioCtx.sampleRate;
    source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    freqData = new Float32Array(analyser.frequencyBinCount);
    energy = new Float64Array(analyser.frequencyBinCount); // reset accumulation
    lastMeasure = 0;

    startBtn.disabled = true;
    stopBtn.disabled = false;
    loop();
  }

  function stop() {
    if (rafTimer) cancelAnimationFrame(rafTimer);
    rafTimer = null;
    if (source) source.disconnect();
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (audioCtx) audioCtx.close();
    audioCtx = analyser = source = stream = null;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }

  function loop() {
    rafTimer = requestAnimationFrame(loop);
    analyser.getFloatFrequencyData(freqData);

    // Convert dB to linear power and accumulate over the clip.
    for (let i = 0; i < freqData.length; i++) {
      const db = freqData[i];
      if (db > -120) energy[i] += Math.pow(10, db / 10);
    }
    draw();
    const now = performance.now();
    if (now - lastMeasure >= 300) { lastMeasure = now; measure(); } // verdict changes slowly
  }

  function measure() {
    // "Active" bins = those that have collected meaningful energy.
    const peak = Math.max(...energy);
    if (peak <= 0) return;
    const floor = peak * 1e-4;
    const active = [];
    let total = 0;
    for (let i = 0; i < energy.length; i++) {
      if (energy[i] > floor) {
        active.push(energy[i]);
        total += energy[i];
      }
    }
    if (!active.length) return;
    active.sort((a, b) => b - a);

    const n = active.length;
    const k = Math.max(1, Math.round(n * 0.2)); // the "20%"
    let topSum = 0;
    for (let i = 0; i < k; i++) topSum += active[i];
    const sharePct = (topSum / total) * 100;

    let cum = 0, need = n;
    for (let i = 0; i < n; i++) {
      cum += active[i];
      if ((cum / total) * 100 >= 80) { need = i + 1; break; }
    }

    topFreqEl.textContent = k;
    shareEl.textContent = Math.round(sharePct) + "%";
    renderVerdict(sharePct, k, n, need);
  }

  function renderVerdict(sharePct, k, n, need) {
    const holds = sharePct >= 75;
    const verb = holds
      ? "≈ the 80/20 rule holds for this sound."
      : "— concentrated, but short of a true 80/20 split.";
    verdictEl.innerHTML =
      `The loudest <b>20%</b> of frequencies (${k} of ${n} active bins) carry ` +
      `<b>${Math.round(sharePct)}%</b> of the energy ${verb} ` +
      `Reaching 80% takes the top <b>${need}</b> bins ` +
      `(${Math.round((need / n) * 100)}% of them).`;
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padL = 48, padR = 14, padT = 14, padB = 30;
    const plotW = w - padL - padR, plotH = h - padT - padB;

    const peak = Math.max(...energy) || 1;
    const bins = energy.length;
    const fftSize = analyser ? analyser.fftSize : 4096;
    // Show frequencies up to the user-chosen ceiling (display zoom only — the
    // Pareto measurement below still uses every active bin).
    const binHz = sampleRate / fftSize;
    const shown = Math.max(16, Math.min(bins, Math.round(displayMaxHz / binHz)));
    const maxFreq = shown * binHz;

    // horizontal gridlines + relative-energy labels (y axis)
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    [0, 0.25, 0.5, 0.75, 1].forEach((frac) => {
      const y = padT + plotH - frac * plotH;
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke();
      ctx.fillStyle = "rgba(154,164,198,0.7)";
      ctx.fillText(frac.toFixed(2), padL - 6, y + 3);
    });

    // spectrum bars
    const barW = plotW / shown;
    for (let i = 0; i < shown; i++) {
      const mag = Math.sqrt(energy[i] / peak); // sqrt for visual punch
      const barH = mag * plotH;
      ctx.fillStyle = `rgba(255,122,89,${0.32 + mag * 0.68})`;
      ctx.fillRect(padL + i * barW, padT + plotH - barH, Math.max(barW - 0.5, 1), barH);
    }

    // x axis + frequency ticks
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH); ctx.lineTo(padL + plotW, padT + plotH);
    ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH);
    ctx.stroke();
    ctx.fillStyle = "rgba(154,164,198,0.85)";
    ctx.textAlign = "center";
    const step = niceStep(maxFreq);
    for (let f = 0; f <= maxFreq + 1; f += step) {
      const x = padL + (f / maxFreq) * plotW;
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath(); ctx.moveTo(x, padT + plotH); ctx.lineTo(x, padT + plotH + 4); ctx.stroke();
      ctx.fillText(fmtHz(f), x, padT + plotH + 16);
    }

    // axis titles
    ctx.fillStyle = "rgba(154,164,198,0.65)";
    ctx.font = "11px 'Inter', sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("frequency (Hz) →", padL + plotW, padT + plotH + 27);
    ctx.save();
    ctx.translate(13, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText("relative energy", 0, 0);
    ctx.restore();
  }

  function niceStep(max) {
    const target = max / 6;
    const steps = [200, 500, 1000, 2000, 2500, 5000, 10000];
    for (const s of steps) if (s >= target) return s;
    return 10000;
  }
  function fmtHz(f) {
    if (f < 1) return "0";
    return f >= 1000 ? (f / 1000).toFixed(f % 1000 ? 1 : 0) + "k" : String(Math.round(f));
  }

  function errorMessage(err) {
    const insecure = location.protocol === "file:";
    let msg = `Couldn't access the microphone (${err && err.name ? err.name : "error"}).`;
    if (insecure) {
      msg +=
        " Browsers block the mic on <code>file://</code> pages — " +
        "run a local server (e.g. <code>python -m http.server</code>) and open " +
        "<code>http://localhost:8000</code>.";
    }
    return msg;
  }

  rangeSlider.addEventListener("input", () => {
    displayMaxHz = parseFloat(rangeSlider.value) * 1000;
    rangeLabel.textContent = parseFloat(rangeSlider.value).toFixed(1) + " kHz";
    if (energy) draw(); // reflect the new zoom immediately
  });

  startBtn.addEventListener("click", start);
  stopBtn.addEventListener("click", stop);
  window.addEventListener("pagehide", stop);
  // Release the microphone when the user navigates to another view.
  window.addEventListener("view:change", (e) => {
    if (e.detail !== "voice" && audioCtx) stop();
  });
})();
