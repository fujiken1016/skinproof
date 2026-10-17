// Honesty linter: user-facing copy must not (a) make medical/efficacy claims, (b) name skincare ingredients
// (ingredient + "helps" is an efficacy claim), (c) overstate the evidence. Runs over every user-facing file.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
export const MEDICAL = /\b(cure[sd]?|treat(s|ed|ment|ing)?|diagnos(e|es|ed|is)|heals?|clinically|dermatologist[- ]approved|guarantee[sd]?|evidence[- ]backed|proven)\b/i;
export const INGREDIENT = /\b(retino(id|ids|l)|azelaic|salicylic|niacinamide|vitamin c|peptides?|hyaluronic|glycerin|exfoliat\w*|aha|bha|ceramides?)\b/i;
export const EFFICACY = /\b(help(s|ed)?|improv(e|es|ed)? your skin|reduce[sd]?|fix(es)?|clear(s|ed)? (your )?(acne|skin)|erase[sd]?|anti-?aging)\b/i;
// lines that are *disclaimers* or describe scores, not skin outcomes
const SAFE = /(cannot diagnose|not a medical|not a diagnosis|not proof|no medical|not evidence|not a claim|makes no claim|no claims? about)/i;
const FILES = ['public/index.html', 'public/app.js', 'public/shop-demo/index.html', 'src/advice.js', 'src/verdict.js', 'README.md', 'submission/DEVPOST.md'];
export function violations(text) {
  const out = [];
  for (const [i, line] of text.split('\n').entries()) {
    if (SAFE.test(line)) continue;
    for (const [name, re] of [['medical', MEDICAL], ['ingredient', INGREDIENT]]) if (re.test(line)) out.push(`${name}@${i + 1}: ${line.trim().slice(0, 90)}`);
    if (EFFICACY.test(line) && /skin|acne|wrinkle|spot|pore|redness/i.test(line) && !/score|noise|retake/i.test(line)) out.push(`efficacy@${i + 1}: ${line.trim().slice(0, 90)}`);
  }
  return out;
}
for (const f of FILES) test('no medical/ingredient/efficacy claims in ' + f, () => assert.deepEqual(violations(readFileSync(f, 'utf8')), []));
test('linter catches the old advice.js wording (regression guard)', () => {
  const old = [
    "wrinkle: 'Wrinkles change slowest: retinoids and SPF are the evidence-backed pair.',",
    "age_spot: 'Dark spots: daily SPF is the base; vitamin C or azelaic acid help over months.',",
    "acne: 'look at gentle exfoliating acids (e.g. salicylic) or niacinamide, one at a time.',",
    "firmness: 'Firmness: retinoids and peptides over months; protect with SPF.',"].join('\n');
  assert.equal(violations(old).length >= 4, true);
});
test('linter catches treatment/efficacy claims', () => {
  assert.ok(violations('This serum treats acne and helps your skin heal.').length >= 1);
});
