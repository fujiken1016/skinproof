**Tagline:** An error bar for your skin score: YouCam Skin AI that says "no clear change yet" when that is the honest answer.

**In one line:** In our internal test (real YouCam scores, simulated retakes of 5 public-domain portraits), a rule that reports any 1-point move claimed a change that never happened 20.1% of the time on held-out faces; SkinProof's rule did 0.1%. Limits are stated below. SkinProof makes no claim that any product works.

**YouCam API used:** Skin Analysis (SD, 12 concerns, `format: json`).
**Try it (about 2 minutes):** keyless replay of real recorded results https://fujiken1016.github.io/skinproof/ ; your own photos with live YouCam: `YOUCAM_API_KEY=your_key node server.js` (Node 22, no install; without a key it runs in MOCK mode). Steps in the README.
**Repo:** https://github.com/fujiken1016/skinproof (MIT) **Video:** <YouTube URL, added by the author before submitting>

## Inspiration
Right before you rebuy a serum you ask: is this actually working? One before/after selfie cannot answer that, because two photos of the same face already score differently in our tests. Score trackers we know of show raw scores over time; we did not find one that shows how much a score moves between retakes.

## What it does
You take two back-to-back photos at baseline and two at follow-up. SkinProof sends each through YouCam Skin Analysis and measures the gap between the two retakes: the noise. A score is reported as risen or fallen only if the change exceeds twice that noise. Otherwise it says **"no clear change yet"**, and if the retakes disagree wildly it says it cannot judge. Next steps are about how to measure better and when to see a professional. It makes no claims about ingredients or products.

## How we used the YouCam API (Technological Implementation)
- Flow: `POST /s2s/v2.0/file`, `PUT` to the pre-signed URL, `POST /s2s/v2.0/task/skin-analysis` (12 SD concerns), poll the task, read `raw_score`. The key stays on the server.
- Quirks we hit: `all`, `skin_age`, `resize_image` entries carry no `raw_score`; `error_large_face_angle`, `error_src_face_too_small` and `error_src_face_out_of_bound` reject photos (not charged), so the app guides framing.
- Internal noise test (simulated retakes, not real handheld sessions): 29 photos of 5 CC0 portraits. The per-concern noise prior was fitted on one face; on the 4 other faces (1,296 no-change comparisons that overlap within a face) any-1-point rule 20.1%, 3-point threshold 2.1%, SkinProof 0.1%. A plain 3-point threshold already does well; SkinProof's edge is that the bar adapts per concern and per user. Per-concern SD varies by person (pooled prior 0.2 to 2.2), so your own retake gap always counts. 5 people is a small sample: read it as "much lower false alarms in our test", not as an accuracy claim.
- Pure, unit-tested decision logic (17 tests) and a claims linter that fails the build on medical, ingredient or efficacy wording in all user-facing files.
- Units: 30 successful analyses, about 420 of 1,000 free units (estimate at 14 per photo).

## Design
One flow: consent, two photos, baseline, re-check, verdict. "No clear change" is a designed result, not an error. Verdicts use icons and text, not colour alone; 48px targets; 375px layout; dark mode.

## Potential Impact
Audience: people about to rebuy a skincare product, who currently judge by memory and one lucky photo. The value is a measured, honest "can't tell yet" before spending more. For shops that show before/after photos, the same logic is a way to attach an error bar to a visual claim. We have no sourced market figures and do not state any; real handheld testing with consented volunteers is the next step.

## Quality of Idea
The novelty is not another score. It is putting an error bar on a consumer skin score, using the API's own repeatability as the yardstick, and being willing to say "I can't tell yet". Unlike tools that compare a score before and after and report the difference, SkinProof refuses to report differences smaller than the noise.

## Limits (read these)
Cosmetic self-tracking, not a medical device, cannot diagnose. Photos are sent to YouCam (Perfect Corp) for analysis; SkinProof does not store them, YouCam's retention follows its own policy, and the app asks for consent first. Demo follow-ups are simulated edits of a CC0 photo and imply no real skin change. Calibration is simulated and uses 5 faces.

## What's next
Real handheld retake study with consent; Skin Tone Analysis to widen the noise bar for harder lighting; a shareable result card for shops.

Built with: YouCam Skin Analysis API, Node 22 (no dependencies), vanilla JS, GitHub Pages. Demo photos: CC0 portraits from Wikimedia Commons (credits in `demo/CREDITS.md`).
