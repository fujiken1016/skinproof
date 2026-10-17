# SkinProof

**Did that product actually work?** SkinProof measures your skin with [YouCam Skin AI](https://docs.perfectcorp.com/) before and after you try a product, and only claims a result when the change is bigger than the tool's own retake noise.

Built for the YouCam API Skin AI & eCommerce VTO Hackathon (Skin AI track).

## The idea
People ask "is this serum working?" right when they are about to rebuy. One before/after selfie pair cannot answer that: two photos of the same face on the same day already differ. So SkinProof takes **two back-to-back photos at baseline and two at follow-up**. The gap between the two retakes is the noise floor. A concern is only called *improved* or *worse* if the change exceeds 2x that noise (minimum 2 points). Otherwise the honest answer is "no clear change yet", and if the retakes disagree wildly it says it cannot judge.

## YouCam API usage
`POST /s2s/v2.0/file` -> `PUT` upload -> `POST /s2s/v2.0/task/skin-analysis` (12 SD concerns, `format: json`) -> poll `GET /task/skin-analysis/{id}`. Uses `raw_score` per concern. About 14 units per photo; one full trial = 4 photos.

## Real-API evidence (2026-10-17)
- Live flow verified end to end: file upload, `skin-analysis` task, polling, `raw_score` for 12 concerns (`tools/live_probe.mjs`, and through `server.js` `/api/analyze`).
- Noise study (`tools/make_demo_images.py`, `tools/run_demo.mjs`, `tools/calibrate.mjs`, data in `demo/results.json`): 8 simulated handheld retakes of one CC0 portrait. Over 2,520 no-change before/after comparisons, a tracker that reports any 1-point move claims a change **17.1%** of the time (8.1% at 3 points); SkinProof's rule **0.4%** (0.8% using only the user's own retakes). Per-concern SD varies 100x (texture 0.08, acne 4.57), which is why the rule takes the larger of the user's retake gap, a 2-point floor and the concern's SD. Caveat: one face, simulated retakes, calibration in-sample.
- Surprise worth knowing: the API also returns `all`, `skin_age`, `resize_image` entries with no `raw_score`; and `error_large_face_angle` rejects tilted heads (no units charged on error).
- **Units used: 14 successful analyses (about 196 of 1,000 units, assuming 14 per SD photo)**; 1 failed task (`error_large_face_angle`, not charged). No paid usage.

## Live demo
Static hosted demo (no key, recorded real results + 3 scenarios): https://fujiken1016.github.io/skinproof/ . The API key never reaches a browser; own-photo mode needs `node server.js` with a key.

## Run
```
node server.js                       # Node 22+, zero dependencies. No key = MOCK mode (synthetic scores)
YOUCAM_API_KEY=... node server.js    # live API
npm test                             # verdict logic + honesty-linter tests
npm run pages                        # rebuild docs/ for GitHub Pages
```
Open http://localhost:8787. The API key stays on the server. Photos are never stored; only scores are saved in your browser (localStorage). "Delete all my data" wipes them.

## Limits (read these)
- Cosmetic tracking, not a medical device; it cannot diagnose anything. See a clinician for concerns.
- Scores depend on lighting, angle and makeup. Retake in the same light at the same time of day.
- Most concerns change over weeks, not days.
- Demo/mock mode scores are synthetic and only show the UI.

MIT licensed.
