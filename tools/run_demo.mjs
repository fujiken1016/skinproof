// Calls the live YouCam API for the demo photo set; stores ONLY scores in demo/results.json (resumable).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { analyze } from '../src/youcam.js';
import { ACTIONS, toMap } from '../src/verdict.js';
const key = process.env.YOUCAM_API_KEY; if (!key) throw new Error('set YOUCAM_API_KEY');
const names = [...Array(8).keys()].map((i) => `retake_${i}`).concat(['better_0','better_1','worse_0','worse_1']);
const out = existsSync('demo/results.json') ? JSON.parse(readFileSync('demo/results.json')) : {};
let calls = 0;
for (const n of names) {
  if (out[n]) continue;
  try { out[n] = toMap(await analyze(key, readFileSync(`demo/${n}.jpg`), ACTIONS)); calls++; console.log('ok', n); }
  catch (e) { out[n] = { error: String(e.message) }; console.log('FAILED', n, e.message); }
  writeFileSync('demo/results.json', JSON.stringify(out, null, 1));
}
console.log('successful calls this run:', calls);
