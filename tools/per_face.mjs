// Face-level view (the face, not the comparison, is the independent unit). No API calls.
// Held-out faces: f1,f10,f21,f28 scored with the face-A-only prior; London L* faces scored with the shipped pooled prior (fully held out).
import { readFileSync, writeFileSync } from 'node:fs';
import { PRIOR_SD, MIN_NOISE } from '../src/verdict.js';
const A = JSON.parse(readFileSync('demo/results.json')), Fz = JSON.parse(readFileSync('demo/results_faces.json')), LM = JSON.parse(readFileSync('demo/london_meta.json'));
const get = (k) => Object.entries(Fz).filter(([n, v]) => n.startsWith(k + '_') && !v.error).map(([, v]) => v);
const R = { A: [...Array(8).keys()].map((i) => A['retake_' + i]) }; for (const k of ['f1', 'f10', 'f21', 'f28']) R[k] = get(k); for (const k of Object.keys(LM)) { const g = get('f' + k); if (g.length >= 4) R['L' + k.slice(1)] = g; }
const types = Object.keys(R.A[0]); const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const sdA = Object.fromEntries(types.map((t) => { const v = R.A.map((m) => m[t]), mu = mean(v); return [t, Math.sqrt(mean(v.map((x) => (x - mu) ** 2)))]; }));
function* splits(r) { const n = r.length; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = a + 1; c < n; c++) for (let d = c + 1; d < n; d++) if (new Set([a, b, c, d]).size === 4) yield [[r[a], r[b]], [r[c], r[d]]]; }
function rates(r, prior) { const o = { n: 0, one: 0, three: 0, sp: 0 };
  for (const [B, C] of splits(r)) for (const t of types) { o.n++; const d = Math.abs(mean(C.map((m) => m[t])) - mean(B.map((m) => m[t]))); if (d >= 1) o.one++; if (d >= 3) o.three++;
    if (d >= 2 * Math.max(2, MIN_NOISE[t] || 0, prior[t], Math.abs(B[0][t] - B[1][t]), Math.abs(C[0][t] - C[1][t]))) o.sp++; }
  return { photos: r.length, comparisons: o.n, one: +(100 * o.one / o.n).toFixed(1), three: +(100 * o.three / o.n).toFixed(1), skinproof: +(100 * o.sp / o.n).toFixed(1) }; }
const out = {}; for (const k of ['f1', 'f10', 'f21', 'f28']) out[k] = rates(R[k], sdA); for (const k of Object.keys(R).filter((x) => x.startsWith('L'))) out[k] = rates(R[k], PRIOR_SD);
const faces = Object.keys(out); const per = (m) => faces.map((k) => out[k][m]);
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function boot(m) { const v = per(m), ms = []; for (let b = 0; b < 5000; b++) { let s = 0; for (let i = 0; i < v.length; i++) s += v[Math.floor(rnd() * v.length)]; ms.push(s / v.length); } ms.sort((x, y) => x - y); return { mean: +mean(v).toFixed(1), lo: +ms[125].toFixed(1), hi: +ms[4874].toFixed(1), min: Math.min(...v), max: Math.max(...v) }; }
const summary = { faces: faces.length, unit: 'face (cluster bootstrap, 5000 resamples)', one: boot('one'), three: boot('three'), skinproof: boot('skinproof') };
console.log(JSON.stringify({ perFace: out, summary }, null, 1)); writeFileSync('public/demo/per_face.json', JSON.stringify({ perFace: out, summary }));
