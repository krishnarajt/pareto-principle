// A gallery of famous real-world Pareto / power-law cases, each drawn as a
// classic Pareto chart (sorted bars + cumulative curve + 80% line).
// NOTE: figures are approximate and illustrative — they show the characteristic
// shape, not exact values. Sources are noted per card.
(function () {
  const grid = document.getElementById("examplesGrid");
  if (!grid) return;

  const EXAMPLES = [
    {
      title: "📜 Pareto's original observation",
      labels: ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
      values: [62, 18, 8, 5, 3, 2, 1, 0.6, 0.3, 0.1],
      blurb:
        "In 1896 Vilfredo Pareto found ~80% of Italy's land was owned by ~20% of the people — the observation that named the principle.",
      source: "Pareto, Cours d'économie politique (1896) · illustrative",
    },
    {
      title: "💰 Global wealth",
      labels: ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
      values: [76, 11, 6, 3, 1.6, 1, 0.7, 0.4, 0.2, 0.1],
      blurb:
        "The richest 10% of adults hold roughly three-quarters of all household wealth worldwide.",
      source: "UBS/Credit Suisse Global Wealth Report (~2023), approx.",
    },
    {
      title: "🏥 US healthcare spending",
      labels: ["Top 1%", "2–5%", "6–10%", "11–20%", "21–50%", "Bottom 50%"],
      values: [22, 27, 17, 16, 15, 3],
      blurb:
        "The costliest 5% of patients account for about half of all health spending; the top 20% for roughly 80%.",
      source: "AHRQ / NIHCM, US, approx.",
    },
    {
      title: "🔤 English word frequency (Zipf)",
      labels: ["the", "of", "and", "to", "a", "in", "is", "it", "you", "that"],
      values: [7.0, 3.5, 2.8, 2.6, 2.3, 2.1, 1.3, 1.1, 1.0, 0.9],
      blurb:
        "A few function words dominate everything we write — the ~100 commonest words make up about half of all text.",
      source: "Oxford English Corpus, approx.",
    },
    {
      title: "💼 Sales by customer",
      labels: ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10"],
      values: [55, 25, 8, 5, 3, 2, 1, 0.6, 0.3, 0.1],
      blurb:
        "The classic management rule of thumb: ~80% of revenue tends to come from ~20% of customers (or products).",
      source: "Joseph Juran's '80/20 rule' · illustrative",
    },
    {
      title: "🐞 Software bugs",
      labels: ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10"],
      values: [34, 21, 13, 9, 7, 5, 4, 3, 2, 2],
      blurb:
        "Microsoft reported that fixing the 20% of bugs causing the most crashes removes about 80% of the related errors.",
      source: "Microsoft (~2002) · illustrative",
    },
    {
      title: "🎵 Music streaming",
      labels: ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"],
      values: [62, 20, 8, 4, 2, 1.5, 1, 0.8, 0.5, 0.2],
      blurb:
        "On streaming platforms a tiny fraction of artists capture the overwhelming majority of plays and royalties.",
      source: "Industry analyses · illustrative",
    },
    {
      title: "⚖️ Repeat offenders",
      labels: ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"],
      values: [50, 18, 10, 7, 5, 4, 3, 2, 0.7, 0.3],
      blurb:
        "Criminology repeatedly finds a small group of offenders behind most crimes — e.g. ~6% of boys committed ~50% of offenses in Wolfgang's 1972 cohort.",
      source: "Wolfgang et al., Delinquency in a Birth Cohort (1972), approx.",
    },
    {
      title: "🌆 World megacities (rank-size)",
      labels: ["Tokyo", "Delhi", "Shang.", "Dhaka", "S.Paulo", "Mexico", "Cairo", "Beijing", "Mumbai", "Osaka"],
      values: [37, 33, 29, 23, 22, 22, 22, 21, 21, 19],
      blurb:
        "City sizes follow Zipf's law — a power-law cousin of 80/20. Across all cities the biggest few dominate global urban population.",
      source: "UN World Urbanization Prospects (2018), metro, approx.",
    },
    {
      title: "🌍 Countries by population",
      labels: ["India", "China", "USA", "Indon.", "Pak.", "Nigeria", "Brazil", "B.desh", "Russia", "Mexico"],
      values: [1428, 1426, 340, 277, 240, 224, 216, 173, 144, 128],
      blurb:
        "The ten most populous countries are home to well over half of humanity; the long tail of ~190 others holds the rest.",
      source: "UN, 2023, millions, approx.",
    },
  ];

  function drawChart(canvas, labels, values) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const pairs = labels
      .map((l, i) => [l, values[i]])
      .sort((a, b) => b[1] - a[1]);
    const labs = pairs.map((p) => p[0]);
    const vals = pairs.map((p) => p[1]);
    const n = vals.length;
    const total = vals.reduce((a, b) => a + b, 0) || 1;
    const maxV = vals[0] || 1;

    const padL = 10, padR = 30, padT = 14, padB = 40;
    const plotW = W - padL - padR, plotH = H - padT - padB;
    const barW = plotW / n;
    const cutoff = Math.max(1, Math.round(n * 0.2)); // top 20% of bars

    // bars
    for (let i = 0; i < n; i++) {
      const bh = (vals[i] / maxV) * plotH;
      ctx.fillStyle = i < cutoff ? "#ff7a59" : "#2c3550";
      ctx.fillRect(padL + i * barW + 1, padT + plotH - bh, barW - 2, bh);
    }

    // 80% reference line
    const y80 = padT + plotH - 0.8 * plotH;
    ctx.strokeStyle = "rgba(255,122,89,0.45)";
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(padL, y80);
    ctx.lineTo(padL + plotW, y80);
    ctx.stroke();
    ctx.setLineDash([]);

    // cumulative curve (right axis = 0..100%)
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    let cum = 0;
    const pts = [];
    for (let i = 0; i < n; i++) {
      cum += vals[i];
      const cx = padL + i * barW + barW / 2;
      const cy = padT + plotH - (cum / total) * plotH;
      pts.push([cx, cy]);
      i ? ctx.lineTo(cx, cy) : ctx.moveTo(cx, cy);
    }
    ctx.stroke();
    ctx.fillStyle = "#fff";
    pts.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // right-axis ticks
    ctx.fillStyle = "rgba(232,236,245,0.5)";
    ctx.font = "9px system-ui, sans-serif";
    ctx.textAlign = "left";
    [0, 50, 100].forEach((p) => {
      const y = padT + plotH - (p / 100) * plotH;
      ctx.fillText(p + "%", padL + plotW + 3, y + 3);
    });

    // x labels (rotated)
    ctx.fillStyle = "rgba(232,236,245,0.6)";
    ctx.textAlign = "right";
    for (let i = 0; i < n; i++) {
      const x = padL + i * barW + barW / 2;
      ctx.save();
      ctx.translate(x, padT + plotH + 6);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(String(labs[i]).slice(0, 8), 0, 0);
      ctx.restore();
    }
  }

  EXAMPLES.forEach((ex) => {
    const card = document.createElement("div");
    card.className = "example-card";

    const h3 = document.createElement("h3");
    h3.textContent = ex.title;

    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 200;

    const blurb = document.createElement("p");
    blurb.className = "example-blurb";
    blurb.textContent = ex.blurb;

    const source = document.createElement("p");
    source.className = "example-source";
    source.textContent = "Source: " + ex.source;

    card.append(h3, canvas, blurb, source);
    grid.appendChild(card);
    drawChart(canvas, ex.labels, ex.values);
  });
})();
