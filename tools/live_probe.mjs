// One live YouCam call on a demo image. Reads the key from env (never printed).
import { readFileSync } from 'node:fs';
import { analyze } from '../src/youcam.js';
import { ACTIONS } from '../src/verdict.js';
const key = process.env.YOUCAM_API_KEY;
if (!key) { console.error('set YOUCAM_API_KEY'); process.exit(1); }
const out = await analyze(key, readFileSync(process.argv[2]), ACTIONS);
console.log(JSON.stringify(out.map(({ type, raw_score, ui_score }) => ({ type, raw_score, ui_score }))));
