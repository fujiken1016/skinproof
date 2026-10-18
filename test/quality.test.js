import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPhoto, relativeSharpnessIssue, laplacianVariance } from '../src/quality.js';
const mk = (fn, w = 64, h = 64) => { const g = new Uint8ClampedArray(w * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) g[y * w + x] = fn(x, y); return { width: 800, height: 1000, gray: g, w, h }; };
test('sharp, well-exposed photo passes', () => assert.equal(checkPhoto(mk((x, y) => ((x + y) % 8 < 4 ? 90 : 170))).ok, true));
test('dark photo flagged', () => assert.match(checkPhoto(mk((x, y) => ((x + y) % 8 < 4 ? 10 : 40))).issues.join(), /dark/));
test('bright photo flagged', () => assert.match(checkPhoto(mk((x, y) => ((x + y) % 8 < 4 ? 220 : 250))).issues.join(), /bright/));
test('flat (blurry) photo flagged', () => assert.match(checkPhoto(mk(() => 128)).issues.join(), /blurry/));
test('small photo flagged', () => assert.match(checkPhoto({ ...mk(() => 128), width: 300, height: 400 }).issues.join(), /too small/));

test('relative sharpness flags a much blurrier photo of the same session', () => {
  assert.match(relativeSharpnessIssue(390, 200), /less sharp/);
  assert.equal(relativeSharpnessIssue(390, 350), null);
  assert.equal(relativeSharpnessIssue(0, 0), null);
});
test('laplacian variance is higher for textured than flat images', () => {
  const w = 32, h = 32, tex = new Uint8ClampedArray(w * h).map((_, i) => ((i % w + Math.floor(i / w)) % 2 ? 200 : 50)), flat = new Uint8ClampedArray(w * h).fill(120);
  assert.ok(laplacianVariance(tex, w, h) > laplacianVariance(flat, w, h));
});
