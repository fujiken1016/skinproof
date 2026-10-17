// Calibration + out-of-sample check on REAL YouCam output (simulated handheld retakes of CC0 portraits).
// Face A = demo/results.json (8 retakes). Faces B-E = demo/results_faces.json (4-6 retakes each, independent people).
import { readFileSync, writeFileSync } from 'node:fs';
const A = JSON.parse(readFileSync('demo/results.json')), Fz = JSON.parse(readFileSync('demo/results_faces.json'));
const faces = { A: [...Array(8).keys()].map((i) => A['retake_' + i]) };
for (const k of ['f1', 'f10', 'f21', 'f28']) faces[k] = Object.entries(Fz).filter(([n, v]) => n.startsWith(k + '_') && !v.error).map(([, v]) => v);
const types = Object.keys(faces.A[0]);
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const sdOf = (R) => Object.fromEntries(types.map((t) => { const v = R.map((m) => m[t]), m = mean(v); return [t, Math.sqrt(mean(v.map((x) => (x - m) ** 2)))]; }));
const sdFace = Object.fromEntries(Object.entries(faces).map(([k, R]) => [k, sdOf(R)]));
const pooled = Object.fromEntries(types.map((t) => [t, Math.sqrt(mean(Object.values(sdFace).map((s) => s[t] ** 2)))]));   // RMS over faces
function splits(n) { const o = []; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = a + 1; c < n; c++) for (let d = c + 1; d < n; d++) if (new Set([a, b, c, d]).size === 4) o.push([[a, b], [c, d]]); return o; }
const rules = (prior) => ({
  naive1: () => 1, naive3: () => 3,
  measuredOnly: (t, B, A2) => 2 * Math.max(2, Math.abs(B[0][t] - B[1][t]), Math.abs(A2[0][t] - A2[1][t])),
  skinproof: (t, B, A2) => 2 * Math.max(2, prior[t], Math.abs(B[0][t] - B[1][t]), Math.abs(A2[0][t] - A2[1][t])) });
function rate(R, prior) {
  const rl = rules(prior), fa = { naive1: 0, naive3: 0, measuredOnly: 0, skinproof: 0 }; let n = 0;
  for (const [bi, ai] of splits(R.length)) { const B = bi.map((i) => R[i]), A2 = ai.map((i) => R[i]);
    for (const t of types) { n++; const d = Math.abs(mean(A2.map((m) => m[t])) - mean(B.map((m) => m[t]))); for (const k in fa) if (d >= rl[k](t, B, A2)) fa[k]++; } }
  return { n, ...Object.fromEntries(Object.entries(fa).map(([k, v]) => [k, +(100 * v / n).toFixed(1)])) };
}
const priorA = sdFace.A;
const out = { faces: Object.fromEntries(Object.entries(faces).map(([k, R]) => [k, R.length])), prior_sd_pooled: Object.fromEntries(Object.entries(pooled).map(([k, v]) => [k, +v.toFixed(2)])), sd_by_face: sdFace };
out.in_sample_face_A = rate(faces.A, priorA);                                  // prior fit on same retakes
out.out_of_sample = {}; let tot = { n: 0, naive1: 0, naive3: 0, measuredOnly: 0, skinproof: 0 };
for (const k of ['f1', 'f10', 'f21', 'f28']) { const r = rate(faces[k], priorA); out.out_of_sample[k] = r; for (const m in tot) tot[m] += k === 'x' ? 0 : (m === 'n' ? r.n : r[m] * r.n / 100); }
out.out_of_sample_total = { n: tot.n, ...Object.fromEntries(['naive1', 'naive3', 'measuredOnly', 'skinproof'].map((m) => [m, +(100 * tot[m] / tot.n).toFixed(1)])) };
out.pooled_prior_all_faces = (() => { let t2 = { n: 0, naive1: 0, naive3: 0, measuredOnly: 0, skinproof: 0 }; for (const k in faces) { const r = rate(faces[k], pooled); for (const m in t2) t2[m] += m === 'n' ? r.n : r[m] * r.n / 100; } return { n: t2.n, ...Object.fromEntries(['naive1', 'naive3', 'measuredOnly', 'skinproof'].map((m) => [m, +(100 * t2[m] / t2.n).toFixed(1)])) }; })();
console.log(JSON.stringify({ ...out, sd_by_face: undefined }, null, 1));
console.log('PRIOR (pooled)', JSON.stringify(out.prior_sd_pooled));
console.log('SD ratio max/min pooled', (Math.max(...Object.values(pooled)) / Math.min(...Object.values(pooled))).toFixed(0));
writeFileSync('public/demo/study.json', JSON.stringify(out));
