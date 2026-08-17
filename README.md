# ISSB Prep — Barishal Cadet College

Day-1 ISSB screening practice for BCC cadets and ex-cadets. Static site, no build step, no backend.
Everything runs in the browser; attempts are stored in `localStorage` only.

Live: https://issb-bcc.vercel.app

## What's in it

| Drill | Page | Notes |
|---|---|---|
| Intelligence Test | `day1/iq.html` | 24 batches × 100 questions, 5 per category, 30-minute standard timing, per-category breakdown, full answer key with explanations |
| PPDT | `day1/ppdt.html` | 40 hazy pictures. 30s observe → 30s Spot Box → 30s Action Box → 4 min Story Box, then a 1-minute narration timer |
| TAT | `day1/tat.html` | 11 pictures + 1 blank slide. 30s look, 4 min write, auto-advancing; the whole set replays for review |
| WAT | `day1/wat.html` | Two sections per batch — 50 English then 50 Bangla. Focus mode shows only the clock, the word and a small Cancel. "Make sentences" reveals a short model per word |
| SRT | `day1/srt.html` | 60 situations in 30 minutes from a 117-situation bank, each with a model response shown afterwards |
| SDT | `day1/sdt.html` | Five views of the same person in 15 minutes, word counts, self-check list |
| Day 2 | `day2/index.html` | GD topic generator, PGT/HGT briefs, Extempore two-topic drill, PAT circuit timer, DP interview banks (5 sets) |
| Day 3 | `day3/index.html` | 8 Planning Exercise scenarios with a written-plan box, CAD themes, 6 Command Task briefs, Mutual Assessment sheet |
| Day 4 | `day4/index.html` | What the conference decides, final-interview drill, and a saved self-assessment sheet |

The dashboard lays out the full four-day programme. Every drill is live; only "Screening Result" stays as an information card, because it is a board event rather than something to practise.

Every segment asks for name, college and cadet number before it starts; the details are kept in `localStorage` on that device and pre-filled next time.

## IQ question bank

- `assets/js/iq-curated.js` — 325 hand-written verbal items. Situational and General items are kept there for the future SRT drill but are not drawn into IQ batches: the screening test is reasoning only.
- `assets/js/iq-gen.js` — 20 procedural generators (number/letter series, coding-decoding, blood relations,
  direction sense, ranking, calendar, clock, ages, work, speed, percentage, ratio, average, arithmetic).
  **Every generated answer is computed, never hand-typed**, so a key cannot be wrong.
- `buildBatch(n)` seeds a `mulberry32` RNG with the batch number, so **batch N is always the same
  100 questions for everyone** — two cadets can compare scores on the same batch.
- Every batch holds **exactly 5 questions from each of the 20 categories** (`PER_CAT` in `iq-gen.js`),
  so the mix never drifts between batches. Across the 24 batches that is 2,341 distinct questions.
- To add more batches, raise `BATCH_COUNT` in `assets/js/iq-gen.js`. Nothing else changes.

## PPDT pictures

`assets/js/ppdt-scenes.js` draws all 40 scenes as inline SVG line-art — tapered limb outlines, clothing,
hair and pencil hatching on a photocopied-paper ground. The page renders them greyscale + lightly blurred
(haziness slider 1–9 px, default 3). No external images: works offline, no copyright issues.

`tools/scenes.html` is a contact sheet of all 40 with a blur toggle, for checking readability.

## Self test

Open `tools/selftest.html`. It asserts, across all batches: exactly 100 questions, no duplicate question
text, 4 unique options, a valid answer index, batch determinism, word-bank integrity and that all 40
PPDT scenes parse as valid SVG. Run it before deploying.

## Local development

```bash
npx serve .
```

Then open `http://localhost:3000`.

## Deploy

```bash
vercel deploy --prod
```
