// Pores: does a higher minimum noise floor (3 instead of 2 points) cut false alarms, and what does it cost? Stored data only.
import { readFileSync } from 'node:fs';
const A = JSON.parse(readFileSync('demo/results.json')), Fz = JSON.parse(readFileSync('demo/results_faces.json'));
const R = { A: [...Array(8).keys()].map((i) => A['retake_' + i]) }; for (const k of ['f1', 'f10', 'f21', 'f28']) R[k] = Object.entries(Fz).filter(([n, v]) => n.startsWith(k + '_') && !v.error).map(([, v]) => v);
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length, PRIOR = 1.33;
function* sp(r) { const n = r.length; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = a + 1; c < n; c++) for (let d = c + 1; d < n; d++) if (new Set([a, b, c, d]).size === 4) yield [[r[a], r[b]], [r[c], r[d]]]; }
const need = (floor, B, C) => 2 * Math.max(floor, PRIOR, Math.abs(B[0].pore - B[1].pore), Math.abs(C[0].pore - C[1].pore));
for (const floor of [2, 3]) {
  const out = {}; for (const [f, r] of Object.entries(R)) { let n = 0, fa = 0; for (const [B, C] of sp(r)) { n++; if (Math.abs(mean(C.map((m) => m.pore)) - mean(B.map((m) => m.pore))) >= need(floor, B, C)) fa++; } out[f] = +(100 * fa / n).toFixed(1); }
  const B = [A.retake_0, A.retake_1], red = [A.worse_0, A.worse_1], sm = [A.better_0, A.better_1];
  const d = (X) => mean(X.map((m) => m.pore)) - mean(B.map((m) => m.pore));
  console.log('floor', floor, 'pores false-alarm % per face', JSON.stringify(out), '| red-cast pores change', d(red).toFixed(1), 'needs', need(floor, B, red).toFixed(1), '| smoothed pores change', d(sm).toFixed(1), 'needs', need(floor, B, sm).toFixed(1));
}
