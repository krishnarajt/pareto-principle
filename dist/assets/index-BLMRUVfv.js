(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))a(l);new MutationObserver(l=>{for(const d of l)if(d.type==="childList")for(const t of d.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&a(t)}).observe(document,{childList:!0,subtree:!0});function i(l){const d={};return l.integrity&&(d.integrity=l.integrity),l.referrerPolicy&&(d.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?d.credentials="include":l.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function a(l){if(l.ep)return;l.ep=!0;const d=i(l);fetch(l.href,d)}})();const pe={dashboard:`<div class="lesson-block">
  <h3>🎯 What the 80/20 rule says</h3>
  <p>The <b>Pareto principle</b> is the observation that, in many systems, <em>roughly 80% of the effects come from roughly 20% of the causes</em>. A small slice of customers drives most revenue; a handful of words fill most of a page; a few colors cover most of an image. This whole site is one long stress-test of that claim across very different "signals" — keystrokes, pixels, sound, words, wealth, mouse movement — to see how often the lopsided shape really shows up.</p>
  <p>The crucial caveat first: <b>"80/20" is a memorable label, not a law of nature.</b> The real split might be 90/10, 70/30, 95/5, or 67/33. And the two numbers <em>need not add up to 100</em> — "20% of causes → 80% of effects" and, say, "10% of causes → 90% of effects" are both perfectly valid Pareto-type statements. The point is not the exact pair of numbers; it is that the distribution is <em>concentrated</em>: a "vital few" matter far more than the "trivial many".</p>
</div>

<div class="lesson-block">
  <h3>📜 Where the idea came from</h3>
  <p>In <b>1896</b>, the Italian economist <b>Vilfredo Pareto</b>, writing in his <em>Cours d'économie politique</em>, noticed that about <b>80% of the land in Italy was owned by about 20% of the population</b>. Looking further, he found the same lopsidedness recurring — in other countries, and in other eras. (The very first card in the gallery above, "Pareto's original observation," sketches this with illustrative figures: a top decile of roughly <code>62</code> down a steep tail to <code>0.1</code>.)</p>
  <p>Pareto described the phenomenon, but he didn't turn it into the catchy rule we use today. That was the quality-management pioneer <b>Joseph M. Juran</b>, who in the mid-20th century generalized the idea well beyond land and income, attached <em>Pareto's name</em> to it, and coined the phrase <b>"the vital few and the trivial many."</b> The "Sales by customer" card credits Juran's 80/20 rule directly.</p>
</div>

<div class="lesson-block">
  <h3>🌊 Why it keeps happening: power laws</h3>
  <p>The Pareto pattern is the visible fingerprint of a <b>power-law</b> (or "heavy-tailed") distribution. In such distributions a few items are enormous and a very long "tail" of items are tiny, rather than everything clustering around an average. Plotted as sorted bars, you get the signature shape you'll see all over this page: a few towering bars on the left collapsing into a long low tail on the right.</p>
  <p><b>Zipf's law</b> — explored elsewhere on the site in the word-frequency and random-typing activities — is a close cousin. It says the frequency of an item is roughly inversely proportional to its rank: the 2nd most common word appears about half as often as the 1st, the 3rd about a third as often, and so on. The English-word-frequency card above shows it: <code>the</code> at ~<code>7.0</code>%, <code>of</code> at ~<code>3.5</code>%, <code>and</code> at ~<code>2.8</code>%. Zipf's law and Pareto's principle are two views of the same heavy-tailed behavior.</p>
</div>

<div class="lesson-block">
  <h3>⚖️ The honest method this site uses</h3>
  <p>It is easy to make 80/20 "work" by cheating: take any data, hunt for whichever group of items happens to add up to 80% of the total, and announce that <em>those</em> are your causes. That is unfalsifiable — you can always find <em>some</em> set summing to 80%, so the rule could never be "wrong." We refuse to do that.</p>
  <p>Instead, every experiment shares one routine (<code>Pareto.analyze</code>). It <b>fixes the cause side at the top 20% of items first</b>, and only then <b>measures</b> what share of the effect those items actually cover. Concretely:</p>
  <ol class="steps">
    <li>Drop any items with a value of zero, then <b>sort</b> all values from largest to smallest.</li>
    <li>Count the items: <code>n</code>. Define the "vital few" as the top <code>k = max(1, round(n × 0.2))</code> — literally the top 20% (rounded), always at least one item.</li>
    <li>Add up the values of just those top <code>k</code> items: <code>topSum</code>.</li>
    <li>Report their share of the grand total: <code>sharePct = topSum ÷ total × 100</code>.</li>
    <li>Separately, walk down the sorted list adding values until the running total first reaches 80%, and report how many items (<code>need</code>) that actually took.</li>
  </ol>
  <div class="formula">
    share of effect = ( Σ<sub>top 20%</sub> values ) ÷ ( Σ<sub>all</sub> values ) × 100%<br>
    where the top 20% = round(<i>n</i> × 0.2) items, chosen <em>before</em> measuring
  </div>
  <p>Because the 20% is pinned in advance, the resulting percentage is free to be disappointing. If your text only gives the top 20% of letters a <code>62%</code> share, the page will say so, rather than quietly reshuffling the cutoff until it hits 80.</p>
</div>

<div class="lesson-block">
  <h3>📊 Holds, or merely concentrated?</h3>
  <p>The site is deliberately strict about declaring victory. The verdict (<code>Pareto.verdict</code>) calls the rule satisfied only when the measured share is <b>75% or more</b>; the wording is "<em>≈ the 80/20 rule holds</em>." Anything below that gets the honest verdict "<em>concentrated, but short of a true 80/20 split</em>." It also tells you the <code>need</code> figure — e.g. "reaching 80% takes the top 9 (35% of them)" — so you can see exactly how far from a clean 20%→80% the data really is.</p>
  <p>This matters because some signals nail it and others don't. Whole <em>words</em> (Zipf) tend to land near a real 80/20, while the 26 <em>letters</em> of the alphabet are too few and too evenly used to get there — they come out concentrated but well short. Honest measurement lets the difference show.</p>
  <table class="mini-table">
    <thead><tr><th>Term in the code</th><th>What it means</th></tr></thead>
    <tbody>
      <tr><td><code>k</code></td><td>size of the "vital few" = round(<i>n</i> × 0.2)</td></tr>
      <tr><td><code>sharePct</code></td><td>% of the total covered by those top <i>k</i> items</td></tr>
      <tr><td><code>need</code></td><td>how many top items are needed to actually reach 80%</td></tr>
      <tr><td>≥ 75%</td><td>threshold to say the rule "holds"</td></tr>
    </tbody>
  </table>
</div>

<div class="lesson-block">
  <h3>🔍 How to read a Pareto chart</h3>
  <p>Every chart on this page — the keystroke curve, and each card in the real-world gallery — follows the same classic recipe, so once you can read one you can read them all:</p>
  <ul class="bullets">
    <li><b>Bars, sorted largest → smallest.</b> The tallest is on the left; height falls off into a long low tail on the right. The orange/hot bars mark the top 20% (the <code>cutoff = max(1, round(n × 0.2))</code> items).</li>
    <li><b>The rising cumulative curve.</b> The white line adds each bar to a running total, climbing from 0% up to 100% on the right axis. A steep early rise that quickly flattens is the visual signature of concentration.</li>
    <li><b>The dashed 80% line.</b> A horizontal reference at 80%. Trace up from the 20%-of-items mark to the curve: if it has already crossed the dashed line, the data is behaving like a tidy 80/20.</li>
  </ul>
  <div class="callout">
    A quick honesty note on the gallery: those real-world figures (Pareto's land, global wealth, US healthcare, Zipf words, music streaming, repeat offenders, city and country sizes) are <b>approximate and illustrative</b>. They are drawn from commonly cited reports and classic studies to show the characteristic <em>shape</em>, not to report exact statistics.
  </div>
</div>

<div class="lesson-block">
  <div class="callout key">
    <p><b>How this relates to 80/20</b></p>
    <p>This dashboard <em>is</em> the Pareto principle in its plainest form: across wildly different signals, a small fraction of the items tends to carry a large fraction of the weight. Its usefulness is practical — if you know the <b>vital few</b> account for most of the effect, you focus your effort there: fix the 20% of bugs causing 80% of crashes, serve the 20% of customers driving 80% of sales, learn the handful of words that fill most of the page. But notice the two boundaries this site keeps honest: the split is <em>measured</em>, not assumed, so it may be 90/10 or only 62/38 rather than a clean 80/20 — and the <b>long tail still matters</b>. The trivial many are not nothing; they are just easy to over-ignore. Not everything in life is Pareto-shaped, and the only way to know is to fix the 20% and measure what it actually covers.</p>
  </div>
</div>`,typing:`<div class="lesson-block">
<h3>⌨️ How it works</h3>
<p>This activity treats the 26 letters of the alphabet as your "items" and their frequency of use as the "value" each one contributes. It draws the same data two ways. The <b>QWERTY heat-map</b> tints each physical key by how often its letter appears — hotter colors for common letters, cooler colors for rare ones — and outlines the <b>vital-few</b> keys, the ones the site flags as the top 20%. The <b>sorted bar chart</b> lines all 26 letters up from most to least frequent, so the lopsided shape is impossible to miss.</p>
<p>You can feed it the standard <em>typical-English</em> frequency table (the constants below), or paste your own text and let the activity recount the letters from what you typed. Either way it asks the central Pareto question: do a small fraction of the letters account for most of the typing?</p>
</div>

<div class="lesson-block">
<h3>🔢 The math, step by step</h3>
<p>The code starts from a fixed table of English letter frequencies (percent of all letters):</p>
<div class="formula">
e 12.70 &nbsp; t 9.06 &nbsp; a 8.17 &nbsp; o 7.51 &nbsp; i 6.97 &nbsp; n 6.75 &nbsp; s 6.33 &nbsp; h 6.09 &nbsp; r 5.99 &nbsp; d 4.25<br>
l 4.03 &nbsp; c 2.78 &nbsp; u 2.76 &nbsp; m 2.41 &nbsp; w 2.36 &nbsp; f 2.23 &nbsp; g 2.02 &nbsp; y 1.97 &nbsp; p 1.93 &nbsp; b 1.49<br>
v 0.98 &nbsp; k 0.77 &nbsp; j 0.15 &nbsp; x 0.15 &nbsp; q 0.10 &nbsp; z 0.07
</div>
<ol class="steps">
<li>Sort all 26 letters from most to least frequent (the order shown above).</li>
<li>Decide how many letters make up the "top 20%." With <code>VITAL_FRACTION = 0.2</code>, that is <code>count = round(26 × 0.2) = round(5.2) = 5</code> letters.</li>
<li>Take the first 5 letters — <b>E, T, A, O, I</b> — and add up their frequencies to get the share this vital few actually covers.</li>
<li>Separately, walk down the sorted list adding frequencies one at a time until the running (cumulative) total first reaches 80%, and record how many letters that took.</li>
</ol>
<div class="formula">
top-5 share = 12.70 + 9.06 + 8.17 + 7.51 + 6.97 ≈ <b>44.4%</b>
</div>
</div>

<div class="lesson-block">
<h3>📊 What the numbers reveal</h3>
<p>The classic 80/20 promise is that the top 20% of items deliver about 80% of the value. Here the top 20% of letters (5 of them) deliver only about <b>44%</b> — useful, but far short of 80%. Going the other direction, you have to keep stacking letters well past the vital five before the cumulative share crosses the 80% line:</p>
<table class="mini-table">
<thead><tr><th>Top N letters</th><th>Cumulative share</th></tr></thead>
<tbody>
<tr><td>5 (E T A O I)</td><td>≈ 44.4%</td></tr>
<tr><td>9 (… through R)</td><td>≈ 69.6%</td></tr>
<tr><td>12 (… through C)</td><td>≈ 80.6%</td></tr>
</tbody>
</table>
<p>Reaching 80% takes roughly the <b>top 12 letters — about half the alphabet</b>. So the real split is closer to "50% of the letters give you 80%" than the storybook 80/20.</p>
</div>

<div class="lesson-block">
<h3>🤔 Why letters are a weak Pareto case</h3>
<p>Two things keep the distribution from concentrating sharply:</p>
<ul class="bullets">
<li><b>There are only 26 items.</b> Pareto effects look most dramatic when thousands or millions of items compete; with just 26, even the "top 20%" is a chunky five-letter slice, so it can never be tiny.</li>
<li><b>The tail isn't thin enough.</b> Truly rare letters (z, q, j, x) are rare, but the <em>middle</em> of the pack — d, l, c, u, m, w, f, g — still shows up constantly in ordinary words. No letter is negligible, so value stays spread out instead of piling onto a handful.</li>
</ul>
<p>This is the honest takeaway: letter frequencies are <em>concentrated</em> (E alone is ~180× more common than z), but not <em>80/20 concentrated</em>. The activity is most valuable as a counterexample — proof that "skewed" and "80/20" are not the same thing.</p>
</div>

<div class="lesson-block">
<h3>📚 Contrast: words concentrate far more</h3>
<p>If you counted <b>words</b> instead of letters, the picture changes dramatically. Word usage follows <em>Zipf's law</em>, where a few function words (the, of, and, to, a) dominate and the rest fall off steeply. A handful of the most common words can cover roughly half of all running text, and the top few percent of distinct words cover the overwhelming majority — a much closer match to the 80/20 ideal (these figures are illustrative of Zipf's shape, not exact constants from this activity). The lesson: the same language is a weak Pareto case at the letter level and a strong one at the word level. <em>What you choose to count</em> decides how lopsided the result looks.</p>
</div>

<div class="callout">
<p>Note on your own text: if you paste a sample, the share covered by E, T, A, O, I will wobble around 44% depending on your wording — a message full of <code>z</code>s and <code>q</code>s skews differently than a plain English paragraph. The shape of the bars stays recognizably the same because letter frequencies are remarkably stable across normal English.</p>
</div>

<div class="callout key">
<p><b>How this relates to 80/20</b> — The Pareto principle says the "vital few" should dominate, and this activity puts that to an honest test. The top 20% of letters (E, T, A, O, I) cover only ~44%, and it takes about 12 letters — roughly half the alphabet — to reach 80%. Letters are a real but <em>weak</em> Pareto case: concentrated, yet nowhere near a clean 80/20. That is exactly why the principle is a rule of thumb, not a law — the actual split depends on how many items you have and how thin the tail is.</p>
</div>`,words:`<div class="lesson-block">
<h3>📝 How it works</h3>
<p>This activity takes whatever text you type or paste (or the Dickens opening it loads as a sample) and asks a simple question: <em>do a small fraction of distinct words account for most of the text?</em> It splits your text into words, counts how often each distinct word appears, and ranks those words from most to least frequent.</p>
<p>The ranked bar list you see is that ranking made visible. Each row shows a word's <b>rank</b>, the word itself, a horizontal bar whose width is scaled relative to the #1 word, and the word's raw <b>count</b> plus its share of all tokens. The bars cascade downward in a smooth curve — a tall spike for the top one or two words, then a long, quickly-shrinking tail. That shape is the on-page <b>rank-versus-frequency</b> picture, and if you plotted the same numbers on <b>log–log axes</b> (the logarithm of frequency against the logarithm of rank) the curve would straighten into a near-straight downward line. That straight line is the signature of <b>Zipf's law</b>, and it is the whole reason words land so close to a clean 80/20.</p>
</div>

<div class="lesson-block">
<h3>🔤 The math, step by step</h3>
<p>The counting and the 80/20 test come from two pieces of real code: the tokenizer in <code>words.js</code> and the shared <code>Pareto.analyze</code> routine. Here is exactly what they do.</p>
<ol class="steps">
<li><b>Lowercase and tokenize.</b> The text is lowercased, then scanned with the regular expression <code>/[a-z']+/g</code>. This grabs every run of lowercase letters and apostrophes as one word, so <em>don't</em> and <em>o'clock</em> stay whole, while digits, punctuation, and spaces become separators. The result is a flat list of word <b>tokens</b> (every occurrence, repeats included).</li>
<li><b>Count distinct words.</b> A <code>Map</code> tallies occurrences: for each token <code>w</code>, its count goes up by one. This gives the number of times each <em>distinct</em> word appears.</li>
<li><b>Sort descending.</b> The distinct words are sorted by count, largest first, so rank 1 is the most frequent word.</li>
<li><b>Define the "top 20%."</b> Let <code>n</code> be the number of distinct words. The size of the vital few is <code>k = max(1, round(n × 0.2))</code> — literally 20% of the distinct words, rounded to a whole number, never less than one.</li>
<li><b>Measure the share they cover.</b> Sum the counts of those top <code>k</code> words (<code>topSum</code>), divide by the total number of tokens (<code>total</code>), and multiply by 100. That is <code>sharePct</code>, the headline percentage.</li>
<li><b>Find how far you must go for 80%.</b> Separately, walk down the ranking adding counts until the running total first reaches 80% of all tokens; the rank at which that happens is <code>need</code>.</li>
</ol>
<div class="formula">
k = max(1, round(n × 0.2))<br>
share% = ( Σ<sub>top&nbsp;k</sub> count &nbsp;÷&nbsp; total tokens ) × 100
</div>
<p>The two stat cards report <code>k</code> ("top 20% of unique words") and <code>share%</code> ("of all words written"). The verdict line adds <code>need</code> and the totals, e.g. <em>"…N words total, n unique."</em></p>
</div>

<div class="lesson-block">
<h3>🧮 A worked feel for the sample</h3>
<p>The built-in sample is the famous opening of <em>A Tale of Two Cities</em>. It is deliberately repetitive: <em>it</em>, <em>was</em>, <em>the</em>, and <em>of</em> recur over and over, while words like <em>incredulity</em> or <em>despair</em> appear once. So the distinct-word count <code>n</code> is modest, <code>k = round(n × 0.2)</code> is a handful of words, and those few words — the relentless <em>it / was / the / of</em> — soak up a large fraction of every token. That is why the top bars tower over the rest and the share leaps well past 75%. (The exact numbers depend on the text in the box, so type your own paragraph and watch <code>k</code> and <code>share%</code> recompute live.)</p>
</div>

<div class="lesson-block">
<h3>📐 Zipf's law: frequency ∝ 1 / rank</h3>
<p>Why does word frequency collapse so fast? Because natural language obeys <b>Zipf's law</b>: the <code>r</code>-th most common word appears about <code>1/r</code> as often as the most common one. The #2 word is roughly half as frequent as #1, #3 about a third, #4 a quarter, and so on.</p>
<div class="formula">
f(r) ∝ 1 / r<sup>a</sup> &nbsp;&nbsp;(for English, the exponent a ≈ 1)
</div>
<p>In large English corpora the single most common word, <em>the</em>, is about <b>7%</b> of all tokens; <em>of</em> about <b>3.5%</b>; <em>and</em> about <b>2.8%</b> — notice #2 is roughly half of #1 and #3 roughly a third — close to the <code>1/r</code> pattern. (These percentages are illustrative figures from standard corpus statistics, not computed from your text.) This table shows the bare <code>1/r</code> intuition:</p>
<table class="mini-table">
<thead><tr><th>Rank r</th><th>1 / r</th><th>Relative frequency</th></tr></thead>
<tbody>
<tr><td>1</td><td>1</td><td>100%</td></tr>
<tr><td>2</td><td>1/2</td><td>50%</td></tr>
<tr><td>3</td><td>1/3</td><td>33%</td></tr>
<tr><td>4</td><td>1/4</td><td>25%</td></tr>
<tr><td>5</td><td>1/5</td><td>20%</td></tr>
</tbody>
</table>
<p>The bar widths in the activity are scaled to the #1 word, so a perfectly Zipfian text would make rank 2's bar about half-width, rank 3's about a third, and so on — the visible cascade you get.</p>
</div>

<div class="lesson-block">
<h3>📈 Why the log–log plot is a straight line</h3>
<p>Take logarithms of <code>f(r) ∝ 1/r<sup>a</sup></code>. Logarithms turn a power law into a straight line:</p>
<div class="formula">
log f(r) = log f<sub>1</sub> − a · log r
</div>
<p>That is the equation of a line in <code>(log r, log f)</code> space with slope <b>−a</b> and intercept <code>log f₁</code>. This is precisely why, on log–log axes, the rank-versus-frequency points fall almost on a single straight line, and why a reference "ideal Zipf" line of slope −1 is overlaid for comparison: real English sits remarkably close to it. Two honest deviations are worth knowing:</p>
<ul class="bullets">
<li><b>Flattening at the very top.</b> The two or three most frequent words are often a touch <em>less</em> dominant than pure <code>1/r</code> predicts, bending the top of the line flat. The <b>Zipf–Mandelbrot</b> refinement, <code>f(r) ∝ 1/(r + b)<sup>a</sup></code>, adds a constant <code>b</code> that absorbs exactly this top-end flattening.</li>
<li><b>Drop-off in the tail.</b> Rare words that happen never to appear in your finite sample make the right end of the line plunge. That is a sampling artifact of short text, not a failure of the law — longer text fills the tail back in.</li>
</ul>
</div>

<div class="lesson-block">
<h3>🧠 Why language comes out Zipfian</h3>
<p>The mechanism is not mysterious. A tiny set of <b>function words</b> — <em>the, of, and, to, a, in, that, it…</em> — does the connective work of every sentence, so they recur constantly, while the vast majority of words (the <b>content words</b>) are specific and therefore rare. A handful of workhorses plus a huge crowd of one-offs is exactly a heavy-tailed distribution.</p>
<ul class="bullets">
<li><b>Zipf (1949), "principle of least effort."</b> Zipf argued the distribution balances two economies: the <em>speaker</em> prefers reusing a few easy words, while the <em>hearer</em> prefers many precise words to avoid ambiguity. The compromise between these pressures yields the <code>1/r</code> curve.</li>
<li><b>Mandelbrot</b> derived a closely related form from information-theoretic / cost-of-encoding arguments (the <code>+ b</code> correction above).</li>
<li><b>Simon's "rich-get-richer" model.</b> If new text reuses existing words in proportion to how common they already are (preferential attachment), the frequencies grow into a power law on their own — a generative reason the pattern keeps reappearing.</li>
</ul>
<p>These are genuine theories, not just descriptions: each one predicts the power-law shape rather than assuming it.</p>
</div>

<div class="lesson-block">
<h3>🔗 Zipf and Pareto are the same law, viewed two ways</h3>
<p>Zipf's law and Pareto's law describe one heavy-tailed reality from two angles. <b>Zipf</b> is the <em>rank–size</em> view: plot a word's size (frequency) against its rank. <b>Pareto</b> is the <em>tail</em> view: ask how many items exceed a given size. They are mathematically dual, and their exponents are reciprocals:</p>
<div class="formula">
Zipf exponent a &nbsp;↔&nbsp; Pareto tail index α &nbsp;&nbsp;with&nbsp;&nbsp; α = 1 / a
</div>
<p>English's Zipf exponent <code>a ≈ 1</code> therefore corresponds to a Pareto tail index <code>α ≈ 1</code> — and a Pareto distribution with an index near 1 is the classic, almost-textbook <b>80/20</b> world. So when this activity reports that a small slice of words covers most of the text, it is measuring the Pareto tail of the very same distribution the log–log line is drawing as a Zipf slope.</p>
</div>

<div class="lesson-block">
<h3>⚖️ The honest caveat</h3>
<p>The verdict in this activity uses a deliberate slack rule from the code: it declares "<em>≈ the 80/20 rule holds</em>" when <code>share% ≥ 75</code>, and otherwise calls the result "<em>concentrated, but short of a true 80/20 split</em>." Two things to keep in mind:</p>
<ul class="bullets">
<li><b>Short or repetitive text exaggerates concentration.</b> With few distinct words, <code>k = round(n × 0.2)</code> is tiny and a couple of repeated words can dominate, pushing <code>share%</code> very high. The Dickens sample is intentionally repetitive, so it overshoots.</li>
<li><b>Real corpora still land close to 80/20 for words.</b> Even on a full book or a balanced corpus — where the tail is rich and nothing is rigged — the top 20% of distinct words routinely cover roughly <b>80–90%</b> of all tokens. Words are the cleanest everyday example of the rule, far closer than the 26 letters of the alphabet, whose top 20% (just 5 letters) cover only about 44%.</li>
</ul>
</div>

<div class="callout key">
<p><b>How this relates to 80/20</b></p>
<p>Zipf's law (<code>frequency ∝ 1/rank</code>) and the Pareto principle are the same heavy tail seen from two sides, linked by <code>α = 1/a</code>. Because English sits at <code>a ≈ 1</code>, a small minority of words carries the overwhelming majority of the text — the activity fixes the cause side at the top 20% of distinct words and measures that they typically account for about 80–90% of everything written. That is the 80/20 rule, written in language itself.</p>
</div>`,monkeys:`<div class="lesson-block">
<h3>🐒 How it works</h3>
<p>This experiment is a thought experiment made real. Nobody types anything meaningful: the computer generates a long stream of <em>random</em> characters. At every position it flips a weighted coin — with probability <code>p</code> (the "Space chance" slider, default <b>0.18</b>) it emits a space, and otherwise it picks one of the <b>26</b> lowercase letters, each equally likely. The stream is then split on whitespace into "words", those random words are counted and ranked from most to least frequent, and the very same Pareto test used everywhere else on this site is applied to them.</p>
<p>The slider controls how often a space appears (from <code>0.05</code> to <code>0.40</code>), and a second slider sets the stream length (from <b>2,000</b> up to <b>200,000</b> characters, default 50,000). The startling result: even though every character is pure chance, the resulting list of "words" is sharply <b>concentrated</b> — a handful of short gibberish words appear constantly while a huge tail of longer ones appear once or twice. This is the famous <em>Miller's monkeys</em> result (G. A. Miller, 1957), also called <em>intermittent silence</em> or random typing.</p>
</div>

<div class="lesson-block">
<h3>🔢 The math, step by step</h3>
<p>Here is exactly what the code does, using the real constants from <code>monkeys.js</code> and the shared <code>Pareto.analyze</code>:</p>
<ol class="steps">
<li>Build a character array of length <code>len</code> (default 50,000). For each slot, draw a uniform random number; if it is below <code>pSpace</code> (default <b>0.18</b>) write a space, otherwise write <code>String.fromCharCode(97 + ((Math.random()×26)|0))</code> — i.e. one of the 26 letters <code>a</code>–<code>z</code>, each with probability <code>(1−p)/26</code>.</li>
<li>Join the characters into one big string and split on runs of whitespace: <code>text.split(/\\s+/).filter(Boolean)</code>. Each maximal run of letters between spaces is one "word".</li>
<li>Tally every distinct word into a count map, then sort the counts from largest to smallest.</li>
<li>Run <code>Pareto.analyze</code> on those counts: let <code>n</code> = number of <em>distinct</em> words and <code>total</code> = sum of all counts (the total word tokens). Set the vital-few size <code>k = max(1, round(n × 0.2))</code> — the top <b>20%</b> of distinct words.</li>
<li>Sum the counts of those top <code>k</code> words and report their share: <code>sharePct = (topSum ÷ total) × 100</code>. Separately, count how many top words (<code>need</code>) are required before the cumulative share first reaches 80%.</li>
</ol>
<div class="formula">
P(a specific word of length L) = <sup>(</sup>(1−p)⁄26<sup>)</sup><sup>L</sup> × p<br>
with p = 0.18 → each letter has probability (1−0.18)⁄26 = 0.82⁄26 ≈ 0.0315
</div>
<p>The trailing <code>× p</code> is the probability that the letter run is <em>ended</em> by a space; the <code>((1−p)/26)<sup>L</sup></code> is the probability of drawing those exact L letters in a row first.</p>
</div>

<div class="lesson-block">
<h3>⚙️ Why short words dominate</h3>
<p>Read the formula carefully. Because every non-space character is equally likely, <b>every specific word of a given length L has the exact same probability</b> — <code>aaa</code>, <code>xyz</code> and <code>the</code> are all equally probable three-letter words. And that probability shrinks <em>geometrically</em> with length: each extra letter multiplies the chance by the factor <code>(1−p)/26 ≈ 0.0315</code>. So a 2-letter word is about 32× rarer than a 1-letter word, a 3-letter word 32× rarer still, and so on.</p>
<ul class="bullets">
<li>Per-word probability falls off a cliff as words get longer.</li>
<li>So a few specific short words each grab a large slice of all the tokens, while any single long word is astronomically rare.</li>
<li>That alone guarantees a few very frequent "words" sitting far above the rest — concentration, before we even count distinct words.</li>
</ul>
</div>

<div class="lesson-block">
<h3>📈 Why the whole curve becomes Zipf-like</h3>
<p>There is a second force pulling the other way. While each <em>specific</em> word of length L gets exponentially rarer, the <b>number of distinct possible words</b> of length L is <code>26<sup>L</sup></code> — which grows exponentially too. There are 26 one-letter words, 676 two-letter words, 17,576 three-letter words, and so on.</p>
<p>The rank–frequency curve emerges from these two exponential forces fighting: probability per word falling by ≈0.0315 each step while the count of words rises by ×26 each step. Ranking all words by frequency and plotting count against rank produces a curve that is approximately a <b>power law</b> — the same straight-line-on-a-log-log-plot signature as Zipf's law for real language. None of it required meaning, grammar, or intent; it falls out of pure combinatorics.</p>
<table class="mini-table">
<thead><tr><th>Word length L</th><th>P(one specific word), p=0.18</th><th>Distinct words 26<sup>L</sup></th></tr></thead>
<tbody>
<tr><td>1</td><td>≈ 0.0315 × 0.18 ≈ 0.0057</td><td>26</td></tr>
<tr><td>2</td><td>≈ 0.0315<sup>2</sup> × 0.18 ≈ 0.00018</td><td>676</td></tr>
<tr><td>3</td><td>≈ 0.0315<sup>3</sup> × 0.18 ≈ 0.0000056</td><td>17,576</td></tr>
</tbody>
</table>
<p>The space probability <code>p</code> tunes the shape: a <em>higher</em> space chance ends words sooner, so short words dominate even more strongly; a <em>lower</em> space chance lets longer words appear, spreading the mass into a longer tail.</p>
</div>

<div class="lesson-block">
<h3>🎯 Does it hit a clean 80/20?</h3>
<p>Honest answer: not exactly, and the number you see will wobble each time you click "Generate". The code judges the result with <code>Pareto.verdict</code>, which only calls the rule "holds" when the top-20% share reaches <b>75%</b> or more (giving "roughly 80" some slack); below that it labels the result "concentrated, but short of a true 80/20 split." With random typing the top 20% of distinct words typically capture a very large share of all tokens — heavily concentrated — but the exact percentage depends on <code>p</code> and on how many distinct words turned up. It is the <em>shape</em> (a heavy, power-law-like tail), not a magic 80% target, that matters here.</p>
<div class="callout">
<p>Because <code>n</code> (distinct words) can be large, the top 20% is itself a big set, and short common words pile up enormous counts. That is why the share lands high — concentration is essentially baked in by the geometry, even though every keystroke was a coin flip.</p>
</div>
</div>

<div class="lesson-block">
<h3>⚠️ The real lesson</h3>
<p>This is the punchline Miller wanted: a Zipf- or Pareto-looking distribution does <b>not</b>, by itself, prove that anything meaningful, optimized, or "vital" is going on. Heavy-tailed concentration can be a pure statistical artifact of <em>how the items are formed</em> — here, the simple rule "keep adding random letters until a random space stops you." Seeing the 80/20 curve appear should make you ask <em>what mechanism</em> generated it, not assume the frequent items are special.</p>
</div>

<div class="callout key">
<p><b>How this relates to 80/20:</b> Random typing manufactures a Pareto-looking, heavily concentrated distribution out of nothing but chance. So the existence of an 80/20 pattern is necessary but never sufficient evidence that "the vital few" are genuinely important — concentration alone can be an accident of combinatorics. Trust the 80/20 shape only after you understand the process that produced it.</p>
</div>`,camera:`<div class="lesson-block">
<h3>📷 How it works</h3>
<p>This activity grabs a single frame from your webcam and asks a Pareto-style question of it: <em>do a small fraction of the colors account for most of the picture?</em> Everything happens locally in your browser — the frame is drawn to a hidden canvas, analyzed, and discarded; nothing is uploaded.</p>
<p>First it shrinks the frame to <code>SAMPLE_W = 200</code> pixels wide (the height is scaled to match the camera's aspect ratio) purely for speed. Then it walks over every pixel and lumps it into a coarse <b>color bucket</b>. Many slightly-different pixels — a thousand barely-distinct shades of "wall beige" — collapse into the same bucket. Finally it counts how many pixels landed in each bucket, ranks the buckets from most-populated to least, and measures what share of the image the busiest 20% of buckets cover. It re-runs this a few times per second so the numbers update live as you move.</p>
</div>

<div class="lesson-block">
<h3>🎨 The math, step by step</h3>
<p>The key trick is <b>quantization</b>: throwing away fine color precision so that "colors a human would call the same" merge into one bucket. Each pixel has three 8-bit channels (red, green, blue), each <code>0–255</code>. The code keeps only the top <code>BITS = 3</code> bits of each channel.</p>
<ol class="steps">
<li>Set <code>BITS = 3</code> and <code>SHIFT = 8 − BITS = 5</code>. Keeping 3 bits means each channel is rounded to one of <code>2<sup>3</sup> = 8</code> levels.</li>
<li>For a pixel, right-shift each channel by 5 bits: <code>r &gt;&gt; 5</code> turns a value <code>0–255</code> into a coarse level <code>0–7</code> (e.g. <code>200 &gt;&gt; 5 = 6</code>). Do the same for green and blue.</li>
<li>Pack the three small numbers into one integer <b>key</b> by sliding red into the high bits and green into the middle bits: <code>(r&gt;&gt;5)&lt;&lt;6 | (g&gt;&gt;5)&lt;&lt;3 | (b&gt;&gt;5)</code>.</li>
<li>That gives one of at most <code>8 × 8 × 8 = 512</code> possible buckets. Tally pixels per bucket in a map, then <b>sort buckets by count, descending</b>.</li>
<li>Let <code>distinct</code> = how many buckets actually appeared. Take the top <code>k = max(1, round(distinct × 0.2))</code> buckets — literally "the top 20% of the colors present."</li>
<li>Add up the pixels in those top-<code>k</code> buckets (<code>covered</code>) and divide by the total: <code>share% = (covered ÷ totalPixels) × 100</code>.</li>
<li>Separately, sweep down the ranked list adding counts until the running total first reaches 80% — recording <code>need</code>, the number of colors it actually takes to cover 80% of the image.</li>
</ol>
<div class="formula">
key = (r &gt;&gt; 5) &lt;&lt; 6 &nbsp;|&nbsp; (g &gt;&gt; 5) &lt;&lt; 3 &nbsp;|&nbsp; (b &gt;&gt; 5)<br>
buckets ≤ 8 × 8 × 8 = 512<br>
k = max(1, round(distinct × 0.2))<br>
share% = (Σ counts of top-k buckets ÷ total pixels) × 100
</div>
<p>The verdict line reports <code>k</code> of <code>distinct</code> buckets, the rounded <code>share%</code>, and <code>need</code> — for example, "the top 20% of colors (4 of 19 buckets) cover 86% of the image; reaching 80% takes the top 3 colors." (Those figures are illustrative; your scene decides the real ones.)</p>
</div>

<div class="lesson-block">
<h3>🧠 Why natural images concentrate</h3>
<p>Real-world frames are dominated by large, smooth regions — a wall, the sky, your skin, a shirt, the background. Across such a region the color barely changes, so thousands of pixels share the same coarse bucket. Meanwhile, crisp detail (edges, highlights, patterned objects, color fringes) produces a scattering of rare colors, each claiming only a handful of pixels. The result is a <b>heavy-tailed histogram</b>: a few towering buckets and a long tail of near-empty ones. When you rank by count and take the top slice, those few towers carry almost all the pixels.</p>
<ul class="bullets">
<li>Big flat areas → a few buckets with enormous counts (the "vital few").</li>
<li>Fine detail and gradients → many buckets with tiny counts (the "trivial many").</li>
<li>Ranking + cumulative sum exposes exactly how lopsided that split is.</li>
</ul>
</div>

<div class="lesson-block">
<h3>🔍 Why the coarse 3-bit grouping matters</h3>
<p>The choice of <code>BITS = 3</code> is deliberate. At full 8-bit precision, a smooth gradient on a wall would spread across hundreds of <em>technically</em> different RGB values, hiding the concentration. By keeping only 3 bits per channel, the code merges visually-similar shades into the same bucket, so the measurement is taken at the level of <b>"colors a person would call the same."</b> That is the honest level at which to ask the 80/20 question — we want concentration of <em>perceived</em> color, not an artifact of sensor noise. Coarser bits (fewer buckets) would force even more concentration; finer bits would scatter it. Three bits is a reasonable middle that matches human grouping.</p>
</div>

<div class="lesson-block">
<h3>⚖️ Does it truly hit 80/20?</h3>
<p>Not always — and the activity is honest about that. The verdict only declares the rule "holds" when <code>share% ≥ 75</code> (a small tolerance around 80). A plain scene with a big uniform background will sail past that; a busy, multicolored, well-lit scene may land in the 50–70% range — clearly <em>concentrated</em>, but short of a clean 80/20 split. The second number, <code>need</code>, tells the rest of the story: if 80% of pixels are covered by far fewer than 80% of the colors, the imbalance is real even when the exact "top-20%-covers-80%" framing doesn't line up perfectly. Pareto is a tendency in skewed data, not a law of nature pinned to the digits 80 and 20.</p>
</div>

<div class="lesson-block">
<h3>🖼️ Reading the palette</h3>
<p>The swatches show the colors of the top buckets (up to 12). Each swatch is reconstructed by undoing the quantization: take the bucket's stored level for each channel, shift it back up by 5 bits, and add a half-step offset (<code>1 &lt;&lt; (SHIFT−1) = 16</code>) so the swatch sits in the <em>middle</em> of that color band rather than at its dark edge. Those few squares are, quite literally, the handful of colors that make up most of what your camera sees.</p>
</div>

<div class="callout key">
<p><b>How this relates to 80/20</b> — Vilfredo Pareto noticed that a few causes drive most effects. Here the "causes" are color buckets and the "effect" is pixels covered. Because natural images pile most of their area into a few smooth regions, the top 20% of distinct colors typically covers around 80% of the picture — a Pareto distribution you can watch update in real time. It's the same heavy-tailed pattern behind "20% of customers, 80% of revenue," just rendered in light.</p>
</div>`,voice:`<div class="lesson-block">
<h3>🎤 How it works</h3>
<p>This activity listens to your microphone <em>live</em> and asks a simple question: do a small handful of frequencies carry almost all of the sound, or is the energy spread evenly across the whole spectrum? Everything happens inside your browser. Nothing is recorded or sent anywhere.</p>
<p>Under the hood it uses an <b>FFT</b> (Fast Fourier Transform), a standard tool that decomposes a sound wave into the individual frequencies it contains. The analyser is set to <code>fftSize = 4096</code>, which produces <code>frequencyBinCount = 2048</code> separate <b>frequency bins</b> — think of 2048 narrow "buckets," each covering a slice of pitch from low to high. The activity tracks how much energy lands in each bucket over the whole time you speak or play a note, then checks whether the loudest 20% of buckets account for roughly 80% of the total.</p>
</div>

<div class="lesson-block">
<h3>📐 The math, step by step</h3>
<p>The browser reports each bin's strength in <b>decibels (dB)</b>, which is a logarithmic scale. You cannot add decibels together to get total energy, so each value is first converted back to linear <b>power</b>, then accumulated and ranked.</p>
<ol class="steps">
<li>Every animation frame, read the magnitude <code>dB</code> for each of the 2048 bins.</li>
<li>Convert each bin's decibel reading to linear power with the formula below.</li>
<li><b>Accumulate</b> that power into a running per-bin total, so the measurement reflects the whole clip rather than a single instant.</li>
<li>Find the loudest bin's accumulated energy (the <em>peak</em>) and keep only the <b>active</b> bins — those whose energy exceeds <code>peak × 1e-4</code>. This noise floor discards near-silent buckets so they do not dilute the result.</li>
<li>Let <code>n</code> be the number of active bins. The "loudest 20%" is <code>k = max(1, round(n × 0.2))</code> bins (the <code>max(1, …)</code> guarantees at least one bin even when very few are active).</li>
<li>Sort the active bins by energy, sum the top <code>k</code>, and divide by the total active energy to get the share.</li>
</ol>
<div class="formula">
power = 10<sup>(dB ÷ 10)</sup>
</div>
<div class="formula">
share% = ( Σ energy<sub>top k bins</sub> ÷ Σ energy<sub>all active bins</sub> ) × 100<br>
k = max(1, round(n × 0.2))
</div>
<p>The activity also reports the reverse view: starting from the loudest bin and adding bins one by one, <em>how many</em> are needed before their cumulative energy reaches 80% of the total.</p>
</div>

<div class="lesson-block">
<h3>🔢 Why the decibel conversion matters</h3>
<p>Decibels are logarithmic: a value of −20 dB is not "twice as quiet" as −10 dB, it represents one-tenth the power. Summing dB numbers directly would be meaningless. Converting with <code>10<sup>(dB/10)</sup></code> puts every bin back into linear power units that can be honestly added.</p>
<p>This linear summing is the practical side of <em>Parseval's theorem</em>: the total energy of a signal equals the sum of the energy in all its frequency bins. Once everything is in linear units, the 2048 bin energies form a complete, additive "energy budget" — and the question becomes how lopsidedly that budget is divided.</p>
</div>

<div class="lesson-block">
<h3>🎵 Why sound concentrates spectrally</h3>
<p>Voiced speech (vowels) and sustained musical notes are <b>quasi-periodic</b> — the waveform nearly repeats itself many times per second. A repeating wave is, mathematically, built almost entirely from a <em>fundamental</em> frequency plus a few <b>harmonics</b> (integer multiples of it) and, for the voice, a handful of <b>formants</b> (resonances of your vocal tract). All the energy piles up into those few bins:</p>
<ul class="bullets">
<li>The fundamental: a single tall spike (e.g. ~110 Hz for a low male voice, ~220 Hz for a higher one — illustrative figures).</li>
<li>A short series of harmonics at 2×, 3×, 4× the fundamental.</li>
<li>A few formant peaks that give vowels their character.</li>
</ul>
<p>That leaves the vast majority of the 2048 bins nearly empty. So the active bins fall into a small group of "loud" ones and a long tail of "quiet" ones — exactly the lopsided shape the activity measures.</p>
</div>

<div class="lesson-block">
<h3>⚖️ Does it really hit a clean 80/20?</h3>
<p>Honestly: it depends entirely on the sound. The 80/20 split is a memorable benchmark, not a law of physics here.</p>
<table class="mini-table">
<thead><tr><th>Sound source</th><th>Spectral shape</th><th>Effect on the test</th></tr></thead>
<tbody>
<tr><td>Sung note / sustained vowel</td><td>Sharp peaks, few harmonics</td><td>Strongly concentrated — top 20% often well past 80%</td></tr>
<tr><td>Normal speech</td><td>Peaks plus consonant noise</td><td>Concentrated, near the 80/20 region</td></tr>
<tr><td>Hiss, applause, white noise</td><td>Broadband, energy spread everywhere</td><td>Weak — the top 20% may hold far less than 80%</td></tr>
</tbody>
</table>
<p>Broadband noise is the deliberate counterexample: when energy is smeared evenly across the spectrum, no small set of bins dominates, and the effect breaks down. The activity is showing a <em>tendency</em> toward concentration in structured, pitched sound — not a guaranteed 80/20 for every input.</p>
</div>

<div class="lesson-block">
<h3>🔍 Reading your result</h3>
<p>Watch the share% as you change what you do. Humming a steady note should drive it high (a few harmonic bins own most of the energy). Whispering or making a "shhh" sound should drop it (the energy fans out). The "bins needed to reach 80%" number is the same story told the other way: a small count means deep concentration, a large count means the spectrum is flat.</p>
</div>

<div class="callout key">
<p><b>How this relates to 80/20</b></p>
<p>The Pareto principle says a minority of causes drives a majority of effects. Here the "causes" are 2048 frequency bins and the "effect" is sound energy. Because pitched sound is built from a fundamental and a few harmonics, the loudest <b>20%</b> of active bins routinely carry on the order of <b>80%</b> of the energy — a live, audible Pareto distribution coming straight out of your own voice. And the honest caveat is pure Pareto too: the rule emerges from <em>structure</em> (periodicity), so featureless noise won't obey it.</p>
</div>`,mouse:`<div class="lesson-block">
<h3>🖱️ How it works</h3>
<p>The pad you just used is invisibly divided into a fine grid: <code>COLS = 48</code> columns by <code>ROWS = 24</code> rows, which is <b>48 × 24 = 1152</b> cells in total. Every cell holds a single number that starts at zero, stored in a flat array (<code>grid</code>).</p>
<p>As your cursor moves, the activity figures out which cell sits under the pointer and bumps that cell's number. There are two kinds of input, and they are <em>not</em> weighted equally:</p>
<ul class="bullets">
<li>A <b>move</b> (the <code>mousemove</code> event) adds <code>+1</code> to the cell you are currently over. This is <em>dwell</em> — the longer you linger somewhere, the more move-events fire there.</li>
<li>A <b>click</b> (the <code>click</code> event) adds <code>+25</code> to that cell. The comment in the code is blunt: <em>"clicks count more."</em> A single click is worth twenty-five units of dwell.</li>
</ul>
<p>The brighter (more orange) a square glows on the heat-map, the larger its accumulated value. After every single event, the activity re-draws the map and re-runs the Pareto analysis over the cells you have actually touched.</p>
</div>

<div class="lesson-block">
<h3>🔢 The math, step by step</h3>
<p>The measurement only ever looks at <b>visited cells</b> — cells whose value is greater than zero. The thousand-plus untouched cells are filtered out before any counting begins. Here is exactly what <code>Pareto.analyze</code> does with the grid:</p>
<ol class="steps">
<li><b>Keep only what was visited.</b> Filter the 1152-entry grid down to cells with <code>value &gt; 0</code>. Call that count <code>n</code> (the number of visited cells), then sort those values from largest to smallest.</li>
<li><b>Add up all the activity.</b> Sum every visited cell's value to get <code>total</code> (the grand total of dwell-units plus 25-per-click).</li>
<li><b>Define the "top 20%."</b> Compute <code>k = max(1, round(n × 0.2))</code> — one fifth of the <em>visited</em> cells, rounded, never fewer than 1.</li>
<li><b>Sum the heaviest k cells.</b> Because the list is sorted high-to-low, the first <code>k</code> entries are the busiest cells. Add them up to get <code>topSum</code>.</li>
<li><b>Compute the share.</b> <code>sharePct = (topSum ÷ total) × 100</code> — the percentage of all activity that those top cells absorbed.</li>
<li><b>Find the 80% point.</b> Walk down the sorted list accumulating a running total; the first position where the running total reaches <b>80%</b> of <code>total</code> is reported as <code>need</code> — how many cells it actually takes to cover 80%.</li>
</ol>
<div class="formula">
n = number of cells with value &gt; 0<br>
k = max(1, round(n × 0.2))<br>
share% = ( Σ<sub>i=1..k</sub> value<sub>i</sub> ) ÷ ( Σ<sub>all visited</sub> value ) × 100
</div>
<p>The on-screen verdict calls it a Pareto match when <code>sharePct ≥ 75</code> ("≈ the 80/20 rule holds"), and otherwise labels it "concentrated, but short of a true 80/20 split."</p>
</div>

<div class="lesson-block">
<h3>📈 Why mouse activity clumps in one corner</h3>
<p>Mouse motion is almost never uniform. You point at a few <b>targets</b> — a button, a link, the exact spot on the line you are reading — and you <em>dwell</em> there while you decide, read, or aim. Everything else is just transit: the cursor sweeps across the empty middle of the pad to get from one target to the next, depositing only a thin trail of <code>+1</code>s along the way.</p>
<p>The result is a <b>spatial heavy tail</b>. A handful of cells pile up enormous values because that is where your attention parked, while the cells you merely passed through stay dim. Clicks make the imbalance sharper still: every click drops <code>+25</code> onto an already-popular spot, so the favourite targets pull even further ahead of the crowd.</p>
<div class="callout">
<p>Think of it as the difference between <em>where your hand goes</em> and <em>where your hand stops</em>. Movement is spread out; stopping is concentrated. The grid measures both, but stopping (dwell + clicks) dominates the totals.</p>
</div>
</div>

<div class="lesson-block">
<h3>⚖️ It depends on how you behave</h3>
<p>This is an honest experiment: the outcome is driven by <em>your</em> habits during those few seconds, not by a law of nature. Two very different patterns produce very different numbers:</p>
<table class="mini-table">
<thead><tr><th>Behaviour</th><th>Effect on the grid</th><th>Effect on share%</th></tr></thead>
<tbody>
<tr><td>Purposeful pointing &amp; clicking on a few spots</td><td>A few cells get huge; the rest stay near zero</td><td>Pushes high — toward or past 80%</td></tr>
<tr><td>Aimless scribbling all over the pad</td><td>Activity smeared evenly across many cells</td><td>Pulls down — weakens the effect</td></tr>
</tbody>
</table>
<p>So whether the verdict reads "≈ the 80/20 rule holds" or "concentrated, but short of a true 80/20 split" is genuinely up to you. The mechanism reliably produces <em>concentration</em>; it does not guarantee the clean 80/20 figure every time.</p>
</div>

<div class="lesson-block">
<h3>⚠️ A subtlety about "the top 20%"</h3>
<p>The <code>n</code> in "top 20% of cells" is the number of <b>visited</b> cells, <em>not</em> all 1152. If you only ever touch, say, 60 cells, then <code>k = round(60 × 0.2) = 12</code>, and the share is measured among those 60 — the 1092 cells you never moved over simply do not exist for the calculation.</p>
<p>This matters because the empty pad is, in a sense, the <em>real</em> story: relative to the whole 1152-cell area, a tiny sliver did all the work. The activity deliberately reports the more conservative, harder-to-impress version — top 20% of cells you <em>actually used</em> — so the 80/20 claim has to earn its place rather than being inflated by counting dead space.</p>
</div>

<div class="callout key">
<p><b>How this relates to 80/20</b></p>
<p>The Pareto principle says a small share of causes produces a large share of effects. Here the "causes" are screen locations and the "effect" is your mouse activity. Because you hover and click on a few targets while merely passing over everything else, a small fraction of the cells soaks up the bulk of the weight — exactly the lopsided, heavy-tailed pattern the 80/20 rule describes. When your pointing is focused, the top fifth of visited cells can genuinely cross the 80% line; when it is scattered, it stays "concentrated but not quite 80/20." Same rule, same mechanism (concentration of attention), just dialed up or down by how you move.</p>
</div>`,wealth:`<div class="lesson-block">
<h3>💰 How it works</h3>
<p>This activity is a tiny economy. It creates <b>N = 500</b> agents, and gives every single one of them exactly <b>100 units</b> of wealth to start (<code>new Float64Array(N).fill(100)</code>). So at the beginning the economy is perfectly equal: nobody is rich, nobody is poor.</p>
<p>Then the agents trade. Over and over, two agents are picked at random and they make a small bet against each other. When you press <em>Start trading</em>, each animation frame quietly runs <b>3,000</b> of these trades, redraws the bar chart (richest agent on the left, in orange), and recomputes the headline number: the share of all wealth held by the richest 20% (the 100 wealthiest agents). The remarkable part is what that number does. Even though every bet is a <em>fair</em> coin flip — nobody has an edge — the richest 20% steadily drift from holding 20% of the wealth toward holding 80% and beyond.</p>
</div>

<div class="lesson-block">
<h3>🎲 The trade rule, step by step</h3>
<p>This is the "yard-sale" exchange. One transaction works exactly like this in the code:</p>
<ol class="steps">
<li>Pick a random agent <code>i</code> and a random agent <code>j</code> from the 500. If they happen to be the same agent, skip and try again.</li>
<li>Compute the <b>stake</b>: take the wealth of the <em>poorer</em> of the two players, <code>min(wealth[i], wealth[j])</code>, and risk <b>20%</b> of it. Both players put up the same amount, so the bet is symmetric.</li>
<li>Flip a fair coin: <code>Math.random() &lt; 0.5</code>. With probability exactly ½, agent <code>i</code> wins the stake from <code>j</code>; otherwise <code>j</code> wins it from <code>i</code>.</li>
<li>The winner's wealth goes up by the stake; the loser's goes down by the same stake. Total wealth in the system never changes — it just moves.</li>
</ol>
<div class="formula">
stake = 0.2 × min( wealth<sub>i</sub> , wealth<sub>j</sub> )<br>
winner += stake &nbsp;&nbsp; loser −= stake &nbsp;&nbsp; ( P(win) = ½ for each )
</div>
<p>Crucially, the bet is sized off the <em>poorer</em> player. If a beggar with 1 unit trades with a tycoon holding 10,000, the stake is only 0.2 × 1 = 0.2 units. The rich player can win small but can only ever lose a tiny sliver to the poor one — a built-in asymmetry we'll come back to.</p>
</div>

<div class="lesson-block">
<h3>📏 How the headline number is measured</h3>
<p>After each batch of trades the code calls <code>Pareto.analyze</code> on the array of 500 wealth values. That function does the honest Pareto test: it <em>fixes</em> the cause side at the top 20% and simply <em>measures</em> the effect.</p>
<ol class="steps">
<li>Sort all 500 wealth values from largest to smallest.</li>
<li>Take the top 20%: <code>k = round(500 × 0.2) = 100</code> richest agents.</li>
<li>Add up their wealth (<code>topSum</code>) and divide by the total wealth of everyone, then multiply by 100 to get a percentage — this is the <b>share</b> shown on the page.</li>
<li>For contrast the activity also sorts the other way and sums the poorest 250 agents (the bottom 50%) to show how little they hold.</li>
</ol>
<div class="formula">
share<sub>top 20%</sub> = ( Σ wealth of richest 100 ÷ Σ wealth of all 500 ) × 100%
</div>
<p>At the very start, all 500 agents hold 100 each, so the top 100 hold exactly 100 × 100 = 10,000 out of a total of 50,000 — a share of <b>20%</b>. Perfectly fair. The whole story is watching that 20% climb as trading proceeds.</p>
</div>

<div class="lesson-block">
<h3>🤔 Why fair trades still create the rich and the poor</h3>
<p>This is the counter-intuitive heart of the model. Each individual bet has <em>zero</em> expected gain — flip a fair coin and on average you neither win nor lose. So how does inequality appear out of nowhere? Two features of the rules conspire:</p>
<ul class="bullets">
<li><b>Losses are bounded, but the dynamics are multiplicative.</b> You can only ever stake a <em>fraction</em> of your wealth, so you never go to zero in one blow — but each win or loss scales with what you currently have. Wealth grows and shrinks by <em>percentages</em>, and percentage changes compound.</li>
<li><b>Down-moves and up-moves don't cancel.</b> Losing 20% and then gaining 20% does not bring you back: 100 → 80 → 96. Over many rounds this gap drags a typical agent's wealth <em>down</em>, even though the average across everyone stays fixed. The wealth that leaks away from the typical agent has to pile up somewhere — on the lucky few at the top.</li>
<li><b>An unlucky run is hard to undo.</b> Once an agent falls behind, its stakes shrink (they're based on its now-small wealth), so it can only claw back tiny amounts at a time. A rich agent, by contrast, risks little when trading with the poor and keeps compounding against other rich agents. The random walk has an absorbing pull toward concentration.</li>
</ul>
<p>The result is "wealth condensation": run it long enough with no redistribution and the wealth doesn't just concentrate in the top 20% — it tends toward a single agent owning almost everything. This is the <em>yard-sale model</em>, studied by Anirban Chakraborti, Bouchaud, Mézard and others.</p>
</div>

<div class="lesson-block">
<h3>🛟 Does it hit a clean 80/20 — and what the tax slider does</h3>
<p>Honestly, no — and that's the point. There's nothing magic about exactly 80/20 here. The top-20% share marches <em>past</em> 80% and keeps going toward near-total inequality. The page's verdict is deliberately lenient: it only declares "≈ the 80/20 rule" once the top share reaches <b>75%</b> (<code>holds = r.sharePct &gt;= 75</code>); below that it says the wealth is "and climbing…". So 80/20 is a milestone the system blows through, not a stable resting point.</p>
<p>The <b>redistribution</b> slider is the antidote. It acts like a flat tax, capped at a tiny <b>2%</b> (the slider runs <code>0..0.02</code>). Each round it skims fraction <code>tax</code> off everyone's wealth into a pot, then divides the pot <em>equally</em> among all 500:</p>
<div class="formula">
pot = Σ ( wealth<sub>k</sub> × tax ) &nbsp; → &nbsp; everyone += pot ÷ N
</div>
<p>This is the surprising lesson within the lesson: even a <em>fraction of one percent</em> of redistribution dramatically caps the top share and prevents total condensation. A small steady nudge toward the average is enough to counteract the relentless multiplicative pull, and the economy settles at a permanently unequal — but not catastrophic — spread.</p>
</div>

<div class="lesson-block">
<h3>📜 The distribution Pareto actually found</h3>
<p>This is not a metaphor for the 80/20 rule — it's the original. In <b>1896</b> the economist Vilfredo Pareto, studying land and income in Italy, noticed that roughly 80% of the wealth was held by about 20% of the people, and that the same lopsided pattern repeated across other countries and eras. That single empirical observation is the seed of everything we now call the Pareto principle.</p>
<table class="mini-table">
<thead><tr><th>Stage of the simulation</th><th>Top 20% share</th><th>Bottom 50% share</th></tr></thead>
<tbody>
<tr><td>Start (everyone equal)</td><td>20%</td><td>50%</td></tr>
<tr><td>After trading a while</td><td>~80%+</td><td>a few %</td></tr>
<tr><td>No redistribution, long run</td><td>→ ~100%</td><td>→ ~0%</td></tr>
</tbody>
</table>
<p><em>(The middle and bottom rows are illustrative of the trend, not fixed figures — exact numbers vary with the random seed and how long you let it run.)</em></p>
</div>

<div class="callout key">
<p><b>How this relates to 80/20:</b> Pareto's 80/20 rule was <em>born</em> from exactly this picture — a small slice of people owning most of the wealth. This activity shows that the imbalance doesn't require greed, talent, or cheating: even perfectly fair, zero-edge trades drive the richest 20% toward holding 80%+ of everything, simply because wealth compounds multiplicatively and luck never fully reverses. The 80/20 split isn't an endpoint the system targets — it's a milestone it sails through on the way to extreme concentration, unless a small dose of redistribution holds it back.</p>
</div>`,lorenz:`<div class="lesson-block">
<h3>📊 How it works</h3>
<p>This activity turns a single slider into a full portrait of inequality. The slider sets one number, <code>s</code>, the <em>inequality exponent</em>. From it we build a population of <b>N = 200</b> items and give the item at rank <code>r</code> a value of <code>1 / r<sup>s</sup></code> — the same Zipf-style law you met in the Zipf lesson. When <code>s = 0</code> every item is worth <code>1/r<sup>0</sup> = 1</code>, so everyone is exactly equal; as <code>s</code> grows, the first few ranks tower over the rest.</p>
<p>We then draw the <b>Lorenz curve</b>: line everyone up from poorest to richest along the horizontal axis (cumulative population, 0 to 100%) and plot how much of the total wealth they have accumulated on the vertical axis (cumulative share, 0 to 100%). The dashed diagonal is the <em>line of perfect equality</em> — if everyone owned the same amount, the bottom 40% would own exactly 40%, and the curve would <em>be</em> the diagonal. The more the real curve sags below it, the more concentrated the distribution. The activity reports two summary numbers: the <b>Gini coefficient</b> and the <b>top-20% share</b>.</p>
</div>

<div class="lesson-block">
<h3>🧮 The math, step by step</h3>
<p>Here is exactly what the code does each time you move the slider, using the real constants from <code>lorenz.js</code>:</p>
<ol class="steps">
<li>Read <code>s</code> from the slider (its range is <b>0 to 2</b>, default <b>1</b>) and build the 200 values <code>v<sub>r</sub> = 1 / r<sup>s</sup></code> for ranks <code>r = 1 … 200</code>.</li>
<li>Sort the values <b>ascending</b> (poorest first) and add them up to get the grand total.</li>
<li>Walk through the sorted list, keeping a running cumulative sum. After including the <code>i</code>-th person, plot the point <code>( i/N , cumulative / total )</code>. Starting from the origin <code>(0, 0)</code>, this traces the Lorenz curve.</li>
<li>Measure the <b>area under that curve</b> with the trapezoid rule — add up the little trapezoids between consecutive points.</li>
<li>Turn that area into the Gini coefficient, and read the top-20% share off the curve.</li>
</ol>
<div class="formula">
area = Σ <sup>over segments</sup> (x<sub>i</sub> − x<sub>i−1</sub>) × (y<sub>i</sub> + y<sub>i−1</sub>) ÷ 2<br>
<b>Gini</b> = 1 − 2 × area
</div>
<p>And the top-20% share is simply one minus whatever the bottom 80% hold. The code finds <code>L(0.8)</code> — the curve's height at the 80%-population mark — by linear interpolation, then:</p>
<div class="formula">
top 20% share = 1 − L(0.8)
</div>
</div>

<div class="lesson-block">
<h3>📐 The geometry: Gini is the size of the bow</h3>
<p>The shaded gap between the dashed diagonal and the orange Lorenz curve is not decoration — it <em>is</em> the Gini coefficient, geometrically. Call <code>A</code> the area of that gap and <code>B</code> the area under the curve. The whole triangle below the diagonal has area <code>A + B = ½</code>. Since Gini = 1 − 2B, a little algebra gives:</p>
<div class="formula">
Gini = (A) ÷ (A + B) = A ÷ ½ = 2A
</div>
<p>In words: <b>Gini is the gap area divided by the area of the entire equality triangle</b>. A flat diagonal (no gap) means Gini = 0; a curve hugging the bottom-right corner (one owner takes everything) means the gap fills the whole triangle and Gini → 1. The fatter the bow, the higher the Gini — they are literally the same fact measured two ways.</p>
</div>

<div class="lesson-block">
<h3>⚙️ Why the curve bows the way it does</h3>
<p>The bow is driven entirely by <code>s</code>. With <code>1/r<sup>s</sup></code>, doubling the rank divides the value by <code>2<sup>s</sup></code>, so a bigger <code>s</code> makes the head of the distribution fall off far faster and concentrates the total onto the first few ranks. Plugging the real formula into the code's own steps gives these exact outcomes:</p>
<table class="mini-table">
<thead><tr><th>slider s</th><th>Gini</th><th>top-20% share</th></tr></thead>
<tbody>
<tr><td>0.00</td><td>0.00</td><td>20%</td></tr>
<tr><td>0.50</td><td>0.30</td><td>42%</td></tr>
<tr><td>1.00 (default)</td><td>0.66</td><td>73%</td></tr>
<tr><td>1.30</td><td>0.83</td><td>87%</td></tr>
<tr><td>2.00</td><td>0.97</td><td>99%</td></tr>
</tbody>
</table>
<p>At <code>s = 0</code> the curve is exactly the diagonal: the bottom 20% own 20%, perfectly fair. By the default <code>s = 1</code> the top fifth already holds about <b>73%</b>, and a true 80/20 split (top 20% ≈ 80%) lands higher still, near <code>s ≈ 1.14</code> (Gini ≈ 0.75 in this model). These are <em>illustrative</em> figures from this specific 200-item Zipf model, not universal constants — but they show how smoothly one knob slides you from total equality to near-total concentration.</p>
</div>

<div class="lesson-block">
<h3>🎯 Does it hit a clean 80/20?</h3>
<p>Honest answer: only at one precise setting. "80/20" is a single point on a continuous dial. The activity flags the band <code>0.55 ≤ Gini ≤ 0.65</code> as "right around a true 80/20 world," because in the idealized continuous Pareto distribution a literal 80/20 split corresponds to <b>Gini ≈ 0.6</b> (this finite 200-point model runs a touch steeper, only reaching a true 80/20 nearer Gini ≈ 0.75). Below that the distribution is merely <em>somewhat</em> concentrated (think 60/30 or 70/30); above it, it is <em>more extreme</em> than 80/20 (such as 90/10). The 80/20 rule is best read as a memorable landmark on this spectrum, not a law the numbers magically snap to.</p>
<div class="callout">
<p>Notice that Gini, the size of the orange bow, and the top-20% share are three names for one underlying thing: <b>concentration</b>. Move the slider and all three respond together, because each is just a different lens on the same Lorenz curve.</p>
</div>
</div>

<div class="lesson-block">
<div class="callout key">
<p><b>How this relates to 80/20</b></p>
<p>The Pareto principle says a small slice of causes produces most of the effect — and the Lorenz curve makes that claim measurable. A literal 80/20 world (the top 20% holding 80%) is the point where the curve bows just enough to give a <b>Gini of about 0.6</b>. So "the 80/20 rule," "a fat Lorenz bow," "top-20% share ≈ 80%," and "Gini ≈ 0.6" are four ways of describing the <em>same</em> degree of concentration. Pareto isn't a separate rule — it's one named coordinate on the inequality dial this slider sweeps.</p>
</div>
</div>`},de=window.matchMedia("(prefers-reduced-motion: reduce)").matches,me=[{key:"typing",ico:"⌨️",name:"Typing",desc:"Top 20% of letters vs your keystrokes"},{key:"words",ico:"🔤",name:"Words · Zipf",desc:"The cleanest 80/20 — word frequency"},{key:"monkeys",ico:"🐒",name:"Monkeys",desc:"Zipf emerging from pure randomness"},{key:"camera",ico:"📷",name:"Camera",desc:"Do 20% of colors fill the frame?"},{key:"voice",ico:"🎤",name:"Voice",desc:"Where the sound energy hides"},{key:"mouse",ico:"🖱️",name:"Mouse",desc:"The few inches you actually use"},{key:"wealth",ico:"💰",name:"Wealth",desc:"Inequality from fair random trades"},{key:"lorenz",ico:"📈",name:"Lorenz & Gini",desc:"Put a number on concentration"}],fe={dashboard:"The Pareto Principle — field guide",typing:"Typing · The Pareto Principle",words:"Words & Zipf's law · The Pareto Principle",monkeys:"Monkeys · The Pareto Principle",camera:"Camera · The Pareto Principle",voice:"Voice · The Pareto Principle",mouse:"Mouse · The Pareto Principle",wealth:"Wealth · The Pareto Principle",lorenz:"Lorenz & Gini · The Pareto Principle"};document.querySelectorAll("[data-lesson]").forEach(e=>{const s=pe[e.dataset.lesson];s&&(e.innerHTML=s)});const ie=document.getElementById("launchGrid");ie&&me.forEach(e=>{const s=document.createElement("button");s.className="launch-tile",s.dataset.goto=e.key,s.innerHTML=`<span class="launch-ico" aria-hidden="true">${e.ico}</span><span class="lt-name">${e.name}</span><span class="lt-desc">${e.desc}</span>`,ie.appendChild(s)});const K=[...document.querySelectorAll(".view")],be=[...document.querySelectorAll(".nav-link")],ye=new Set(K.map(e=>e.dataset.view));function he(){const e=(location.hash||"").replace(/^#/,"");return ye.has(e)?e:"dashboard"}function oe(e){const s=K.find(a=>a.dataset.view===e)||K[0],i=s.dataset.view;K.forEach(a=>a.classList.toggle("active",a===s)),be.forEach(a=>{const l=a.dataset.view===i;a.classList.toggle("active",l),l?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current")}),document.title=fe[i]||"The Pareto Principle",window.scrollTo({top:0,behavior:"auto"}),ne(),window.dispatchEvent(new CustomEvent("view:change",{detail:i})),i==="dashboard"&&we()}document.addEventListener("click",e=>{const s=e.target.closest("[data-goto]");if(!s)return;e.preventDefault();const i=s.dataset.goto;location.hash.replace(/^#/,"")===i?oe(i):location.hash=i});window.addEventListener("hashchange",()=>oe(he()));const O=document.getElementById("menuBtn"),re=document.getElementById("scrim"),le=document.getElementById("sidebar");function ge(){document.body.classList.add("nav-open"),O&&O.setAttribute("aria-expanded","true");const e=le&&le.querySelector(".nav-link");e&&e.focus()}function ne(){document.body.classList.remove("nav-open"),O&&O.setAttribute("aria-expanded","false")}O&&O.addEventListener("click",ge);re&&re.addEventListener("click",ne);document.addEventListener("keydown",e=>{e.key==="Escape"&&document.body.classList.contains("nav-open")&&ne()});const _=document.getElementById("heroChart");let J=null;function we(){if(!_)return;const e=_.getContext("2d"),s=_.width,i=_.height,a=[40,22,13,8,6,4.2,3,2.1,1.3,.6],l=a.length,d=a.reduce((m,g)=>m+g,0),t=a[0],o=18,n=40,u=22,B=30,w=s-o-n,x=i-u-B,E=w/l,S=Math.max(1,Math.round(l*.2)),P=m=>1-Math.pow(1-m,3);if(J&&cancelAnimationFrame(J),de){p(1);return}const f=performance.now(),c=1100;function T(m){const g=P(Math.min(1,(m-f)/c));p(g),g<1&&(J=requestAnimationFrame(T))}J=requestAnimationFrame(T);function p(m){e.clearRect(0,0,s,i);const g=u+x-.8*x;e.strokeStyle="rgba(255,122,89,0.4)",e.setLineDash([5,4]),e.beginPath(),e.moveTo(o,g),e.lineTo(o+w,g),e.stroke(),e.setLineDash([]),e.fillStyle="rgba(255,122,89,0.6)",e.font="11px 'JetBrains Mono', monospace",e.textAlign="left",e.fillText("80%",o+w+4,g+4);for(let h=0;h<l;h++){const r=a[h]/t*x*m,L=o+h*E+1.5,v=E-3;if(h<S){const I=e.createLinearGradient(0,u+x-r,0,u+x);I.addColorStop(0,"#ffb454"),I.addColorStop(1,"#ff7a59"),e.fillStyle=I}else e.fillStyle="rgba(120,134,178,0.5)";ve(e,L,u+x-r,v,r,4),e.fill()}const k=[];let b=0;for(let h=0;h<l;h++)b+=a[h],k.push([o+h*E+E/2,u+x-b/d*x]);const y=Math.max(1,Math.floor(m*l+1e-4));e.strokeStyle="rgba(255,255,255,0.9)",e.lineWidth=2,e.beginPath();for(let h=0;h<y;h++){const[r,L]=k[h];h?e.lineTo(r,L):e.moveTo(r,L)}e.stroke(),e.fillStyle="#fff";for(let h=0;h<y;h++)e.beginPath(),e.arc(k[h][0],k[h][1],2.4,0,Math.PI*2),e.fill()}}function ve(e,s,i,a,l,d){d=Math.min(d,a/2,l),e.beginPath(),e.moveTo(s,i+l),e.lineTo(s,i+d),e.arcTo(s,i,s+d,i,d),e.lineTo(s+a-d,i),e.arcTo(s+a,i,s+a,i+d,d),e.lineTo(s+a,i+l),e.closePath()}function ke(e){de||e.forEach(s=>{const i=document.getElementById(s);if(!i)return;let a=i.textContent,l=0;new MutationObserver(()=>{if(i.textContent===a)return;a=i.textContent;const t=performance.now();t-l<220||(l=t,i.classList.remove("pulse"),i.offsetWidth,i.classList.add("pulse"))}).observe(i,{childList:!0,characterData:!0,subtree:!0})})}ke(["topShare","topLetters","wordShare","wordTop","monkeyShare","monkeyTop","lorenzGini","lorenzShare"]);oe(he());(function(){const e=document.getElementById("examplesGrid");if(!e)return;const s=[{title:"📜 Pareto's original observation",labels:["10%","20%","30%","40%","50%","60%","70%","80%","90%","100%"],values:[62,18,8,5,3,2,1,.6,.3,.1],blurb:"In 1896 Vilfredo Pareto found ~80% of Italy's land was owned by ~20% of the people — the observation that named the principle.",source:"Pareto, Cours d'économie politique (1896) · illustrative"},{title:"💰 Global wealth",labels:["10%","20%","30%","40%","50%","60%","70%","80%","90%","100%"],values:[76,11,6,3,1.6,1,.7,.4,.2,.1],blurb:"The richest 10% of adults hold roughly three-quarters of all household wealth worldwide.",source:"UBS/Credit Suisse Global Wealth Report (~2023), approx."},{title:"🏥 US healthcare spending",labels:["Top 1%","2–5%","6–10%","11–20%","21–50%","Bottom 50%"],values:[22,27,17,16,15,3],blurb:"The costliest 5% of patients account for about half of all health spending; the top 20% for roughly 80%.",source:"AHRQ / NIHCM, US, approx."},{title:"🔤 English word frequency (Zipf)",labels:["the","of","and","to","a","in","is","it","you","that"],values:[7,3.5,2.8,2.6,2.3,2.1,1.3,1.1,1,.9],blurb:"A few function words dominate everything we write — the ~100 commonest words make up about half of all text.",source:"Oxford English Corpus, approx."},{title:"💼 Sales by customer",labels:["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10"],values:[55,25,8,5,3,2,1,.6,.3,.1],blurb:"The classic management rule of thumb: ~80% of revenue tends to come from ~20% of customers (or products).",source:"Joseph Juran's '80/20 rule' · illustrative"},{title:"🐞 Software bugs",labels:["b1","b2","b3","b4","b5","b6","b7","b8","b9","b10"],values:[34,21,13,9,7,5,4,3,2,2],blurb:"Microsoft reported that fixing the 20% of bugs causing the most crashes removes about 80% of the related errors.",source:"Microsoft (~2002) · illustrative"},{title:"🎵 Music streaming",labels:["A1","A2","A3","A4","A5","A6","A7","A8","A9","A10"],values:[62,20,8,4,2,1.5,1,.8,.5,.2],blurb:"On streaming platforms a tiny fraction of artists capture the overwhelming majority of plays and royalties.",source:"Industry analyses · illustrative"},{title:"⚖️ Repeat offenders",labels:["G1","G2","G3","G4","G5","G6","G7","G8","G9","G10"],values:[50,18,10,7,5,4,3,2,.7,.3],blurb:"Criminology repeatedly finds a small group of offenders behind most crimes — e.g. ~6% of boys committed ~50% of offenses in Wolfgang's 1972 cohort.",source:"Wolfgang et al., Delinquency in a Birth Cohort (1972), approx."},{title:"🌆 World megacities (rank-size)",labels:["Tokyo","Delhi","Shang.","Dhaka","S.Paulo","Mexico","Cairo","Beijing","Mumbai","Osaka"],values:[37,33,29,23,22,22,22,21,21,19],blurb:"City sizes follow Zipf's law — a power-law cousin of 80/20. Across all cities the biggest few dominate global urban population.",source:"UN World Urbanization Prospects (2018), metro, approx."},{title:"🌍 Countries by population",labels:["India","China","USA","Indon.","Pak.","Nigeria","Brazil","B.desh","Russia","Mexico"],values:[1428,1426,340,277,240,224,216,173,144,128],blurb:"The ten most populous countries are home to well over half of humanity; the long tail of ~190 others holds the rest.",source:"UN, 2023, millions, approx."}];function i(a,l,d){const t=a.getContext("2d"),o=a.width,n=a.height;t.clearRect(0,0,o,n);const u=l.map((r,L)=>[r,d[L]]).sort((r,L)=>L[1]-r[1]),B=u.map(r=>r[0]),w=u.map(r=>r[1]),x=w.length,E=w.reduce((r,L)=>r+L,0)||1,S=w[0]||1,P=10,f=30,c=14,T=40,p=o-P-f,m=n-c-T,g=p/x,k=Math.max(1,Math.round(x*.2));for(let r=0;r<x;r++){const L=w[r]/S*m;t.fillStyle=r<k?"#ff7a59":"#2c3550",t.fillRect(P+r*g+1,c+m-L,g-2,L)}const b=c+m-.8*m;t.strokeStyle="rgba(255,122,89,0.45)",t.setLineDash([4,3]),t.beginPath(),t.moveTo(P,b),t.lineTo(P+p,b),t.stroke(),t.setLineDash([]),t.strokeStyle="rgba(255,255,255,0.85)",t.lineWidth=2,t.beginPath();let y=0;const h=[];for(let r=0;r<x;r++){y+=w[r];const L=P+r*g+g/2,v=c+m-y/E*m;h.push([L,v]),r?t.lineTo(L,v):t.moveTo(L,v)}t.stroke(),t.fillStyle="#fff",h.forEach(([r,L])=>{t.beginPath(),t.arc(r,L,1.8,0,Math.PI*2),t.fill()}),t.fillStyle="rgba(232,236,245,0.5)",t.font="9px system-ui, sans-serif",t.textAlign="left",[0,50,100].forEach(r=>{const L=c+m-r/100*m;t.fillText(r+"%",P+p+3,L+3)}),t.fillStyle="rgba(232,236,245,0.6)",t.textAlign="right";for(let r=0;r<x;r++){const L=P+r*g+g/2;t.save(),t.translate(L,c+m+6),t.rotate(-Math.PI/4),t.fillText(String(B[r]).slice(0,8),0,0),t.restore()}}s.forEach(a=>{const l=document.createElement("div");l.className="example-card";const d=document.createElement("h3");d.textContent=a.title;const t=document.createElement("canvas");t.width=320,t.height=200;const o=document.createElement("p");o.className="example-blurb",o.textContent=a.blurb;const n=document.createElement("p");n.className="example-source",n.textContent="Source: "+a.source,l.append(d,t,o,n),e.appendChild(l),i(t,a.labels,a.values)})})();const te={e:12.7,t:9.06,a:8.17,o:7.51,i:6.97,n:6.75,s:6.33,h:6.09,r:5.99,d:4.25,l:4.03,c:2.78,u:2.76,m:2.41,w:2.36,f:2.23,g:2.02,y:1.97,p:1.93,b:1.49,v:.98,k:.77,j:.15,x:.15,q:.1,z:.07},Te=[["q","w","e","r","t","y","u","i","o","p"],["a","s","d","f","g","h","j","k","l"],["z","x","c","v","b","n","m"]],xe=document.getElementById("keyboard"),ce=document.getElementById("chart"),Z=document.getElementById("typeBox"),Ee=document.getElementById("resetBtn"),N=document.getElementById("modeToggle"),V={},G={};function Y(e){return Object.keys(e).sort((s,i)=>e[i]-e[s])}const Se=.2;function Pe(e){const s=Object.values(e).reduce((o,n)=>o+n,0)||1,i=Y(e),a=Math.max(1,Math.round(i.length*Se)),l=i.slice(0,a),d=new Set(l),t=l.reduce((o,n)=>o+(e[n]||0),0);return{set:d,count:a,sharePct:t/s*100,total:s}}function Le(e,s){const i=Object.values(e).reduce((d,t)=>d+t,0)||1,a=Y(e);let l=0;for(let d=0;d<a.length;d++)if(l+=e[a[d]]||0,l/i*100>=s)return{count:d+1,sharePct:l/i*100};return{count:a.length,sharePct:100}}function Be(){Te.forEach(e=>{const s=document.createElement("div");s.className="kb-row",e.forEach(i=>{const a=document.createElement("div");a.className="key",a.dataset.letter=i,a.innerHTML=`${i.toUpperCase()}<span class="freq"></span>`,s.appendChild(a),V[i]=a}),xe.appendChild(s)})}function Me(e){const s=[44,53,80],i=[255,122,89],a=s.map((l,d)=>Math.round(l+(i[d]-l)*e));return`rgb(${a[0]}, ${a[1]}, ${a[2]})`}function Ce(){if(N.checked)return te;const e={};return Object.keys(te).forEach(s=>{e[s]=G[s]||0}),e}function Q(){const e=Ce(),s=Math.max(...Object.values(e),1e-4),{set:i,count:a,sharePct:l,total:d}=Pe(e),t=d>1||N.checked;Object.keys(V).forEach(o=>{const n=V[o],u=e[o]||0,B=u/s;n.style.background=Me(B),n.classList.toggle("vital",i.has(o)&&u>0);const w=n.querySelector(".freq");N.checked?w.textContent=u.toFixed(1):w.textContent=u>0?u:""}),document.getElementById("topLetters").textContent=t?a:"—",document.getElementById("topShare").textContent=t?Math.round(l)+"%":"—",Ie(e,i,a,l,t),Ae(e,i)}function Ie(e,s,i,a,l){const d=document.getElementById("verdict");if(!d)return;if(!l){d.textContent="Type something to test the 80/20 rule on your own text.";return}const t=[...s].filter(B=>(e[B]||0)>0).map(B=>B.toUpperCase()).join(", "),o=Le(e,80),u=a>=75?"≈ the 80/20 rule roughly holds.":"— short of a true 80/20 split.";d.innerHTML=`The top <b>20%</b> of letters (${t}) cover <b>${Math.round(a)}%</b> of keystrokes ${u} To actually reach 80% you'd need the top <b>${o.count}</b> letters (${Math.round(o.count/26*100)}% of the alphabet).`}function Ae(e,s){ce.innerHTML="";const i=Y(e).filter(d=>(e[d]||0)>0),a=i.length?i:Y(te),l=Math.max(...a.map(d=>e[d]||0),1e-4);a.forEach(d=>{const t=e[d]||0,o=document.createElement("div");o.className="bar-wrap";const n=document.createElement("div");n.className="bar"+(s.has(d)?" vital":""),n.style.height=`${Math.max(t/l*100,2)}%`,n.title=`${d.toUpperCase()}: ${t.toFixed(2)}`;const u=document.createElement("div");u.className="bar-label",u.textContent=d,o.appendChild(n),o.appendChild(u),ce.appendChild(o)})}Z.addEventListener("input",()=>{Object.keys(G).forEach(e=>delete G[e]);for(const e of Z.value.toLowerCase())e>="a"&&e<="z"&&(G[e]=(G[e]||0)+1);Z.value.trim().length>0&&N.checked&&(N.checked=!1),Q()});Z.addEventListener("keydown",e=>{const s=e.key.toLowerCase();if(V[s]){const i=V[s];i.classList.add("pressed"),setTimeout(()=>i.classList.remove("pressed"),120)}});Ee.addEventListener("click",()=>{Z.value="",Object.keys(G).forEach(e=>delete G[e]),N.checked=!0,Q()});N.addEventListener("change",Q);Be();Q();(function(){const e=document.getElementById("camVideo"),s=document.getElementById("camCanvas"),i=document.getElementById("camStart"),a=document.getElementById("camStop"),l=document.getElementById("camPalette"),d=document.getElementById("camTopColors"),t=document.getElementById("camShare"),o=document.getElementById("camVerdict"),n=3,u=8-n,B=200;let w=null,x=null,E=0;function S(b,y,h){return b>>u<<n*2|y>>u<<n|h>>u}function P(b){const y=1<<u-1,h=b>>n*2&(1<<n)-1,r=b>>n&(1<<n)-1,L=b&(1<<n)-1;return[(h<<u)+y,(r<<u)+y,(L<<u)+y]}async function f(){try{w=await navigator.mediaDevices.getUserMedia({video:!0,audio:!1})}catch(b){o.innerHTML=k(b);return}e.srcObject=w,i.disabled=!0,a.disabled=!1,T()}function c(){x&&cancelAnimationFrame(x),x=null,w&&w.getTracks().forEach(b=>b.stop()),w=null,e.srcObject=null,i.disabled=!1,a.disabled=!0}function T(){x=requestAnimationFrame(T);const b=performance.now();b-E<500||(E=b,p())}function p(){if(!e.videoWidth)return;const b=B,y=Math.round(e.videoHeight/e.videoWidth*b)||150;s.width=b,s.height=y;const h=s.getContext("2d",{willReadFrequently:!0});h.drawImage(e,0,0,b,y);const r=h.getImageData(0,0,b,y).data,L=new Map;for(let W=0;W<r.length;W+=4){const A=S(r[W],r[W+1],r[W+2]);L.set(A,(L.get(A)||0)+1)}const v=[...L.entries()].sort((W,A)=>A[1]-W[1]),I=v.length,M=b*y,F=Math.max(1,Math.round(I*.2)),q=v.slice(0,F),z=q.reduce((W,A)=>W+A[1],0)/M*100;let H=0,j=I;for(let W=0;W<v.length;W++)if(H+=v[W][1],H/M*100>=80){j=W+1;break}d.textContent=F,t.textContent=Math.round(z)+"%",m(q.slice(0,12)),g(z,F,I,j)}function m(b){for(;l.children.length<b.length;){const y=document.createElement("div");y.className="swatch",l.appendChild(y)}for(;l.children.length>b.length;)l.removeChild(l.lastChild);b.forEach((y,h)=>{const[r,L,v]=P(y[0]);l.children[h].style.background=`rgb(${r},${L},${v})`})}function g(b,y,h,r){const v=b>=75?"≈ the 80/20 rule holds for what you're seeing.":"— concentrated, but short of a true 80/20 split.";o.innerHTML=`The top <b>20%</b> of colors (${y} of ${h} distinct buckets) cover <b>${Math.round(b)}%</b> of the image ${v} Reaching 80% takes the top <b>${r}</b> colors (${Math.round(r/h*100)}% of them).`}function k(b){const y=location.protocol==="file:";let h=`Couldn't access the camera (${b&&b.name?b.name:"error"}).`;return y&&(h+=" Browsers block the camera on <code>file://</code> pages — run a local server (e.g. <code>python -m http.server</code>) and open <code>http://localhost:8000</code>."),h}i.addEventListener("click",f),a.addEventListener("click",c),window.addEventListener("pagehide",c),window.addEventListener("view:change",b=>{b.detail!=="camera"&&w&&c()})})();(function(){const e=document.getElementById("spectrum"),s=document.getElementById("micStart"),i=document.getElementById("micStop"),a=document.getElementById("micTopFreq"),l=document.getElementById("micShare"),d=document.getElementById("micVerdict"),t=document.getElementById("micRange"),o=document.getElementById("micRangeLabel"),n=e.getContext("2d");let u=4e3,B=null,w=null,x=null,E=null,S=null,P=null,f=null,c=44100,T=0;async function p(){try{x=await navigator.mediaDevices.getUserMedia({audio:!0,video:!1})}catch(v){d.innerHTML=L(v);return}B=new(window.AudioContext||window.webkitAudioContext),w=B.createAnalyser(),w.fftSize=4096,w.smoothingTimeConstant=0,c=B.sampleRate,E=B.createMediaStreamSource(x),E.connect(w),P=new Float32Array(w.frequencyBinCount),f=new Float64Array(w.frequencyBinCount),T=0,s.disabled=!0,i.disabled=!1,g()}function m(){S&&cancelAnimationFrame(S),S=null,E&&E.disconnect(),x&&x.getTracks().forEach(v=>v.stop()),B&&B.close(),B=w=E=x=null,s.disabled=!1,i.disabled=!0}function g(){S=requestAnimationFrame(g),w.getFloatFrequencyData(P);for(let I=0;I<P.length;I++){const M=P[I];M>-120&&(f[I]+=Math.pow(10,M/10))}y();const v=performance.now();v-T>=300&&(T=v,k())}function k(){const v=Math.max(...f);if(v<=0)return;const I=v*1e-4,M=[];let F=0;for(let A=0;A<f.length;A++)f[A]>I&&(M.push(f[A]),F+=f[A]);if(!M.length)return;M.sort((A,U)=>U-A);const q=M.length,C=Math.max(1,Math.round(q*.2));let z=0;for(let A=0;A<C;A++)z+=M[A];const H=z/F*100;let j=0,W=q;for(let A=0;A<q;A++)if(j+=M[A],j/F*100>=80){W=A+1;break}a.textContent=C,l.textContent=Math.round(H)+"%",b(H,C,q,W)}function b(v,I,M,F){const C=v>=75?"≈ the 80/20 rule holds for this sound.":"— concentrated, but short of a true 80/20 split.";d.innerHTML=`The loudest <b>20%</b> of frequencies (${I} of ${M} active bins) carry <b>${Math.round(v)}%</b> of the energy ${C} Reaching 80% takes the top <b>${F}</b> bins (${Math.round(F/M*100)}% of them).`}function y(){const v=e.width,I=e.height;n.clearRect(0,0,v,I);const M=48,F=14,q=14,C=30,z=v-M-F,H=I-q-C,j=Math.max(...f)||1,W=f.length,A=w?w.fftSize:4096,U=c/A,X=Math.max(16,Math.min(W,Math.round(u/U))),ee=X*U;n.font="10px 'JetBrains Mono', monospace",n.textAlign="right",[0,.25,.5,.75,1].forEach(R=>{const $=q+H-R*H;n.strokeStyle="rgba(255,255,255,0.07)",n.beginPath(),n.moveTo(M,$),n.lineTo(M+z,$),n.stroke(),n.fillStyle="rgba(154,164,198,0.7)",n.fillText(R.toFixed(2),M-6,$+3)});const ae=z/X;for(let R=0;R<X;R++){const $=Math.sqrt(f[R]/j),se=$*H;n.fillStyle=`rgba(255,122,89,${.32+$*.68})`,n.fillRect(M+R*ae,q+H-se,Math.max(ae-.5,1),se)}n.strokeStyle="rgba(255,255,255,0.2)",n.beginPath(),n.moveTo(M,q+H),n.lineTo(M+z,q+H),n.moveTo(M,q),n.lineTo(M,q+H),n.stroke(),n.fillStyle="rgba(154,164,198,0.85)",n.textAlign="center";const ue=h(ee);for(let R=0;R<=ee+1;R+=ue){const $=M+R/ee*z;n.strokeStyle="rgba(255,255,255,0.2)",n.beginPath(),n.moveTo($,q+H),n.lineTo($,q+H+4),n.stroke(),n.fillText(r(R),$,q+H+16)}n.fillStyle="rgba(154,164,198,0.65)",n.font="11px 'Inter', sans-serif",n.textAlign="right",n.fillText("frequency (Hz) →",M+z,q+H+27),n.save(),n.translate(13,q+H/2),n.rotate(-Math.PI/2),n.textAlign="center",n.fillText("relative energy",0,0),n.restore()}function h(v){const I=v/6,M=[200,500,1e3,2e3,2500,5e3,1e4];for(const F of M)if(F>=I)return F;return 1e4}function r(v){return v<1?"0":v>=1e3?(v/1e3).toFixed(v%1e3?1:0)+"k":String(Math.round(v))}function L(v){const I=location.protocol==="file:";let M=`Couldn't access the microphone (${v&&v.name?v.name:"error"}).`;return I&&(M+=" Browsers block the mic on <code>file://</code> pages — run a local server (e.g. <code>python -m http.server</code>) and open <code>http://localhost:8000</code>."),M}t.addEventListener("input",()=>{u=parseFloat(t.value)*1e3,o.textContent=parseFloat(t.value).toFixed(1)+" kHz",f&&y()}),s.addEventListener("click",p),i.addEventListener("click",m),window.addEventListener("pagehide",m),window.addEventListener("view:change",v=>{v.detail!=="voice"&&B&&m()})})();const D={analyze(e){const s=e.filter(u=>u>0).sort((u,B)=>B-u),i=s.length;if(!i)return{n:0,k:0,total:0,sharePct:0,need:0};const a=s.reduce((u,B)=>u+B,0)||1,l=Math.max(1,Math.round(i*.2));let d=0;for(let u=0;u<l;u++)d+=s[u];const t=d/a*100;let o=0,n=i;for(let u=0;u<i;u++)if(o+=s[u],o/a*100>=80){n=u+1;break}return{n:i,k:l,total:a,sharePct:t,need:n}},verdict(e,s){if(!e||!e.n)return"Not enough data yet.";const a=e.sharePct>=75?"≈ the 80/20 rule holds.":"— concentrated, but short of a true 80/20 split.";return`The top <b>20%</b> of ${s} (${e.k} of ${e.n}) account for <b>${Math.round(e.sharePct)}%</b> ${a} Reaching 80% takes the top <b>${e.need}</b> (${Math.round(e.need/e.n*100)}% of them).`}};(function(){const e=document.getElementById("wordInput"),s=document.getElementById("wordSample"),i=document.getElementById("wordTop"),a=document.getElementById("wordShare"),l=document.getElementById("wordList"),d=document.getElementById("wordVerdict"),t=document.getElementById("zipfPlot"),o=t?t.getContext("2d"):null,n="It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way.";function u(){const S=e.value.toLowerCase().match(/[a-z']+/g)||[];if(!S.length){i.textContent=a.textContent="—",l.innerHTML="",d.textContent="Type or paste some text to test it.",w([]);return}const P=new Map;for(const T of S)P.set(T,(P.get(T)||0)+1);const f=[...P.entries()].sort((T,p)=>p[1]-T[1]),c=D.analyze(f.map(T=>T[1]));i.textContent=c.k,a.textContent=Math.round(c.sharePct)+"%",d.innerHTML=D.verdict(c,"words")+` (${S.length} words total, ${c.n} unique.)`,B(f.slice(0,10),S.length,c.k),w(f.map(T=>T[1]))}function B(S,P,f){l.innerHTML="",S.forEach((c,T)=>{const p=document.createElement("div");p.className="word-row"+(T<f?" vital":"");const m=(c[1]/P*100).toFixed(1);p.innerHTML=`<span class="word-rank">${T+1}</span><span class="word-text">${c[0]}</span><span class="word-bar" style="width:${c[1]/S[0][1]*100}%"></span><span class="word-count">${c[1]} · ${m}%</span>`,l.appendChild(p)})}function w(S){if(!o)return;const P=t.width,f=t.height;o.clearRect(0,0,P,f);const c=56,T=18,p=18,m=42,g=P-c-T,k=f-p-m;if(o.strokeStyle="rgba(255,255,255,0.18)",o.lineWidth=1,o.strokeRect(c,p,g,k),!S.length){o.fillStyle="rgba(154,164,198,0.7)",o.font="14px 'Inter', sans-serif",o.textAlign="center",o.fillText("Type or load text to plot the rank–frequency curve.",c+g/2,p+k/2),x(P,f,c,p,g,k);return}const b=S.length,y=S[0],h=Math.log10(Math.max(b,1))||1,r=Math.log10(Math.max(y,1))||1,L=h,v=r,I=C=>c+C/L*g,M=C=>p+k-C/v*k;o.font="10px 'JetBrains Mono', monospace",o.fillStyle="rgba(154,164,198,0.65)",o.strokeStyle="rgba(255,255,255,0.06)",o.textAlign="center";for(let C=0;Math.pow(10,C)<=b*1.0000001;C++){const z=I(C);o.beginPath(),o.moveTo(z,p),o.lineTo(z,p+k),o.stroke(),o.fillText("10"+E(C),z,p+k+14)}o.textAlign="right";for(let C=0;Math.pow(10,C)<=y*1.0000001;C++){const z=M(C);o.beginPath(),o.moveTo(c,z),o.lineTo(c+g,z),o.stroke(),o.fillText("10"+E(C),c-6,z+3)}const F=b>=2&&y>=2;if(F){o.strokeStyle="rgba(139,123,255,0.85)",o.setLineDash([6,4]),o.lineWidth=2,o.beginPath(),o.moveTo(I(0),M(Math.min(v,r)));const C=Math.max(0,r-h);o.lineTo(I(h),M(C)),o.stroke(),o.setLineDash([])}else o.fillStyle="rgba(154,164,198,0.85)",o.font="12px 'Inter', sans-serif",o.textAlign="center",o.fillText("Add more varied text to reveal the 1/rank slope.",c+g/2,p+k/2);const q=Math.min(b,6e3);o.fillStyle="rgba(255,122,89,0.85)";for(let C=0;C<q;C++){const z=I(Math.log10(C+1)),H=M(Math.log10(S[C])),j=b>400?1.5:2.6;o.beginPath(),o.arc(z,H,j,0,Math.PI*2),o.fill()}o.textAlign="left",o.font="11px 'Inter', sans-serif",o.fillStyle="rgba(255,122,89,0.95)",o.fillText("● your words",c+10,p+16),F&&(o.fillStyle="rgba(139,123,255,0.95)",o.fillText("– – ideal 1/rank",c+10,p+32)),x(P,f,c,p,g,k)}function x(S,P,f,c,T,p){o.fillStyle="rgba(154,164,198,0.85)",o.font="11px 'Inter', sans-serif",o.textAlign="center",o.fillText("word rank (log scale) →",f+T/2,P-8),o.save(),o.translate(14,c+p/2),o.rotate(-Math.PI/2),o.fillText("frequency (log scale) →",0,0),o.restore()}function E(S){const P={0:"⁰",1:"¹",2:"²",3:"³",4:"⁴",5:"⁵",6:"⁶",7:"⁷",8:"⁸",9:"⁹"};return String(S).split("").map(f=>P[f]||f).join("")}e.addEventListener("input",u),s.addEventListener("click",()=>{e.value=n,u()}),e.value=n,u()})();(function(){const e=document.getElementById("monkeyGen"),s=document.getElementById("monkeyLen"),i=document.getElementById("monkeyLenLabel"),a=document.getElementById("monkeySpace"),l=document.getElementById("monkeySpaceLabel"),d=document.getElementById("monkeyPreview"),t=document.getElementById("monkeyList"),o=document.getElementById("monkeyTop"),n=document.getElementById("monkeyShare"),u=document.getElementById("monkeyVerdict");function B(){const x=parseInt(s.value,10),E=parseFloat(a.value),S=new Array(x);for(let m=0;m<x;m++)S[m]=Math.random()<E?" ":String.fromCharCode(97+(Math.random()*26|0));const P=S.join(""),f=P.split(/\s+/).filter(Boolean),c=new Map;for(const m of f)c.set(m,(c.get(m)||0)+1);const T=[...c.entries()].sort((m,g)=>g[1]-m[1]),p=D.analyze(T.map(m=>m[1]));o.textContent=p.k,n.textContent=Math.round(p.sharePct)+"%",u.innerHTML=D.verdict(p,'random "words"')+` (${f.length.toLocaleString()} words, ${p.n.toLocaleString()} unique — and nobody typed on purpose.)`,d.textContent=P.slice(0,260)+(P.length>260?"…":""),w(T.slice(0,10),f.length,p.k)}function w(x,E,S){t.innerHTML="";const P=x.length?x[0][1]:1;x.forEach((f,c)=>{const T=document.createElement("div");T.className="word-row"+(c<S?" vital":"");const p=(f[1]/E*100).toFixed(1);T.innerHTML=`<span class="word-rank">${c+1}</span><span class="word-text">${f[0]||"·"}</span><span class="word-bar" style="width:${f[1]/P*100}%"></span><span class="word-count">${f[1]} · ${p}%</span>`,t.appendChild(T)})}s.addEventListener("input",()=>{i.textContent=parseInt(s.value,10).toLocaleString()}),a.addEventListener("input",()=>{l.textContent=Math.round(parseFloat(a.value)*100)+"%"}),e.addEventListener("click",B),B()})();(function(){const e=document.getElementById("wealthCanvas"),s=document.getElementById("wealthToggle"),i=document.getElementById("wealthReset"),a=document.getElementById("wealthTax"),l=document.getElementById("wealthTaxLabel"),d=document.getElementById("wealthTop"),t=document.getElementById("wealthShare"),o=document.getElementById("wealthVerdict"),n=e.getContext("2d"),u=500,B=100;let w=new Float64Array(u).fill(B),x=!1,E=null;function S(){w=new Float64Array(u).fill(B),c(),f()}function P(m){const g=parseFloat(a.value);for(let k=0;k<m;k++){const b=Math.random()*u|0;let y=Math.random()*u|0;if(b===y)continue;const h=.2*Math.min(w[b],w[y]);Math.random()<.5?(w[b]+=h,w[y]-=h):(w[b]-=h,w[y]+=h)}if(g>0){let k=0;for(let y=0;y<u;y++){const h=w[y]*g;w[y]-=h,k+=h}const b=k/u;for(let y=0;y<u;y++)w[y]+=b}}function f(){const m=D.analyze(Array.from(w)),g=Array.from(w).sort((r,L)=>r-L),k=g.reduce((r,L)=>r+L,0)||1;let b=0;for(let r=0;r<u/2;r++)b+=g[r];const y=Math.round(b/k*100);d.textContent=m.k,t.textContent=Math.round(m.sharePct)+"%";const h=m.sharePct>=75;o.innerHTML=`The richest <b>20%</b> hold <b>${Math.round(m.sharePct)}%</b> of the wealth ${h?"≈ the 80/20 rule.":"and climbing…"} Meanwhile the poorest <b>50%</b> hold just <b>${y}%</b>.`}function c(){const m=e.width,g=e.height;n.clearRect(0,0,m,g);const k=Array.from(w).sort((r,L)=>L-r),b=k[0]||1,y=m/u,h=Math.round(u*.2);for(let r=0;r<u;r++){const L=k[r]/b*(g-4);n.fillStyle=r<h?"#ff7a59":"#2c3550",n.fillRect(r*y,g-L,Math.max(y-.3,1),L)}}function T(){E=requestAnimationFrame(T),P(3e3),c(),f()}function p(){x=!x,s.textContent=x?"Pause":"Start trading",x?T():E&&cancelAnimationFrame(E)}a.addEventListener("input",()=>{l.textContent=(parseFloat(a.value)*100).toFixed(1)+"%"}),s.addEventListener("click",p),i.addEventListener("click",()=>{x&&p(),S()}),window.addEventListener("view:change",m=>{m.detail!=="wealth"&&x&&p()}),S()})();(function(){const e=document.getElementById("lorenzCanvas"),s=document.getElementById("lorenzSlider"),i=document.getElementById("lorenzLabel"),a=document.getElementById("lorenzGini"),l=document.getElementById("lorenzShare"),d=document.getElementById("lorenzVerdict"),t=e.getContext("2d"),o=200,n=46,u=34,B=16,w=16;function x(p){return Array.from({length:o},(m,g)=>1/Math.pow(g+1,p))}function E(p){const m=[...p].sort((h,r)=>h-r),g=m.reduce((h,r)=>h+r,0)||1,k=[0],b=[0];let y=0;for(let h=0;h<o;h++)y+=m[h],k.push((h+1)/o),b.push(y/g);return{X:k,Y:b}}function S(p,m,g){for(let k=1;k<p.length;k++)if(p[k]>=g){const b=(g-p[k-1])/(p[k]-p[k-1]||1);return m[k-1]+b*(m[k]-m[k-1])}return 1}function P(){const p=parseFloat(s.value);i.textContent=p.toFixed(2);const m=x(p),{X:g,Y:k}=E(m);let b=0;for(let v=1;v<g.length;v++)b+=(g[v]-g[v-1])*(k[v]+k[v-1])/2;const y=1-2*b,r=(1-S(g,k,.8))*100;a.textContent=y.toFixed(2),l.textContent=Math.round(r)+"%";const L=y>=.55&&y<=.65;d.innerHTML=`The top <b>20%</b> hold <b>${Math.round(r)}%</b>, Gini <b>${y.toFixed(2)}</b> ${L?"≈ this is right around a true 80/20 world.":"."} Perfect equality is the diagonal (Gini 0); a literal 80/20 split sits near Gini 0.6.`,T(g,k,r)}function f(p){return n+p*(e.width-n-w)}function c(p){return e.height-u-p*(e.height-B-u)}function T(p,m,g){const k=e.width,b=e.height;t.clearRect(0,0,k,b),t.strokeStyle="rgba(255,255,255,0.25)",t.lineWidth=1,t.beginPath(),t.moveTo(f(0),c(0)),t.lineTo(f(1),c(0)),t.moveTo(f(0),c(0)),t.lineTo(f(0),c(1)),t.stroke(),t.beginPath(),t.moveTo(f(0),c(0)),t.lineTo(f(1),c(1));for(let h=p.length-1;h>=0;h--)t.lineTo(f(p[h]),c(m[h]));t.closePath(),t.fillStyle="rgba(255,122,89,0.15)",t.fill(),t.strokeStyle="rgba(255,255,255,0.4)",t.setLineDash([5,4]),t.beginPath(),t.moveTo(f(0),c(0)),t.lineTo(f(1),c(1)),t.stroke(),t.setLineDash([]),t.strokeStyle="#ff7a59",t.lineWidth=2.5,t.beginPath(),p.forEach((h,r)=>r?t.lineTo(f(h),c(m[r])):t.moveTo(f(h),c(m[r]))),t.stroke();const y=S(p,m,.8);t.strokeStyle="rgba(255,255,255,0.3)",t.setLineDash([3,3]),t.beginPath(),t.moveTo(f(.8),c(0)),t.lineTo(f(.8),c(y)),t.lineTo(f(0),c(y)),t.stroke(),t.setLineDash([]),t.fillStyle="rgba(232,236,245,0.7)",t.font="11px system-ui, sans-serif",t.textAlign="center",t.fillText("cumulative population →",(f(0)+f(1))/2,b-8),t.save(),t.translate(12,(c(0)+c(1))/2),t.rotate(-Math.PI/2),t.fillText("cumulative share →",0,0),t.restore(),t.textAlign="left",t.fillStyle="#ff7a59",t.fillText(`top 20% = ${Math.round(g)}%`,f(.45),c(.12))}s.addEventListener("input",P),P()})();(function(){const e=document.getElementById("mouseCanvas"),s=document.getElementById("mouseReset"),i=document.getElementById("mouseTop"),a=document.getElementById("mouseShare"),l=document.getElementById("mouseVerdict"),d=e.getContext("2d"),t=48,o=24;let n=new Float64Array(t*o);function u(E){const S=e.getBoundingClientRect(),P=(E.clientX-S.left)/S.width*t,f=(E.clientY-S.top)/S.height*o,c=Math.min(t-1,Math.max(0,P|0));return Math.min(o-1,Math.max(0,f|0))*t+c}function B(E,S){n[E]+=S,x(),w()}e.addEventListener("mousemove",E=>B(u(E),1)),e.addEventListener("click",E=>B(u(E),25));function w(){const E=D.analyze(Array.from(n));i.textContent=E.n?E.k:"—",a.textContent=E.n?Math.round(E.sharePct)+"%":"—",l.innerHTML=E.n?D.verdict(E,"visited cells"):"Move and click around inside the pad to build a heatmap."}function x(){const E=e.width,S=e.height,P=E/t,f=S/o;let c=0;for(let T=0;T<n.length;T++)n[T]>c&&(c=n[T]);c=c||1,d.fillStyle="#0c1020",d.fillRect(0,0,E,S);for(let T=0;T<o;T++)for(let p=0;p<t;p++){const m=n[T*t+p];if(!m)continue;const g=Math.sqrt(m/c);d.fillStyle=`rgba(255,122,89,${.12+g*.88})`,d.fillRect(p*P,T*f,P,f)}}s.addEventListener("click",()=>{n=new Float64Array(t*o),x(),w()}),x(),w()})();
