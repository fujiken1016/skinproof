import test from 'node:test';
import assert from 'node:assert/strict';
import { judge, summarize, toMap, PRIOR_SD } from '../src/verdict.js';

const m = (o) => o;
test('clear improvement beyond noise', () => {
  const r = judge([m({ acne: 50 }), m({ acne: 51 })], [m({ acne: 62 }), m({ acne: 63 })]);
  assert.equal(r[0].verdict, 'improved');
});
test('small change inside noise is NOT claimed', () => {
  const r = judge([m({ pore: 50 }), m({ pore: 56 })], [m({ pore: 58 }), m({ pore: 60 })]);
  assert.equal(r[0].verdict, 'no_clear_change');   // delta 6 < 2*6
});
test('worse detected', () => {
  const r = judge([m({ redness: 70 }), m({ redness: 71 })], [m({ redness: 55 }), m({ redness: 56 })]);
  assert.equal(r[0].verdict, 'worse');
});
test('wild retakes -> unreliable', () => {
  const r = judge([m({ texture: 40 }), m({ texture: 70 })], [m({ texture: 80 }), m({ texture: 82 })]);
  assert.equal(r[0].verdict, 'unreliable');
});
test('noise floor protects identical retakes', () => {
  const r = judge([m({ acne: 50 }), m({ acne: 50 })], [m({ acne: 53 }), m({ acne: 53 })]);
  assert.equal(r[0].verdict, 'no_clear_change');   // 3 < 2*2
});
test('missing data skipped; headline honest', () => {
  assert.equal(judge([m({ acne: 1 })], [m({ acne: 2 })]).length, 0);
  assert.match(summarize([]).headline, /Not enough/);
  assert.match(summarize([{ verdict: 'no_clear_change' }]).headline, /real answer/);
});
test('toMap', () => assert.deepEqual(toMap([{ type: 'acne', raw_score: 3 }, { type: 'x' }]), { acne: 3 }));

test('jumpy concern: identical-looking retakes still need a big change (acne prior)', () => {
  const r = judge([m({ acne: 90 }), m({ acne: 90 })], [m({ acne: 84 }), m({ acne: 84 })]);
  assert.ok(PRIOR_SD.acne > 4); assert.equal(r[0].verdict, 'no_clear_change');   // -6 < 2*4.57
  assert.equal(r[0].noiseFrom, 'known jumpy concern');
});
test('noise source reported', () => {
  const r = judge([m({ pore: 50 }), m({ pore: 58 })], [m({ pore: 52 }), m({ pore: 53 })]);
  assert.equal(r[0].noiseFrom, 'your retakes');
});
