// Calibration study on real API output (demo/results.json): 8 retakes of one scene.
// Prints per-concern SD (-> PRIOR_SD) and false-alarm rates of three rules on identical-condition splits.
import { readFileSync } from 'node:fs';
import { toMap } from '../src/verdict.js';
const r = JSON.parse(readFileSync('demo/results.json'));
const R = [...Array(8).keys()].map((i) => r['retake_' + i]);
const types = Object.keys(R[0]).filter((t) => typeof R[0][t] === 'number');
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const sd = {}; for (const t of types) { const v = R.map((m) => m[t]), m = mean(v); sd[t] = Math.sqrt(mean(v.map((x) => (x - m) ** 2))); }
console.log('PRIOR_SD', JSON.stringify(Object.fromEntries(Object.entries(sd).map(([k, v]) => [k, +v.toFixed(2)]))));
// all disjoint pair-of-pairs splits
const idx = [...Array(8).keys()]; const splits = [];
for (let a = 0; a < 8; a++) for (let b = a + 1; b < 8; b++) for (let c = 0; c < 8; c++) for (let d = c + 1; d < 8; d++)
  if (new Set([a, b, c, d]).size === 4 && a < c) splits.push([[a, b], [c, d]]);
const rule = {
  naive1: () => 1.0,                                      // "any move >= 1 point is a change"
  naive3: () => 3.0,
  measuredOnly: (t, B, A) => 2 * Math.max(2, Math.abs(B[0][t] - B[1][t]), Math.abs(A[0][t] - A[1][t])),
  calibrated: (t, B, A) => 2 * Math.max(2, sd[t], Math.abs(B[0][t] - B[1][t]), Math.abs(A[0][t] - A[1][t])),
};
const fa = { naive1: 0, naive3: 0, measuredOnly: 0, calibrated: 0 }; let n = 0;
for (const [bi, ai] of splits) { const B = bi.map((i) => R[i]), A = ai.map((i) => R[i]);
  for (const t of types) { n++; const d = Math.abs(mean(A.map((m) => m[t])) - mean(B.map((m) => m[t])));
    for (const k in rule) if (d >= rule[k](t, B, A)) fa[k]++; } }
console.log('comparisons', n); for (const k in fa) console.log(k, 'false "changed" rate', (100 * fa[k] / n).toFixed(1) + '%');

import { writeFileSync } from 'node:fs';
writeFileSync('public/demo/study.json', JSON.stringify({ comparisons: n, retakes: 8, rates: Object.fromEntries(Object.entries(fa).map(([k, v]) => [k, +(100 * v / n).toFixed(1)])), prior_sd: sd }));
