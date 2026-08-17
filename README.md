# ISSB Prep — Barishal Cadet College

Day-1 ISSB screening practice for BCC cadets and ex-cadets. Static site, no build step, no backend.
Everything runs in the browser; attempts are stored in `localStorage` only.

Live: https://issb-bcc.vercel.app

## What's in it

| Drill | Page | Notes |
|---|---|---|
| Intelligence Test | `day1/iq.html` | 24 batches × 100 questions, 5 per category, 30-minute standard timing, per-category breakdown, full answer key with explanations |
| Screening 2 — PPDT | `day1/ppdt.html` | 40 hazy pictures. 30s observe → 30s age/sex/mood → 30s action → 4 min story, auto-advancing |
| Word Association Test | `day1/wat.html` | 50 words per batch, English + Bangla, weighted to hard/negative words, model sentences for review |

The dashboard lays out the full Day-1 sequence — Intelligence Test, PPDT, Screening Result, TAT, WAT, SRT, SDT — with TAT, SRT and SDT greyed out, plus Day 2/3/4 as Coming Soon.

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

`assets/js/ppdt-scenes.js` draws all 40 scenes as inline SVG silhouettes and the page renders them
greyscale + blurred (haziness slider, 2–12 px). No external images: works offline, no copyright issues.

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
