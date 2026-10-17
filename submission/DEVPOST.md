# SkinProof: Devpost text (English)

**Tagline:** Did that product actually work? YouCam Skin AI, judged against your own retake noise.

## Inspiration
Right before you rebuy a serum you ask: is this actually working? One before/after selfie cannot answer that, because two photos of the same face seconds apart already score differently. Every skin tracker we looked at plots raw scores over time and treats every wiggle as progress.

## What it does
You take two back-to-back photos at baseline and two at follow-up. SkinProof sends each through YouCam Skin Analysis (12 concerns) and measures the gap between the two retakes: the noise. A concern is called *improved* or *worse* only if the change exceeds 2x that noise. Otherwise it says **"no clear change yet"**, and if the retakes disagree wildly it says it cannot judge. Each result comes with a plain-language next step, and no medical claims.

## How we used the YouCam API (Technological Implementation)
- Skin Analysis flow: `POST /s2s/v2.0/file` -> `PUT` to the pre-signed URL -> `POST /s2s/v2.0/task/skin-analysis` (12 SD concerns, `format: json`) -> poll the task -> read `raw_score` per concern. Bearer key stays on the server.
- We ran a real noise study on the API: 8 handheld-style retakes of one CC0 portrait, 2,520 no-change comparisons. A tracker that believes any 1-point move claims a change **17.1%** of the time (8.1% at 3 points). SkinProof's rule: **0.4%**. Per-concern SD differs 100x (texture 0.08, acne 4.57), so the rule uses the larger of your retake gap, a 2-point floor and that concern's measured SD.
- Pure, unit-tested decision logic (13 tests, including an honesty linter that fails the build on medical-claim wording). Cost: 4 photos per check, about 14 units each. Used about 196 of our 1,000 free units for the whole project.
- Hosted demo replays recorded real API results so no key is exposed; the server mode runs the live API on your own photos.

## Design
One flow: two photos, baseline, re-check, verdict. The "no clear change" screen is a designed result, not an error. Verdicts use icons and text, not color alone; 48px targets; works at 375px; dark mode.

## Potential impact
For anyone about to rebuy a product (and for brands that want efficacy claims people can trust): fewer wasted purchases on placebo, fewer false "it made my skin worse" returns, and honest answers that build trust. We do not claim any product works; the demo follow-ups are simulated edits of a CC0 photo, labelled as such.

## Quality of idea
The novelty is not another score. It is putting an error bar on a consumer skin score, using the API's own repeatability as the yardstick, and being willing to say "I can't tell yet".

## Challenges
YouCam rejects tilted faces (`error_large_face_angle`) and small faces, so we gate photos client-side; the calibration is one face under simulated retakes (in-sample), which we state plainly.

## What's next
Lighting/quality gate using more of the API's signals, a second API (skin tone) to modulate confidence, and a shareable "proof card" for brands.

## Built with
YouCam Skin Analysis API, Node 22 (zero dependencies), vanilla JS, GitHub Pages.
Links: repo https://github.com/fujiken1016/skinproof , demo https://fujiken1016.github.io/skinproof/ , video (YouTube, TODO by author).
Demo photo: CC0 "Lesley Ray.jpg" (Wikimedia Commons).
