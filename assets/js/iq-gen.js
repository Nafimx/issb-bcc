/* iq-gen.js — procedural ISSB-style reasoning questions.
   Every generator COMPUTES its own answer, so a key can never be mistyped.
   Signature: fn(rng) -> {cat, q, options:[4], answerIndex, explain}
   Requires core.js (ISSB.mulberry32/randInt/pick/seededShuffle). */
(function (global) {
  "use strict";
  const { randInt, pick, seededShuffle, mulberry32 } = global.ISSB;

  const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const NAMES_M = ["Rafi", "Imran", "Tanvir", "Sabbir", "Nayeem", "Arif", "Shakib", "Fahim", "Jamil", "Rakib"];
  const NAMES_F = ["Nadia", "Sumaiya", "Farhana", "Rumana", "Tania", "Sadia", "Mitu", "Rima"];

  /* Build the multiple-choice frame: shuffle answer + distractors, report index.
     Distractors are filtered for duplicates and topped up if a clash removed one. */
  function mc(rng, cat, q, answer, distractors, explain) {
    const seen = new Set([String(answer)]);
    const opts = [];
    for (const d of distractors) {
      const k = String(d);
      if (seen.has(k) || d == null || (typeof d === "number" && !isFinite(d))) continue;
      seen.add(k);
      opts.push(d);
      if (opts.length === 3) break;
    }
    // top-up if distractors collided: bump the numeric part, keep any unit suffix
    const m = String(answer).match(/^(-?\d+(?:\.\d+)?)(.*)$/);
    let bump = 1;
    while (opts.length < 3 && bump < 60) {
      let cand;
      if (typeof answer === "number") cand = answer + bump * (bump % 2 ? 1 : -1);
      else if (m) cand = (Math.round((parseFloat(m[1]) + bump * (bump % 2 ? 1 : -1)) * 100) / 100) + m[2];
      else cand = String(answer) + " " + AZ[bump % 26];
      if (!seen.has(String(cand))) { seen.add(String(cand)); opts.push(cand); }
      bump++;
    }
    const all = seededShuffle([answer, ...opts], rng);
    return { cat, q, options: all.map(String), answerIndex: all.indexOf(answer), explain };
  }

  const near = (n, ...deltas) => deltas.map((d) => n + d);

  /* ---------------- 1. number series ---------------- */
  function numberSeries(rng) {
    const kind = randInt(rng, 1, 6);
    let terms = [], ans, why;
    if (kind === 1) {
      const a = randInt(rng, 3, 25), d = randInt(rng, 3, 12);
      for (let i = 0; i < 5; i++) terms.push(a + i * d);
      ans = a + 5 * d;
      why = "Arithmetic series, common difference " + d + ".";
    } else if (kind === 2) {
      const a = randInt(rng, 2, 6), r = randInt(rng, 2, 3);
      for (let i = 0; i < 5; i++) terms.push(a * Math.pow(r, i));
      ans = a * Math.pow(r, 5);
      why = "Each term is multiplied by " + r + ".";
    } else if (kind === 3) {
      const s = randInt(rng, 2, 8);
      for (let i = 0; i < 5; i++) terms.push((s + i) * (s + i));
      ans = (s + 5) * (s + 5);
      why = "Squares of consecutive numbers from " + s + ".";
    } else if (kind === 4) {
      const s = randInt(rng, 1, 5);
      for (let i = 0; i < 5; i++) terms.push(Math.pow(s + i, 3));
      ans = Math.pow(s + 5, 3);
      why = "Cubes of consecutive numbers from " + s + ".";
    } else if (kind === 5) {
      let a = randInt(rng, 2, 12), d = randInt(rng, 2, 6);
      const step = randInt(rng, 1, 4);
      terms.push(a);
      for (let i = 0; i < 4; i++) { a += d; d += step; terms.push(a); }
      ans = a + d;
      why = "Differences increase by " + step + " each time.";
    } else {
      let a = randInt(rng, 1, 6), b = randInt(rng, 2, 9);
      terms = [a, b];
      for (let i = 0; i < 3; i++) { const c = a + b; terms.push(c); a = b; b = c; }
      ans = terms[terms.length - 1] + terms[terms.length - 2];
      why = "Each term is the sum of the two before it.";
    }
    const step = Math.max(1, Math.round(Math.abs(ans - terms[terms.length - 1]) / 2)) || 2;
    return mc(rng, "Number Series",
      "Find the next number in the series: " + terms.join(", ") + ", ?",
      ans, near(ans, step, -step, 2 * step, -2 * step, 1, -1), why);
  }

  /* ---------------- 2. missing middle term ---------------- */
  function seriesMissing(rng) {
    const a = randInt(rng, 4, 20), d = randInt(rng, 3, 11);
    const t = [];
    for (let i = 0; i < 6; i++) t.push(a + i * d);
    const hole = randInt(rng, 2, 4);
    const ans = t[hole];
    const shown = t.map((v, i) => (i === hole ? "?" : v)).join(", ");
    return mc(rng, "Number Series", "Find the missing term: " + shown,
      ans, near(ans, d, -d, 1, -1, 2 * d), "Arithmetic series with common difference " + d + ".");
  }

  /* ---------------- 3. letter series ---------------- */
  function letterSeries(rng) {
    const step = pick(rng, [1, 2, 3, 4, 5]);
    const start = randInt(rng, 0, 25 - step * 5);
    const t = [];
    for (let i = 0; i < 5; i++) t.push(AZ[start + i * step]);
    const ansIdx = start + 5 * step;
    const ans = AZ[ansIdx];
    const ds = [AZ[(ansIdx + 1) % 26], AZ[(ansIdx + 25) % 26], AZ[(ansIdx + step) % 26], AZ[(ansIdx + 2) % 26]];
    return mc(rng, "Letter Series", "Which letter comes next? " + t.join(", ") + ", ?",
      ans, ds, "Each letter moves " + step + " place(s) forward in the alphabet.");
  }

  /* ---------------- 4. alphabet position ---------------- */
  function alphabetPosition(rng) {
    const from = randInt(rng, 4, 16);
    const shift = randInt(rng, 2, 8);
    const idx = from - 1 + shift;
    const ans = AZ[idx];
    return mc(rng, "Alphabet Test",
      "Which letter is " + shift + " places to the right of the " + from + "th letter from the left of the English alphabet?",
      ans, [AZ[idx + 1], AZ[idx - 1], AZ[idx + 2], AZ[Math.max(0, idx - 2)]],
      "The " + from + "th letter is " + AZ[from - 1] + "; " + shift + " places right gives " + ans + ".");
  }

  /* ---------------- 5. coding-decoding (shift cipher) ---------------- */
  function codingDecoding(rng) {
    const words = ["RIFLE", "CADET", "BRAVE", "DRILL", "HONOUR", "MARCH", "GUARD", "TRUST", "FIELD", "NOBLE", "SWORD", "ORDER"];
    let a = pick(rng, words), b = pick(rng, words);
    while (b === a) b = pick(rng, words);
    const shift = pick(rng, [1, 2, 3, 4, -1, -2, -3]);
    const code = (w) => [...w].map((c) => AZ[(AZ.indexOf(c) + shift + 26) % 26]).join("");
    const ans = code(b);
    const wrong = (k) => [...b].map((c) => AZ[(AZ.indexOf(c) + k + 26) % 26]).join("");
    return mc(rng, "Coding-Decoding",
      "In a certain code, " + a + " is written as " + code(a) + ". How is " + b + " written in that code?",
      ans, [wrong(shift + 1), wrong(shift - 1), wrong(-shift), [...ans].reverse().join("")],
      "Each letter moves " + Math.abs(shift) + " place(s) " + (shift > 0 ? "forward" : "backward") + ".");
  }

  /* ---------------- 6. number analogy ---------------- */
  function numberAnalogy(rng) {
    /* One worked pair cannot fix a rule — 4 : 16 is both 4×4 and 4², and the
       two readings give different answers. Two pairs are shown so exactly one
       rule survives, and multipliers that coincide with a term are rejected. */
    const kind = randInt(rng, 1, 4);
    let a, b, c, f, why;
    for (let guard = 0; guard < 300; guard++) {
      a = randInt(rng, 3, 14); b = randInt(rng, 3, 14); c = randInt(rng, 3, 14);
      if (a === b || b === c || a === c) continue;
      if (kind === 1) { f = (x) => x * x; why = "The second number is the square of the first."; }
      else if (kind === 2) { f = (x) => x * x * x; why = "The second number is the cube of the first."; }
      else if (kind === 3) {
        const m = randInt(rng, 3, 9);
        if (m === a || m === b) continue;
        f = (x) => x * m; why = "The second number is " + m + " times the first.";
      } else {
        const k = randInt(rng, 4, 15);
        if (k === a || k === b) continue;
        f = (x) => x + k; why = "The second number is the first plus " + k + ".";
      }
      break;
    }
    const ans = f(c);
    return mc(rng, "Number Analogy",
      a + " : " + f(a) + " :: " + b + " : " + f(b) + " :: " + c + " : ?",
      ans, near(ans, 1, -1, c, -c, 2), why);
  }

  /* ---------------- 7. odd one out (numbers) ---------------- */
  function oddOneOutNumber(rng) {
    const kind = randInt(rng, 1, 3);
    let set = [], ans, why;
    if (kind === 1) {
      const base = randInt(rng, 3, 9);
      set = [base, base + 1, base + 2, base + 3].map((n) => n * n);
      ans = set[randInt(rng, 0, 3)] + 1;
      set[set.indexOf(ans - 1)] = ans;
      why = "All the others are perfect squares.";
    } else if (kind === 2) {
      const m = randInt(rng, 4, 12);
      set = [2, 3, 4, 5].map((n) => n * m);
      ans = set[randInt(rng, 0, 3)] + 1;
      set[set.findIndex((v) => v === ans - 1)] = ans;
      why = "All the others are multiples of " + m + ".";
    } else {
      const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
      set = seededShuffle(primes, rng).slice(0, 3);
      ans = pick(rng, [21, 27, 33, 39, 49, 51, 57]);
      set.push(ans);
      set = seededShuffle(set, rng);
      why = "All the others are prime numbers; " + ans + " is composite.";
    }
    set = seededShuffle(set, rng);
    const others = set.filter((v) => v !== ans);
    return mc(rng, "Odd One Out", "Choose the odd one out: " + set.join(", "), ans, others, why);
  }

  /* ---------------- 8. blood relations ----------------
     Relation logic is fixed and verified; only the names vary. */
  function bloodRelation(rng) {
    const m = pick(rng, NAMES_M), f = pick(rng, NAMES_F);
    const T = [
      { q: "Pointing to a photograph, " + m + " said, \"He is the son of my father's only son.\" How is the boy related to " + m + "?",
        a: "His son", d: ["His brother", "His nephew", "His cousin"],
        e: "His father's only son is " + m + " himself, so the boy is his son." },
      { q: "Pointing to a lady, " + m + " said, \"She is the daughter of my grandfather's only child.\" How is the lady related to " + m + "?",
        a: "His sister", d: ["His aunt", "His cousin", "His niece"],
        e: "The grandfather's only child is " + m + "'s parent, so the lady is his sister." },
      { q: f + " said, \"This man is the brother of my mother's husband.\" How is the man related to " + f + "?",
        a: "Her uncle", d: ["Her father", "Her brother", "Her cousin"],
        e: "Her mother's husband is her father; his brother is her uncle." },
      { q: "If " + m + "'s mother is the only daughter of " + f + "'s mother, how is " + f + " related to " + m + "?",
        a: "His aunt", d: ["His mother", "His sister", "His grandmother"],
        e: f + " is the sister of " + m + "'s mother, so she is his aunt." },
      { q: "Pointing to a man, " + f + " said, \"His son is my son's uncle.\" How is the man related to " + f + "?",
        a: "Her father", d: ["Her brother", "Her uncle", "Her son"],
        e: "Her son's uncle is her brother, so the man is her father." },
      { q: m + " introduced a boy as the son of the only sister of his father. How is the boy related to " + m + "?",
        a: "His cousin", d: ["His brother", "His nephew", "His uncle"],
        e: "His father's sister is his aunt, so her son is his cousin." },
      { q: "If P is the brother of Q, Q is the sister of R, and R is the son of " + m + ", how is Q related to " + m + "?",
        a: "Daughter", d: ["Son", "Sister", "Niece"],
        e: "Q is female and a child of " + m + ", so Q is his daughter." },
    ];
    const t = pick(rng, T);
    return mc(rng, "Blood Relation", t.q, t.a, t.d, t.e);
  }

  /* ---------------- 9. direction sense ---------------- */
  function directionSense(rng) {
    if (rng() < 0.5) {
      // net displacement using a Pythagorean triple
      const [x, y, h] = pick(rng, [[3, 4, 5], [6, 8, 10], [9, 12, 15], [5, 12, 13], [8, 15, 17]]);
      const p = pick(rng, [[x, y, h], [y, x, h]]);
      const a = p[0], b = p[1], ans = p[2];
      return mc(rng, "Direction Sense",
        "A cadet walks " + a + " km towards the North, then turns right and walks " + b +
        " km. How far is he from his starting point?",
        ans + " km", [a + b + " km", Math.abs(a - b) + " km", ans + 2 + " km"],
        "The two legs are at right angles: √(" + a + "² + " + b + "²) = " + ans + " km.");
    }
    const dirs = ["North", "East", "South", "West"];
    const start = randInt(rng, 0, 3);
    const turns = randInt(rng, 2, 4);
    let cur = start, seq = [];
    for (let i = 0; i < turns; i++) {
      const r = rng() < 0.5;
      seq.push(r ? "right" : "left");
      cur = (cur + (r ? 1 : 3)) % 4;
    }
    const ans = dirs[cur];
    return mc(rng, "Direction Sense",
      "A cadet is facing " + dirs[start] + ". He turns " + seq.join(", then ") +
      ". Which direction is he facing now?",
      ans, dirs.filter((d) => d !== ans),
      "Each right turn is 90° clockwise and each left turn 90° anti-clockwise; he ends facing " + ans + ".");
  }

  /* ---------------- 10. ranking / ordering ---------------- */
  function ranking(rng) {
    const left = randInt(rng, 4, 14), right = randInt(rng, 4, 14);
    if (rng() < 0.5) {
      const total = left + right - 1;
      return mc(rng, "Ranking",
        "In a row of cadets, " + pick(rng, NAMES_M) + " is " + left + "th from the left end and " +
        right + "th from the right end. How many cadets are there in the row?",
        total, near(total, 1, -1, 2, -2), "Total = " + left + " + " + right + " − 1 = " + total + ".");
    }
    const total = left + right + randInt(rng, 2, 8);
    const ans = total - left + 1;
    return mc(rng, "Ranking",
      "In a row of " + total + " cadets, " + pick(rng, NAMES_M) + " is " + left +
      "th from the left end. What is his position from the right end?",
      ans, near(ans, 1, -1, 2, -2), "Position from right = " + total + " − " + left + " + 1 = " + ans + ".");
  }

  /* ---------------- 11. calendar ---------------- */
  function calendar(rng) {
    const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const y = randInt(rng, 1990, 2035), mo = randInt(rng, 0, 11), d = randInt(rng, 1, 28);
    const idx = new Date(Date.UTC(y, mo, d)).getUTCDay();
    const ans = DAY[idx];
    return mc(rng, "Calendar",
      "What day of the week was/is " + d + " " + MON[mo] + " " + y + "?",
      ans, [DAY[(idx + 1) % 7], DAY[(idx + 6) % 7], DAY[(idx + 3) % 7], DAY[(idx + 5) % 7]],
      d + " " + MON[mo] + " " + y + " falls on a " + ans + ".");
  }

  /* ---------------- 12. clock angle ---------------- */
  function clockAngle(rng) {
    const h = randInt(rng, 1, 12), m = pick(rng, [0, 10, 15, 20, 30, 40, 45, 50]);
    let ang = Math.abs(30 * (h % 12) - 5.5 * m);
    if (ang > 180) ang = 360 - ang;
    const r1 = (v) => (Math.round(v * 10) / 10) + "°";
    const ans = r1(ang);
    const ds = [ang + 15, ang + 30, Math.abs(ang - 15), ang + 45, Math.abs(ang - 30), ang + 7.5]
      .filter((v) => v >= 0 && v <= 180 && Math.abs(v - ang) > 0.01)
      .map(r1);
    return mc(rng, "Clock",
      "What is the angle between the hour hand and the minute hand at " + h + ":" + String(m).padStart(2, "0") + "?",
      ans, ds,
      "Angle = |30H − 5.5M| = " + ans + " (taking the smaller angle).");
  }

  /* ---------------- 13. ages ---------------- */
  function ages(rng) {
    const kind = randInt(rng, 1, 3);
    if (kind === 1) {
      const younger = randInt(rng, 8, 30), diff = randInt(rng, 3, 20);
      const sum = younger * 2 + diff;
      const ans = younger + diff;
      return mc(rng, "Ages",
        "A is " + diff + " years older than B. The sum of their ages is " + sum + " years. What is A's age?",
        ans, near(ans, 1, -1, diff, -diff), "B = (" + sum + " − " + diff + ")/2 = " + younger + ", so A = " + ans + ".");
    }
    if (kind === 2) {
      const son = randInt(rng, 6, 18), k = randInt(rng, 3, 5);
      const father = son * k;
      const y = randInt(rng, 4, 12);
      const ans = father + y;
      return mc(rng, "Ages",
        "A father is " + k + " times as old as his son, who is " + son + " years old. How old will the father be after " + y + " years?",
        ans, near(ans, y, -y, 1, -1), "Father now = " + son + " × " + k + " = " + father + "; after " + y + " years = " + ans + ".");
    }
    const now = randInt(rng, 20, 45), back = randInt(rng, 5, 15);
    const ans = now - back;
    return mc(rng, "Ages",
      "A cadet's uncle is " + now + " years old today. What was his age " + back + " years ago?",
      ans, near(ans, 1, -1, back, -back), now + " − " + back + " = " + ans + " years.");
  }

  /* ---------------- 14. work and time ---------------- */
  const WORK_PAIRS = [[12, 4, 3], [20, 5, 4], [6, 3, 2], [15, 10, 6], [12, 6, 4], [30, 20, 12],
    [10, 15, 6], [9, 18, 6], [24, 8, 6], [12, 24, 8], [21, 28, 12], [18, 9, 6], [16, 48, 12], [35, 14, 10], [45, 9, 7.5],
    [4, 12, 3], [4, 28, 3.5], [5, 20, 4], [5, 45, 4.5], [6, 12, 4], [6, 18, 4.5], [6, 30, 5], [6, 66, 5.5],
    [7, 42, 6], [8, 24, 6], [8, 56, 7], [9, 45, 7.5], [9, 72, 8], [10, 30, 7.5], [10, 40, 8], [12, 20, 7.5],
    [12, 36, 9], [12, 60, 10], [14, 35, 10], [14, 42, 10.5], [15, 30, 10], [15, 35, 10.5], [15, 60, 12], [15, 75, 12.5],
    [18, 36, 12], [18, 54, 13.5], [18, 63, 14], [20, 30, 12], [20, 60, 15], [20, 80, 16], [21, 42, 14], [21, 77, 16.5],
    [22, 66, 16.5], [24, 40, 15], [24, 48, 16], [24, 72, 18], [26, 78, 19.5], [27, 54, 18], [28, 70, 20], [30, 42, 17.5],
    [30, 45, 18], [30, 60, 20], [30, 70, 21], [33, 66, 22], [35, 63, 22.5],
    [7, 91, 6.5], [10, 90, 9], [12, 84, 10.5], [14, 84, 12], [18, 90, 15], [28, 84, 21],
    [30, 90, 22.5], [33, 88, 24], [36, 45, 20], [36, 60, 22.5], [36, 72, 24], [39, 78, 26],
    [40, 60, 24], [40, 88, 27.5], [42, 56, 24], [42, 84, 28], [44, 77, 28], [45, 90, 30],
    [48, 80, 30], [50, 75, 30]];
  function work(rng) {
    const [a, b, t] = pick(rng, WORK_PAIRS);
    const ans = t + " days";
    return mc(rng, "Work & Time",
      "A can finish a task in " + a + " days and B can finish the same task in " + b +
      " days. Working together, how long will they take?",
      ans, [(a + b) / 2 + " days", (t + 1) + " days", (t - 1) + " days", (a + b) + " days"],
      "Together = (" + a + "×" + b + ")/(" + a + "+" + b + ") = " + t + " days.");
  }

  /* ---------------- 15. speed, distance, time ---------------- */
  function speed(rng) {
    const s = randInt(rng, 20, 90), t = randInt(rng, 2, 9);
    const d = s * t;
    if (rng() < 0.5) {
      return mc(rng, "Speed & Distance",
        "A convoy travels at " + s + " km/h for " + t + " hours. What distance does it cover?",
        d + " km", [(d + s) + " km", (d - s) + " km", s + t + " km", (d / 2) + " km"],
        "Distance = speed × time = " + s + " × " + t + " = " + d + " km.");
    }
    return mc(rng, "Speed & Distance",
      "A cadet covers " + d + " km in " + t + " hours. What is his average speed?",
      s + " km/h", [(s + 5) + " km/h", (s - 5) + " km/h", (s + 10) + " km/h", (d / (t + 1)).toFixed(1) + " km/h"],
      "Speed = distance / time = " + d + " / " + t + " = " + s + " km/h.");
  }

  /* ---------------- 16. percentage ---------------- */
  function percentage(rng) {
    let p, base, ans;
    do {
      p = pick(rng, [5, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75]);
      base = pick(rng, [200, 240, 300, 400, 480, 500, 600, 800, 900, 1200, 1500, 2000]);
      ans = (base * p) / 100;
    } while (!Number.isInteger(ans));
    const ds = near(ans, 10, -10, Math.round(ans / 2), -Math.round(ans / 2), 5, -5);
    if (rng() < 0.5) {
      return mc(rng, "Percentage", "What is " + p + "% of " + base + "?",
        ans, ds, p + "% of " + base + " = " + ans + ".");
    }
    return mc(rng, "Percentage",
      "In a batch of " + base + " candidates, " + p + "% were recommended. How many were recommended?",
      ans, ds, p + "% of " + base + " = " + ans + ".");
  }

  /* ---------------- 17. ratio ---------------- */
  function ratio(rng) {
    const a = randInt(rng, 2, 7), b = randInt(rng, 2, 9);
    const unit = pick(rng, [30, 40, 50, 60, 80, 100, 120]);
    const total = (a + b) * unit;
    const bigger = Math.max(a, b) * unit;
    return mc(rng, "Ratio",
      "Tk " + total + " is divided between two cadets in the ratio " + a + " : " + b +
      ". What is the larger share?",
      bigger, near(bigger, unit, -unit, 2 * unit, total - bigger),
      "One part = " + total + " / " + (a + b) + " = " + unit + "; larger share = " + Math.max(a, b) + " × " + unit + " = " + bigger + ".");
  }

  /* ---------------- 18. averages ---------------- */
  function average(rng) {
    const n = randInt(rng, 4, 8), avg = randInt(rng, 20, 70);
    const total = n * avg;
    if (rng() < 0.5) {
      const extra = randInt(rng, 10, 90);
      const ans = Math.round(((total + extra) / (n + 1)) * 100) / 100;
      return mc(rng, "Average",
        "The average of " + n + " numbers is " + avg + ". If a number " + extra +
        " is included, what is the new average?",
        ans, near(ans, 1, -1, 2, -2), "New average = (" + total + " + " + extra + ") / " + (n + 1) + " = " + ans + ".");
    }
    return mc(rng, "Average",
      "The average marks of " + n + " cadets is " + avg + ". What is the total of their marks?",
      total, near(total, avg, -avg, n, -n), "Total = " + n + " × " + avg + " = " + total + ".");
  }

  /* ---------------- 19. arithmetic (BODMAS) ---------------- */
  function arithmetic(rng) {
    const a = randInt(rng, 2, 15), b = randInt(rng, 2, 12), c = randInt(rng, 2, 9), d = randInt(rng, 1, 20);
    const ans = a + b * c - d;
    return mc(rng, "Arithmetic",
      "Solve: " + a + " + " + b + " × " + c + " − " + d + " = ?",
      ans, near(ans, 1, -1, b, -b, (a + b) * c - d - ans),
      "Multiply first: " + b + " × " + c + " = " + b * c + ", then " + a + " + " + b * c + " − " + d + " = " + ans + ".");
  }

  /* ---------------- 20. counting / simple logic ---------------- */
  function counting(rng) {
    const per = randInt(rng, 3, 12), groups = randInt(rng, 4, 15);
    const ans = per * groups;
    return mc(rng, "Arithmetic",
      "Each section of a cadet company has " + per + " cadets. If there are " + groups +
      " sections, how many cadets are there in total?",
      ans, near(ans, per, -per, groups, -groups),
      per + " × " + groups + " = " + ans + ".");
  }

  /* ---------------------------------------------------------------------
     The 20 ISSB screening (OIR) categories. Every batch carries EXACTLY
     PER_CAT questions from each, so the mix never drifts between batches.
     `gen`     — generator functions used for this category
     `curated` — categories in iq-curated.js that feed this category
     Situational and General items stay in the curated file but are NOT drawn
     here: the board's screening test is reasoning only. They are kept for the
     SRT drill when Day-1 SRT is built.
     --------------------------------------------------------------------- */
  const CATEGORIES = [
    { name: "Number Series",         gen: [numberSeries, seriesMissing] },
    { name: "Letter Series",         gen: [letterSeries, alphabetPosition] },
    { name: "Coding-Decoding",       gen: [codingDecoding] },
    { name: "Number Analogy",        gen: [numberAnalogy] },
    { name: "Blood Relations",       gen: [bloodRelation] },
    { name: "Direction Sense",       gen: [directionSense] },
    { name: "Ranking & Order",       gen: [ranking] },
    { name: "Calendar & Clock",      gen: [calendar, clockAngle] },
    { name: "Age Problems",          gen: [ages] },
    { name: "Work & Time",           gen: [work] },
    { name: "Speed & Distance",      gen: [speed] },
    { name: "Percentage & Ratio",    gen: [percentage, ratio] },
    { name: "Average & Arithmetic",  gen: [average, arithmetic, counting] },
    { name: "Odd One Out",           gen: [oddOneOutNumber], curated: ["Odd One Out"], curatedShare: 1 },
    { name: "Verbal Analogy",        curated: ["Verbal Analogy"] },
    { name: "Synonyms",              curated: ["Synonyms"] },
    { name: "Antonyms",              curated: ["Antonyms"] },
    { name: "One Word Substitution", curated: ["One Word Substitution"] },
    { name: "Word Building",         curated: ["Word Building"] },
    { name: "Logical Deduction",     curated: ["Logical Deduction"] },
  ];

  /* The board's paper is about half non-verbal, so the batch is built to that
     shape: 20 verbal categories at 3 each (60) and 8 non-verbal categories
     totalling 40. Quotas are NOT split evenly — a few categories (Mirror
     Image, Counting Figures, Dice, Paper Folding) only have a small number of
     truly distinct questions they can construct, so they draw fewer per
     batch; the categories with large combinatorial space (Figure Series,
     Figure Analogy, Odd Figure Out, Number Matrix) make up the rest. This
     keeps cross-batch repeats rare without shrinking the overall test. */
  const NONVERBAL = [
    ["Figure Series", 7], ["Mirror Image", 3], ["Odd Figure Out", 6], ["Figure Analogy", 7],
    ["Counting Figures", 3], ["Dice", 3], ["Paper Folding", 4], ["Number Matrix", 7],
  ];
  NONVERBAL.forEach(([name, quota]) => CATEGORIES.push({ name: name, nonverbal: true, quota: quota }));

  const BATCH_COUNT = 24;   // raise to add more batches — nothing else changes
  const PER_CAT = 3;        // per verbal category
  const PER_NV = 5;         // per non-verbal category
  const BATCH_SIZE = 100;
  const quotaFor = (cat) => (cat.quota != null ? cat.quota : cat.nonverbal ? PER_NV : PER_CAT);

  function curatedPool(names) {
    const all = global.IQ_CURATED || [];
    return all.filter((c) => names.indexOf(c.c) > -1);
  }

  function fromCurated(item, cat, rng) {
    const all = seededShuffle(item.o, rng);
    return { cat, q: item.q, options: all.map(String), answerIndex: all.indexOf(item.o[0]), explain: item.e || "" };
  }

  /* Deterministic batch: batch N is always the same 100 questions,
     five from each of the 20 categories. */
  function buildBatch(n) {
    const rng = mulberry32(1000 + n * 7919);
    const out = [];
    const seen = new Set();
    // Many curated items share a stem ("Choose the odd one out:") and differ only
    // in their options, so identity is stem + options, not stem alone.
    const push = (q) => {
      if (!q) return false;
      const key = q.q + " ¦ " + [...q.options].sort().join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      out.push(q);
      return true;
    };

    CATEGORIES.forEach((cat) => {
      let taken = 0;
      const want = quotaFor(cat);

      if (cat.nonverbal) {
        const make = (global.IQ_NONVERBAL || {})[cat.name];
        let guard = 0;
        while (make && taken < want && guard < 400) {
          guard++;
          const q = make(rng);
          if (q && q.answerIndex >= 0 && push(q)) taken++;
        }
        return;
      }

      // curated share first (rotated by batch so batches don't repeat each other)
      if (cat.curated) {
        const pool = curatedPool(cat.curated);
        const share = cat.gen ? Math.min(cat.curatedShare || want, want) : want;
        if (pool.length) {
          const offset = (n * share) % pool.length;
          const rotated = pool.slice(offset).concat(pool.slice(0, offset));
          for (const item of rotated) {
            if (taken >= share) break;
            if (push(fromCurated(item, cat.name, rng))) taken++;
          }
        }
      }

      // generators make up the rest
      if (cat.gen) {
        let guard = 0;
        while (taken < want && guard < 400) {
          guard++;
          const q = pick(rng, cat.gen)(rng);
          q.cat = cat.name;
          if (push(q)) taken++;
        }
      }

      // last resort: a short curated pool that could not fill its quota
      if (taken < want && cat.curated) {
        const pool = curatedPool(cat.curated);
        for (const item of pool) {
          if (taken >= want) break;
          if (push(fromCurated(item, cat.name, rng))) taken++;
        }
      }
    });

    return seededShuffle(out, rng);
  }

  global.IQGen = { buildBatch, BATCH_COUNT, BATCH_SIZE, PER_CAT, PER_NV, quotaFor, CATEGORIES };
})(window);
