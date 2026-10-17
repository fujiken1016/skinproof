// Deterministic MOCK analysis (no API key, no units spent). Scores are synthetic and
// derived from the image bytes so retakes differ slightly, like the real thing.
import { createHash } from 'node:crypto';
export function mockAnalyze(jpeg, actions) {
  const h = createHash('sha256').update(jpeg).digest();
  return actions.map((type, i) => {
    const base = 40 + (h[i % 32] / 255) * 45;              // 40..85 per concern, per photo
    const raw = Math.round(base * 100) / 100;
    return { type, raw_score: raw, ui_score: Math.min(100, Math.round(raw + 8)), mask_urls: [] };
  });
}
