// Static hosted demo: public/ + verdict.js -> docs/ (GitHub Pages). No key, no server.
import { cpSync, rmSync, mkdirSync } from 'node:fs';
rmSync('docs', { recursive: true, force: true }); mkdirSync('docs');
cpSync('public', 'docs', { recursive: true }); cpSync('src/verdict.js', 'docs/verdict.js'); cpSync('src/advice.js', 'docs/advice.js'); cpSync('src/quality.js', 'docs/quality.js');
console.log('docs/ built');
