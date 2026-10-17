// Pure logic: turn two photo-pairs (before / after) into an honest per-concern verdict.
// Idea: two back-to-back photos of the same face on the same day measure the API's own
// "retake noise". A change only counts if it clearly exceeds that noise.

export const CONCERNS = {
  acne: 'Acne', redness: 'Redness', oiliness: 'Oiliness', moisture: 'Moisture',
  pore: 'Pores', texture: 'Texture', wrinkle: 'Wrinkles', age_spot: 'Dark spots',
  radiance: 'Radiance', dark_circle_v2: 'Dark circles', eye_bag: 'Eye bags', firmness: 'Firmness',
};
export const ACTIONS = Object.keys(CONCERNS);

const NOISE_FLOOR = 2.0;   // score points; never trust a gap smaller than this
const K = 2.0;             // change must exceed K x noise

const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;

/** results: [{type, raw_score}] from one analysis -> {type: raw_score} */
export function toMap(output) {
  const m = {};
  for (const o of output || []) if (o && typeof o.raw_score === 'number') m[o.type] = o.raw_score;
  return m;
}

/**
 * before, after: arrays of 2 score-maps (two retakes each).
 * Returns rows sorted by |delta| with verdict: improved | worse | no_clear_change | unreliable
 */
export function judge(before, after) {
  const rows = [];
  for (const type of ACTIONS) {
    const b = before.map((m) => m[type]).filter((x) => typeof x === 'number');
    const a = after.map((m) => m[type]).filter((x) => typeof x === 'number');
    if (b.length < 2 || a.length < 2) continue;
    const noise = Math.max(NOISE_FLOOR, Math.abs(b[0] - b[1]), Math.abs(a[0] - a[1]));
    const delta = mean(a) - mean(b);                       // higher score = healthier
    const needed = K * noise;
    let verdict = 'no_clear_change';
    // retakes disagree wildly -> don't pretend to know
    if (noise > 12) verdict = 'unreliable';
    else if (delta >= needed) verdict = 'improved';
    else if (delta <= -needed) verdict = 'worse';
    rows.push({ type, label: CONCERNS[type], before: round(mean(b)), after: round(mean(a)),
      delta: round(delta), noise: round(noise), needed: round(needed), verdict });
  }
  rows.sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta));
  return rows;
}

export function summarize(rows) {
  const c = { improved: 0, worse: 0, no_clear_change: 0, unreliable: 0 };
  for (const r of rows) c[r.verdict]++;
  let headline;
  if (!rows.length) headline = 'Not enough data to judge.';
  else if (c.improved && !c.worse) headline = `Likely working: ${c.improved} concern${c.improved > 1 ? 's' : ''} improved beyond retake noise.`;
  else if (c.worse && !c.improved) headline = `Possibly not agreeing with your skin: ${c.worse} concern${c.worse > 1 ? 's' : ''} got worse beyond noise.`;
  else if (c.worse && c.improved) headline = `Mixed result: ${c.improved} improved, ${c.worse} worsened.`;
  else headline = 'No change you can trust yet. Keep going and re-check later; that is a real answer, not a failure.';
  return { counts: c, headline };
}

const round = (x) => Math.round(x * 10) / 10;
