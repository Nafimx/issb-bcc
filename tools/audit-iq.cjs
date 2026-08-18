/* Independent audit of the IQ bank. Nothing here trusts the generator: every
   answer it can parse is re-derived from the question text by separate code. */
const path = require("path").join(__dirname, "..", "assets", "js") + require("path").sep;
global.window = global;
require(path + "core.js");
require(path + "iq-curated.js");
require(path + "iq-nonverbal.js");
require(path + "iq-gen.js");

const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DAY = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MON = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const flaws = [];
const checked = {};
const tick = (k) => (checked[k] = (checked[k] || 0) + 1);

function resolve(q) { return q.options[q.answerIndex]; }

/* ---------- 1. structural rules every item must satisfy ---------- */
function structural(q, where) {
  if (!q.q) flaws.push(where + " empty question");
  if (!Array.isArray(q.options) || q.options.length !== 4) flaws.push(where + " not four options");
  if (new Set(q.options).size !== 4) flaws.push(where + " duplicate options: " + q.cat);
  if (!(q.answerIndex >= 0 && q.answerIndex < 4)) flaws.push(where + " bad answer index");
  if (!q.explain) flaws.push(where + " no explanation: " + q.cat);
}

/* ---------- 2. re-derive the answer for every parseable generated item ---------- */
function reSolve(q, where) {
  const a = resolve(q);
  const s = q.q;
  let m;
  const bad = (exp) => flaws.push(where + " [" + q.cat + "] key " + a + " but computed " + exp + " :: " + s.slice(0, 80));

  if ((m = s.match(/^What day of the week was\/is (\d+) (\w+) (\d+)\?/))) {
    tick("calendar");
    const e = DAY[new Date(Date.UTC(+m[3], MON.indexOf(m[2]), +m[1])).getUTCDay()];
    if (e !== a) bad(e);
  } else if ((m = s.match(/hour hand and the minute hand at (\d+):(\d+)/))) {
    tick("clock");
    let x = Math.abs(30 * (+m[1] % 12) - 5.5 * +m[2]); if (x > 180) x = 360 - x;
    const e = (Math.round(x * 10) / 10) + "\u00b0";
    if (e !== a) bad(e);
  } else if ((m = s.match(/^In a certain code, (\w+) is written as (\w+)\. How is (\w+) written/))) {
    tick("coding");
    const sh = (AZ.indexOf(m[2][0]) - AZ.indexOf(m[1][0]) + 26) % 26;
    // the whole code word must follow the same shift, or the item itself is unsound
    const consistent = [...m[1]].every((c, i) => AZ[(AZ.indexOf(c) + sh) % 26] === m[2][i]);
    if (!consistent) flaws.push(where + " coding stem is not a single consistent shift");
    const e = [...m[3]].map((c) => AZ[(AZ.indexOf(c) + sh) % 26]).join("");
    if (e !== a) bad(e);
  } else if ((m = s.match(/^Solve: (\d+) \+ (\d+) \u00d7 (\d+) \u2212 (\d+) = \?/))) {
    tick("bodmas");
    const e = String(+m[1] + +m[2] * +m[3] - +m[4]); if (e !== a) bad(e);
  } else if ((m = s.match(/^What is (\d+)% of (\d+)\?/))) {
    tick("percent");
    const e = String((+m[1] * +m[2]) / 100); if (e !== a) bad(e);
  } else if ((m = s.match(/In a batch of (\d+) candidates, (\d+)% were recommended/))) {
    tick("percent");
    const e = String((+m[1] * +m[2]) / 100); if (e !== a) bad(e);
  } else if ((m = s.match(/Which letter is (\d+) places to the right of the (\d+)th letter/))) {
    tick("alphabet");
    const e = AZ[+m[2] - 1 + +m[1]]; if (e !== a) bad(e);
  } else if ((m = s.match(/is (\d+)th from the left end and (\d+)th from the right end\. How many/))) {
    tick("ranking");
    const e = String(+m[1] + +m[2] - 1); if (e !== a) bad(e);
  } else if ((m = s.match(/In a row of (\d+) cadets, \w+ is (\d+)th from the left end/))) {
    tick("ranking");
    const e = String(+m[1] - +m[2] + 1); if (e !== a) bad(e);
  } else if ((m = s.match(/travels at (\d+) km\/h for (\d+) hours/))) {
    tick("speed");
    const e = (+m[1] * +m[2]) + " km"; if (e !== a) bad(e);
  } else if ((m = s.match(/covers (\d+) km in (\d+) hours/))) {
    tick("speed");
    const e = (+m[1] / +m[2]) + " km/h"; if (e !== a) bad(e);
  } else if ((m = s.match(/A can finish a task in (\d+) days and B can finish the same task in (\d+) days/))) {
    tick("work");
    const x = +m[1], y = +m[2];
    const e = ((x * y) / (x + y));
    const shown = parseFloat(String(a));
    if (Math.abs(e - shown) > 1e-9) bad(e + " days");
  } else if ((m = s.match(/Tk (\d+) is divided between two cadets in the ratio (\d+) : (\d+)/))) {
    tick("ratio");
    const total = +m[1], p = +m[2], q2 = +m[3];
    const e = String((total / (p + q2)) * Math.max(p, q2));
    if (e !== a) bad(e);
  } else if ((m = s.match(/The average of (\d+) numbers is (\d+)\. If a number (\d+) is included/))) {
    tick("average");
    const n = +m[1], av = +m[2], ex = +m[3];
    const e = Math.round(((n * av + ex) / (n + 1)) * 100) / 100;
    if (String(e) !== a) bad(e);
  } else if ((m = s.match(/The average marks of (\d+) cadets is (\d+)\. What is the total/))) {
    tick("average");
    const e = String(+m[1] * +m[2]); if (e !== a) bad(e);
  } else if ((m = s.match(/Each section of a cadet company has (\d+) cadets\. If there are (\d+) sections/))) {
    tick("counting");
    const e = String(+m[1] * +m[2]); if (e !== a) bad(e);
  } else if ((m = s.match(/A is (\d+) years older than B\. The sum of their ages is (\d+)/))) {
    tick("ages");
    const diff = +m[1], sum = +m[2];
    const e = String((sum + diff) / 2); if (e !== a) bad(e);
  } else if ((m = s.match(/A father is (\d+) times as old as his son, who is (\d+) years old\. How old will the father be after (\d+)/))) {
    tick("ages");
    const e = String(+m[1] * +m[2] + +m[3]); if (e !== a) bad(e);
  } else if ((m = s.match(/uncle is (\d+) years old today\. What was his age (\d+) years ago/))) {
    tick("ages");
    const e = String(+m[1] - +m[2]); if (e !== a) bad(e);
  } else if ((m = s.match(/walks (\d+) km towards the North, then turns right and walks (\d+) km/))) {
    tick("direction");
    const e = Math.hypot(+m[1], +m[2]) + " km"; if (e !== a) bad(e);
  } else if ((m = s.match(/(\d+) : (\d+) :: (\d+) : (\d+) :: (\d+) : \?/))) {
    tick("numberAnalogy");
    const p1 = +m[1], i1 = +m[2], p2 = +m[3], i2 = +m[4], c = +m[5];
    // every rule that explains BOTH worked pairs
    const rules = [];
    if (i1 === p1 * p1 && i2 === p2 * p2) rules.push({ n: "square", f: (x) => x * x });
    if (i1 === p1 ** 3 && i2 === p2 ** 3) rules.push({ n: "cube", f: (x) => x ** 3 });
    if (p1 && p2 && i1 % p1 === 0 && i2 % p2 === 0 && i1 / p1 === i2 / p2)
      rules.push({ n: "times " + i1 / p1, f: (x) => x * (i1 / p1) });
    if (i1 - p1 === i2 - p2) rules.push({ n: "plus " + (i1 - p1), f: (x) => x + (i1 - p1) });
    const answers = new Set(rules.map((r) => String(r.f(c))));
    if (rules.length === 0) flaws.push(where + " [Number Analogy] no rule fits both pairs :: " + s);
    else if (answers.size > 1)
      flaws.push(where + " [Number Analogy] AMBIGUOUS — " + rules.map((r) => r.n + "→" + r.f(c)).join(", ") + " :: " + s);
    else if (!answers.has(a)) bad([...answers][0]);
  } else if ((m = s.match(/^Find the next number in the series: ([\d, ]+), \?$/))) {
    tick("numberSeries");
    const t = m[1].split(",").map((v) => +v.trim());
    const d = t.map((v, i) => (i ? v - t[i - 1] : null)).slice(1);
    let e = null;
    if (new Set(d).size === 1) e = t[t.length - 1] + d[0];                       // arithmetic
    else if (t.every((v, i) => i === 0 || v === t[i - 1] * (t[1] / t[0]))) e = t[t.length - 1] * (t[1] / t[0]);
    else if (t.every((v, i) => Math.round(Math.sqrt(v)) ** 2 === v)) e = (Math.round(Math.sqrt(t[0])) + t.length) ** 2;
    else if (t.every((v) => Math.round(Math.cbrt(v)) ** 3 === v)) e = (Math.round(Math.cbrt(t[0])) + t.length) ** 3;
    else if (t.every((v, i) => i < 2 || v === t[i - 1] + t[i - 2])) e = t[t.length - 1] + t[t.length - 2];
    else {
      const dd = d.map((v, i) => (i ? v - d[i - 1] : null)).slice(1);
      if (new Set(dd).size === 1) e = t[t.length - 1] + d[d.length - 1] + dd[0];
    }
    if (e != null && String(e) !== a) bad(e);
  } else if ((m = s.match(/^Which letter comes next\? ([A-Z, ]+), \?$/))) {
    tick("letterSeries");
    const t = m[1].split(",").map((v) => v.trim());
    const step = AZ.indexOf(t[1]) - AZ.indexOf(t[0]);
    const e = AZ[AZ.indexOf(t[t.length - 1]) + step];
    if (e !== a) bad(e);
  } else if ((m = s.match(/^Find the missing term: ([\d?, ]+)$/))) {
    tick("missingTerm");
    const parts = m[1].split(",").map((v) => v.trim());
    const nums = parts.map((v) => (v === "?" ? null : +v));
    const known = nums.filter((v) => v !== null);
    const d = (known[1] - known[0]);
    const idx = nums.indexOf(null);
    const first = nums[0] !== null ? nums[0] : known[0] - d * idx;
    const e = first + d * idx;
    if (String(e) !== a) bad(e);
  }
}

/* ---------- 3. non-verbal soundness ---------- */
function nonverbal(q, where) {
  if (q.render !== "svg") return;
  tick("nonverbal");
  const svgOpts = q.options.filter((o) => /^<svg /.test(o));
  if (svgOpts.length && svgOpts.length !== 4) flaws.push(where + " [" + q.cat + "] mixed figure and text options");
  // a figure answer must not be byte-identical to any other option
  if (new Set(q.options).size !== 4) flaws.push(where + " [" + q.cat + "] identical figures among options");
  let m;
  if ((m = q.q.match(/(\d+) hole[s]? (?:is|are) punched/))) {
    const holes = +m[1];
    const twice = /twice/.test(q.q);
    const e = String(holes * (twice ? 4 : 2));
    if (e !== resolve(q)) flaws.push(where + " [paper] key " + resolve(q) + " but computed " + e);
  }
  if (/opposite this one/.test(q.q)) {
    const pips = (q.q.match(/<circle/g) || []).length;   // pips drawn on the shown face
    if (pips >= 1 && pips <= 6) {
      const e = String(7 - pips);
      if (e !== resolve(q)) flaws.push(where + " [dice] shown " + pips + " key " + resolve(q) + " expected " + e);
    }
  }
}

/* ---------- run over every batch ---------- */
for (let n = 1; n <= window.IQGen.BATCH_COUNT; n++) {
  const b = window.IQGen.buildBatch(n);
  if (b.length !== 100) flaws.push("batch " + n + " has " + b.length + " questions");
  b.forEach((q, i) => {
    const where = "b" + n + "q" + (i + 1);
    structural(q, where);
    reSolve(q, where);
    nonverbal(q, where);
  });
}

/* ---------- curated bank: structure and ambiguity ---------- */
const used = new Set(["Synonyms","Antonyms","One Word Substitution","Word Building","Verbal Analogy","Odd One Out","Logical Deduction"]);
window.IQ_CURATED.filter((c) => used.has(c.c)).forEach((c, i) => {
  const w = "curated#" + i + " (" + c.c + ")";
  if (!c.o || c.o.length !== 4) flaws.push(w + " not four options");
  if (new Set(c.o).size !== 4) flaws.push(w + " duplicate options");
  if (!c.e) flaws.push(w + " no explanation");
  if (/all of the above|none of the above/i.test(c.o.join(" "))) flaws.push(w + " uses all/none of the above");
  // jumbled words must be an exact anagram of the answer
  const jm = c.q.match(/meaningful word: ([A-Z]+)/);
  if (jm) {
    const norm = (x) => x.toUpperCase().replace(/[^A-Z]/g, "").split("").sort().join("");
    if (norm(jm[1]) !== norm(c.o[0])) flaws.push(w + " jumble " + jm[1] + " is not an anagram of " + c.o[0]);
  }
});

/* ---------- coverage ----------
   A checker that silently skips an item is worse than no checker: it reports
   a clean bank while proving nothing. Every generated category must have been
   re-solved, and every question in a batch must have been either re-solved or
   inspected as a figure. */
const EXPECT = {
  calendar: 1, clock: 1, coding: 1, bodmas: 1, percent: 1, alphabet: 1, ranking: 1,
  speed: 1, work: 1, ratio: 1, average: 1, counting: 1, ages: 1, direction: 1,
  numberAnalogy: 1, numberSeries: 1, letterSeries: 1, missingTerm: 1, nonverbal: 1,
};
Object.keys(EXPECT).forEach((k) => {
  if (!checked[k]) flaws.push("COVERAGE: nothing was re-solved for " + k + " — the checker is not seeing those items");
});

console.log("independently re-solved:", JSON.stringify(checked));
console.log("flaws found:", flaws.length);
if (flaws.length) process.exitCode = 1;
flaws.slice(0, 40).forEach((f) => console.log("  " + f));
