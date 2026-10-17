// Where does a fixed 3-point threshold fail? False "changed" rate per concern and per face (no-change comparisons), vs SkinProof's rule.
import { readFileSync } from 'node:fs';
import { PRIOR_SD } from '../src/verdict.js';
const A = JSON.parse(readFileSync('demo/results.json')), Fz = JSON.parse(readFileSync('demo/results_faces.json'));
const faces = { A: [...Array(8).keys()].map((i) => A['retake_' + i]) };
for (const k of ['f1', 'f10', 'f21', 'f28']) faces[k] = Object.entries(Fz).filter(([n, v]) => n.startsWith(k + '_') && !v.error).map(([, v]) => v);
const types = Object.keys(faces.A[0]); const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const sp = (t, B, C) => 2 * Math.max(2, PRIOR_SD[t], Math.abs(B[0][t] - B[1][t]), Math.abs(C[0][t] - C[1][t]));
function* splits(R) { const n = R.length; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = a + 1; c < n; c++) for (let d = c + 1; d < n; d++) if (new Set([a, b, c, d]).size === 4) yield [[R[a], R[b]], [R[c], R[d]]]; }
const byC = {}, byF = {};
for (const [f, R] of Object.entries(faces)) if (!(process.env.HELDOUT && f === 'A')) for (const [B, C] of splits(R)) for (const t of types) {
  const d = Math.abs(mean(C.map((m) => m[t])) - mean(B.map((m) => m[t])));
  for (const [k, key] of [[t, byC], [f, byF]]) { const o = (key[k] ||= { n: 0, n3: 0, sp: 0 }); o.n++; if (d >= 3) o.n3++; if (d >= sp(t, B, C)) o.sp++; } }
const pct = (a, n) => +(100 * a / n).toFixed(1);
console.log('per concern (all 5 faces): fixed-3pt vs SkinProof'); for (const [k, o] of Object.entries(byC)) console.log(k.padEnd(15), pct(o.n3, o.n) + '%', pct(o.sp, o.n) + '%');
console.log('per face'); for (const [k, o] of Object.entries(byF)) console.log(k.padEnd(5), pct(o.n3, o.n) + '%', pct(o.sp, o.n) + '%', 'n=' + o.n);
