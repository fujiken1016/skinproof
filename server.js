// Zero-dependency server. Holds the API key server-side. Never stores photos.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyze } from './src/youcam.js';
import { mockAnalyze } from './src/mock.js';
import { ACTIONS } from './src/verdict.js';
import { NEXT, DISCLAIMER } from './src/advice.js';

const ROOT = fileURLToPath(new URL('./public/', import.meta.url));
const KEY = process.env.YOUCAM_API_KEY || '';
const MOCK = process.env.MOCK === '1' || !KEY;
const PORT = Number(process.env.PORT || 8787);
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
let busy = 0;

function readBody(req, limit = 6e6) {
  return new Promise((res, rej) => { const c = []; let n = 0;
    req.on('data', (d) => { n += d.length; if (n > limit) { rej(new Error('too large')); req.destroy(); } else c.push(d); });
    req.on('end', () => res(Buffer.concat(c))); req.on('error', rej); });
}
const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };

http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/api/info') return send(res, 200, { mock: MOCK, actions: ACTIONS, next: NEXT, disclaimer: DISCLAIMER });
    if (req.method === 'POST' && req.url === '/api/analyze') {
      if (busy >= 2) return send(res, 429, { error: 'busy, try again in a moment' });
      busy++;
      try {
        const { image } = JSON.parse((await readBody(req)).toString());
        const jpeg = Buffer.from(String(image).replace(/^data:image\/jpeg;base64,/, ''), 'base64');
        if (jpeg.length < 2000 || jpeg[0] !== 0xff || jpeg[1] !== 0xd8) return send(res, 400, { error: 'send a JPEG' });
        const output = MOCK ? mockAnalyze(jpeg, ACTIONS) : await analyze(KEY, jpeg, ACTIONS);
        return send(res, 200, { output: output.map(({ type, raw_score, ui_score }) => ({ type, raw_score, ui_score })), mock: MOCK });
      } finally { busy--; }
    }
    if (req.method === 'GET') {
      const p = req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0];
      const f = p === '/verdict.js' ? fileURLToPath(new URL('./src/verdict.js', import.meta.url)) : normalize(join(ROOT, p));
      if (p !== '/verdict.js' && !f.startsWith(ROOT)) return send(res, 403, { error: 'no' });
      const body = await readFile(f).catch(() => null);
      if (!body) return send(res, 404, { error: 'not found' });
      res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' }); return res.end(body);
    }
    send(res, 404, { error: 'not found' });
  } catch (e) { send(res, 500, { error: String(e.message || e).slice(0, 200), code: e.code }); }
}).listen(PORT, () => console.log(`SkinProof on http://localhost:${PORT}  (${MOCK ? 'MOCK mode: synthetic scores, no units spent' : 'live YouCam API'})`));
