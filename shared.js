// Shared, honest Pareto math used by every experiment.
// Method: FIX the cause side (top 20% of items), then MEASURE the share they
// cover. We never search for whatever set happens to hit 80%.
export const Pareto = {
  // values: array of non-negative numbers (counts, weights, amounts...)
  analyze(values) {
    const arr = values.filter((v) => v > 0).sort((a, b) => b - a);
    const n = arr.length;
    if (!n) return { n: 0, k: 0, total: 0, sharePct: 0, need: 0 };
    const total = arr.reduce((s, v) => s + v, 0) || 1;
    const k = Math.max(1, Math.round(n * 0.2)); // the "20%"
    let topSum = 0;
    for (let i = 0; i < k; i++) topSum += arr[i];
    const sharePct = (topSum / total) * 100;
    // how many of the top items are needed to actually reach 80%?
    let cum = 0, need = n;
    for (let i = 0; i < n; i++) {
      cum += arr[i];
      if ((cum / total) * 100 >= 80) { need = i + 1; break; }
    }
    return { n, k, total, sharePct, need };
  },

  verdict(r, nounPlural) {
    if (!r || !r.n) return "Not enough data yet.";
    const holds = r.sharePct >= 75;
    const verb = holds
      ? "≈ the 80/20 rule holds."
      : "— concentrated, but short of a true 80/20 split.";
    return (
      `The top <b>20%</b> of ${nounPlural} (${r.k} of ${r.n}) account for ` +
      `<b>${Math.round(r.sharePct)}%</b> ${verb} ` +
      `Reaching 80% takes the top <b>${r.need}</b> ` +
      `(${Math.round((r.need / r.n) * 100)}% of them).`
    );
  },
};
