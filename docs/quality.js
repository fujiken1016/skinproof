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

// Subject-independent blur check between two photos of the SAME session (baseline pair or follow-up pair).
// Real phone tests (tools/gate_analysis.py): an absolute sharpness threshold depends on the subject, but the ratio between photos of one
// session does not. Pass the Laplacian variance of each photo measured on a 480 px wide grayscale copy.
export function laplacianVariance(gray, w, h) {
  let n = 0, s = 0, s2 = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x; const l = 4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - w] - gray[i + w]; n++; s += l; s2 += l * l; }
  return n ? s2 / n - (s / n) ** 2 : 0;
}
export function relativeSharpnessIssue(a, b, ratio = 0.6) {
  const lo = Math.min(a, b), hi = Math.max(a, b);
  return hi > 0 && lo / hi < ratio ? 'One photo looks much less sharp than the other. Retake the blurrier one so the pair matches.' : null;
}

// Framing check between two photos of one pair: estimate the translation between them (normalised cross-correlation of edge maps,
// brute force over +-40% of the width) and warn when it is large. Real handheld photos in our test moved 24 to 30% of the width between shots
// (tools/jitter_measure.py), which makes scores less comparable. Translation only; zoom and rotation are not estimated.
export function estimateShift(a, b, w, h) {
  const edge = (g) => { const e = new Float32Array(w * h); for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x; e[i] = Math.abs(g[i + 1] - g[i - 1]) + Math.abs(g[i + w] - g[i - w]); } return e; };
  const ea = edge(a), eb = edge(b), R = Math.round(w * 0.4); let best = { score: -Infinity, dx: 0, dy: 0 };
  for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
    let s = 0, n = 0, sa = 0, sb = 0, sab = 0, saa = 0, sbb = 0;
    for (let y = Math.max(0, -dy); y < Math.min(h, h - dy); y += 2) for (let x = Math.max(0, -dx); x < Math.min(w, w - dx); x += 2) { const p = ea[y * w + x], r = eb[(y + dy) * w + x + dx]; n++; sa += p; sb += r; sab += p * r; saa += p * p; sbb += r * r; }
    if (n < (w * h) / 8) continue; const cov = sab - sa * sb / n, va = saa - sa * sa / n, vb = sbb - sb * sb / n; s = va > 0 && vb > 0 ? cov / Math.sqrt(va * vb) : -Infinity;
    if (s > best.score) best = { score: s, dx, dy };
  }
  return { dxPct: 100 * best.dx / w, dyPct: 100 * best.dy / w, confidence: best.score };
}
export function framingIssue(shift, limitPct = 12) {
  const d = Math.hypot(shift.dxPct, shift.dyPct);
  return shift.confidence > 0.3 && d > limitPct ? 'The two photos are framed quite differently. Take the second one with the same distance and position as the first.' : null;
}
