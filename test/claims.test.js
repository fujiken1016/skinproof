// Honesty linter (copy must never make medical claims). Same idea as a CI "claim linter".
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const BANNED = /\b(cure[sd]?|treat(s|ed|ment)?|diagnos(e|es|is)|clinically (proven|tested)|dermatologist[- ]approved|guarantee[sd]?)\b/i;
const ALLOWED_CONTEXT = /(cannot diagnose|not a medical|cannot diagnose anything|See a dermatologist|clinician)/i;
for (const f of ['public/index.html', 'public/app.js', 'src/advice.js', 'src/verdict.js']) {
  test('no medical claims in ' + f, () => {
    for (const line of readFileSync(f, 'utf8').split('\n')) if (BANNED.test(line)) assert.match(line, ALLOWED_CONTEXT, line.trim().slice(0, 100));
  });
}
