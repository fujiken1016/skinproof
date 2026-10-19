// "What if the noise were k times larger?" HYPOTHETICAL scaling of observed score deviations (not a measurement).
// For every no-change comparison, each retake's deviation from its face mean is multiplied by k. The fixed 1-point and 3-point rules and
// SkinProof's rule (bar = 2 x max(floor, prior, own retake gap); prior is NOT scaled, i.e. the worst case for SkinProof) are then rerun.
// Also a Gaussian Monte Carlo (same SD for all four photos) as a sanity check of the structure.
import { readFileSync, writeFileSync } from 'node:fs';
import { PRIOR_SD, MIN_NOISE } from '../src/verdict.js';
const A = JSON.parse(readFileSync('demo/results.json')), Fz = JSON.parse(readFileSync('demo/results_faces.json'));
const faces = { A: [...Array(8).keys()].map((i) => A['retake_' + i]) };
for (const k of ['f1', 'f10', 'f21', 'f28']) faces[k] = Object.entries(Fz).filter(([n, v]) => n.startsWith(k + '_') && !v.error).map(([, v]) => v);
const types = Object.keys(faces.A[0]); const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
function* splits(n) { for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = a + 1; c < n; c++) for (let d = c + 1; d < n; d++) if (new Set([a, b, c, d]).size === 4) yield [a, b, c, d]; }
const bar = (t, b0, b1, c0, c1) => 2 * Math.max(2, MIN_NOISE[t] || 0, PRIOR_SD[t], Math.abs(b0 - b1), Math.abs(c0 - c1));
const ks = [1, 2, 3, 5, 10], out = { hypothetical_scaling_of_observed_scores: {}, gaussian_monte_carlo_sd1: {} };
for (const k of ks) { const per = [];
  for (const f of ['f1', 'f10', 'f21', 'f28']) { const R = faces[f]; const mu = Object.fromEntries(types.map((t) => [t, mean(R.map((m) => m[t]))]));
    const v = (i, t) => mu[t] + k * (R[i][t] - mu[t]); let n = 0, o = 0, th = 0, sp = 0;
    for (const [a, b, c, d] of splits(R.length)) for (const t of types) { n++; const x = Math.abs(mean([v(c, t), v(d, t)]) - mean([v(a, t), v(b, t)])); if (x >= 1) o++; if (x >= 3) th++; if (x >= bar(t, v(a, t), v(b, t), v(c, t), v(d, t))) sp++; }
    per.push({ one: 100 * o / n, three: 100 * th / n, skinproof: 100 * sp / n }); }
  const m = (key) => +mean(per.map((p) => p[key])).toFixed(1); out.hypothetical_scaling_of_observed_scores['k=' + k] = { one_point: m('one'), three_point: m('three'), skinproof: m('skinproof') }; }
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
for (const sd of [0.5, 1, 2, 4]) { let n = 0, o = 0, th = 0, sp = 0; for (let i = 0; i < 20000; i++) { const p = [0, 0, 0, 0].map(() => sd * gauss()); n++; const x = Math.abs((p[2] + p[3]) / 2 - (p[0] + p[1]) / 2); if (x >= 1) o++; if (x >= 3) th++; if (x >= 2 * Math.max(2, Math.abs(p[0] - p[1]), Math.abs(p[2] - p[3]))) sp++; }
  out.gaussian_monte_carlo_sd1['sd=' + sd] = { one_point: +(100 * o / n).toFixed(1), three_point: +(100 * th / n).toFixed(1), skinproof_no_prior: +(100 * sp / n).toFixed(1) }; }
console.log(JSON.stringify(out, null, 1)); writeFileSync('demo/noise_scaling.json', JSON.stringify(out, null, 1));
