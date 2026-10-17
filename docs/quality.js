// Client-side photo quality gate (pure function). Catches photos YouCam would reject or that make a poor retake,
// BEFORE they are sent (saves units and time). It cannot see faces; the API still checks face size/angle.
// input: {width, height, gray: Uint8ClampedArray (downscaled luminance), w, h}
export function checkPhoto({ width, height, gray, w, h }) {
  const issues = [];
  if (Math.min(width, height) < 480) issues.push('Photo is too small: short side must be 480 px or more.');
  let sum = 0; for (let i = 0; i < gray.length; i++) sum += gray[i];
  const mean = sum / gray.length;
  if (mean < 60) issues.push('Too dark: use even, bright light.'); else if (mean > 215) issues.push('Too bright: avoid glare and strong backlight.');
  // blur: variance of a 4-neighbour Laplacian on the downscaled image
  let n = 0, s = 0, s2 = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x; const l = 4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - w] - gray[i + w]; n++; s += l; s2 += l * l; }
  const variance = n ? s2 / n - (s / n) ** 2 : 0;
  if (variance < 25) issues.push('Looks blurry: hold still and let the camera focus.');
  return { ok: issues.length === 0, issues, mean: Math.round(mean), sharpness: Math.round(variance) };
}
