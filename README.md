# SkinProof

**Did that product actually work?** SkinProof measures your skin with [YouCam Skin AI](https://docs.perfectcorp.com/) before and after you try a product, and only claims a result when the change is bigger than the tool's own retake noise.

Built for the YouCam API Skin AI & eCommerce VTO Hackathon (Skin AI track).

## The idea
People ask "is this serum working?" right when they are about to rebuy. One before/after selfie pair cannot answer that: in our test, two photos of the same face already scored differently. So SkinProof takes **two back-to-back photos at baseline and two at follow-up**. The gap between the two retakes is the noise floor. A concern is only called *improved* or *worse* if the change exceeds 2x that noise (minimum 2 points). Otherwise the honest answer is "no clear change yet", and if the retakes disagree wildly it says it cannot judge.

## YouCam API usage
`POST /s2s/v2.0/file` -> `PUT` upload -> `POST /s2s/v2.0/task/skin-analysis` (12 SD concerns, `format: json`) -> poll `GET /task/skin-analysis/{id}`. Uses `raw_score` per concern. About 14 units per photo (docs do not state it; our estimate); one full trial = 4 photos.

## Real-API evidence (2026-10-17) and its limits
- Live flow verified end to end: file upload, `skin-analysis` task, polling, `raw_score` for 12 concerns (`tools/live_probe.mjs`; also through `server.js` `/api/analyze`).
- **Internal noise test (simulated retakes, 5 public-domain portraits, 29 photos; not real handheld sessions).** Real YouCam scores for each photo; "retakes" are programmatic shift/zoom/exposure/noise/JPEG jitter (`tools/make_demo_images.py`, `tools/make_face_retakes.py`, `tools/run_demo.mjs`, `tools/run_faces.mjs`, `tools/calibrate.mjs`; data `demo/results*.json`; credits `demo/CREDITS.md`).
  - The per-concern noise prior was fitted on face A only. On the **4 other faces** (1,296 no-change before/after comparisons, pairs within a face overlap): a rule that reports any 1-point move claims a change **20.1%** of the time, a 3-point threshold **2.1%**, SkinProof's rule **0.1%**. Using only the user's own retake gap gives 0.1% too. In-sample on face A: 17.1% / 8.1% / 0.4%.
  - So the honest reading: much lower false alarms in our test. Not an accuracy claim: 5 people, simulated retakes, and a plain 3-point threshold already does well. SkinProof's edge is that the bar adapts to each concern and to your own retakes.
  - Per-concern SD differs by person (texture 0.08 on one face, about 2 on another; pooled prior ranges 0.2 to 2.2). The prior is therefore a rough guide and the user's own retake gap always counts.
  - **Fully held out (London Set, CC BY 4.0, 3 people, 108 comparisons, shipped rule):** 21.3% / 2.8% / 0.9% for 1-point / 3-point / SkinProof. Small sample.
  - Where the fixed 3-point rule breaks depends on the person: acne 43.7% and pores 21.1% false alarms on face A; firmness 16.7% and texture 6.5% on the other faces (`tools/per_concern.mjs`, `HELDOUT=1` for the second view). SkinProof: 1.9%, 4.4%, 0%, 0.9%.
- **Real handheld retakes were not tested.** Searched for a public dataset of the same person photographed repeatedly with a license allowing commercial and research use (`reviews/DATASET_SEARCH.md`): none qualified (London Set has one neutral photo per person; Chicago/FEI/CaNAFF are research-only; MUCT/Caltech unverifiable). Own face photos are deliberately not used.
- API quirks met: `all`, `skin_age`, `resize_image` outputs have no `raw_score`; tasks fail with `error_large_face_angle`, `error_src_face_too_small`, `error_src_face_out_of_bound` (a face near the frame edge fails after a small shift); errors are not charged.
- **Units (14 per SD photo with 9 to 12 concerns, per docs.perfectcorp.com; confirm balance in the dashboard):** 43 successful analyses, about 600 of 1,000 units (about 400 left, reserved for video recording). Failed tasks are not charged. No paid usage.

## Try it as a judge (about 2 minutes)
1. **No key, no install:** open https://fujiken1016.github.io/skinproof/ . It replays recorded real YouCam results for three scenarios (nothing changed / smoother / redder, the last two simulated).
2. **Your own photos, UI only (no key):** `git clone https://github.com/fujiken1016/skinproof && cd skinproof && node server.js` (Node 22+, zero dependencies). Without a key it runs in MOCK mode: synthetic scores, so you can walk the full 2+2 photo flow.
3. **Your own photos, live YouCam API:** `YOUCAM_API_KEY=your_key node server.js` (key from the YouCam API console; free units cover about 70 photos). Open http://localhost:8787 , tick the consent box, add 2 baseline photos (front-facing, face 60 to 80% of the frame, same light), then 2 follow-up photos. Your key stays on your machine; photos go only to YouCam.
- Not offered: a hosted version that accepts anyone's photos. It would put a paid key behind a public endpoint, so we chose a keyless replay instead.

## Self-score against the R2 panel (reviews/R2_panel.md), 2026-10-17
Panel R2: 7.0 overall (Technology 7.5, Design 7.0, Impact 6.0, Idea 8.0). This pass, same rubric, honest estimate:
- Impact 6.0 to about 7.0: use scene, regulator sources with URLs, "demonstrated vs not" table, shop-page badge demo (`/shop-demo/`), cost per badge in units. Still missing: real handheld data and a sourced market number (not found; stated as not found).
- Technology 7.5 to about 8.0: fully held-out CC BY faces, per-score failure table of the fixed 3-point rule, linter loophole closed. Still one API.
- Idea 8.0 to about 8.3: the "fixed threshold fails in different places for different people" evidence.
- Design 7.0 unchanged until the video is re-edited (phone column too small, acne zoom, voice check are for the video owner; shotlist updated). Estimated average about 7.6. YouTube URL is still TODO and blocks submission.

## Live demo
Static hosted demo (no key, recorded real results + 3 scenarios): https://fujiken1016.github.io/skinproof/ . The API key never reaches a browser; own-photo mode needs `node server.js` with a key.

## Run
```
node server.js                       # Node 22+, zero dependencies. No key = MOCK mode (synthetic scores)
YOUCAM_API_KEY=... node server.js    # live API
npm test                             # verdict logic + honesty-linter tests (medical/ingredient/efficacy wording)
npm run pages                        # rebuild docs/ for GitHub Pages
```
Open http://localhost:8787. The API key stays on the server. Photos are never stored; only scores are saved in your browser (localStorage). "Delete all my data" wipes them.

## Limits (read these)
- Simulated retakes only; no public same-person retake dataset with a clear commercial/research license was found (see above). Not tested on real handheld sessions.
- Cosmetic tracking, not a medical device; it cannot diagnose anything. See a clinician for concerns.
- Scores depend on lighting, angle and makeup. Retake in the same light at the same time of day.
- Most concerns change over weeks, not days.
- Demo/mock mode scores are synthetic and only show the UI.

MIT licensed.
