// Live API on extra faces. Probes retake_0 first; a face that errors is skipped (errors cost no units). Scores only -> demo/results_faces.json
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { analyze } from '../src/youcam.js';
import { ACTIONS, toMap } from '../src/verdict.js';
const key = process.env.YOUCAM_API_KEY; if (!key) throw new Error('set YOUCAM_API_KEY');
const F = 'demo/results_faces.json'; const out = existsSync(F) ? JSON.parse(readFileSync(F)) : {}; let ok = 0;
for (const k of [1, 10, 21, 28]) {
  for (let i = 0; i < 6; i++) {
    const n = `f${k}_retake_${i}`; if (out[n] && !out[n].error) continue;
    if (i > 0 && out[`f${k}_retake_0`]?.error) break;                    // face rejected, skip
    try { out[n] = toMap(await analyze(key, readFileSync(`demo/${n}.jpg`), ACTIONS)); ok++; console.log('ok', n); }
    catch (e) { out[n] = { error: String(e.message) }; console.log('FAILED', n, e.message); }
    writeFileSync(F, JSON.stringify(out, null, 1));
  }
}
console.log('successful calls:', ok);
