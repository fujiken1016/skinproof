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
  - **Face-level view (`tools/per_face.mjs`, no API calls):** the face is the independent unit. Held-out CC0 faces f1, f10, f21, f28: 1-point rule 22.9% on average (14.6 to 27.8), 3-point 2.0% (0 to 4.4), SkinProof 0.1% (0 to 0.6). With the 3 London faces (7 faces, bootstrap over faces): 22.2% (17.3 to 27.2), 2.3% (0.9 to 3.9), 0.5% (0 to 1.3). The earlier "1,296 comparisons" overlap inside each face and are not independent.
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

## Self-score
Latest panel: R4, 8.1 (see `reviews/R1_panel.md` to `R4_panel.md` for the history, 6.4 to 8.1). Done without API credits in this pass: test count (25), shorter headline, pores decision, fairness limit, review questionnaire, gate-evaluation script. Open: YouTube URL (author), real handheld jitter photos (below), video edits (`submission/VIDEO_SHOTLIST.md`, R4 list), Skin Tone (needs credits).

## Real handheld jitter vs our simulated retakes (measured 2026-10-18, no faces, no API)
14 handheld photos of a still, faceless object, framed afresh each time (photos not published; numbers in `demo/jitter_measured.json`; `tools/jitter_measure.py`, add `--adjacent` to compare with the previous photo).
| Measure | Simulated retakes | Real handheld, vs first (max / p95) | Real handheld, vs previous (max / p95) |
|---|---|---|---|
| Shift of image centre (% of width) | about 0 to 3 | 31.9 / 24.4 | 34.5 / 29.7 |
| Zoom (%) | 0 to 3 | 24.6 / 23.4 | 19.0 / 15.2 |
| Rotation (degrees) | 0 (none simulated) | 5.5 / 5.1 | 15.6 / 10.0 (some pairs may be mismatched) |
| Brightness change (%) | 0 to 3 | 10.3 / 7.8 | 14.8 / 12.4 |
Reading: real framing jitter is several times larger than we simulated on every measure, and we simulated no rotation. Caveats: one subject, a feature-matching estimate, and freely re-framed photos (a selfie is framed to put the face at 60 to 80% of the frame, so face-framing jitter in use may be smaller; unknown).
Can stored API results tell us the error rate under the larger jitter? No. Within the simulated range, a retake's score deviation does not track its zoom, shift or brightness (Spearman 0.0, -0.01 and -0.07 on 29 photos; `tools/jitter_sensitivity.py`), so extrapolating 5 to 10 times beyond that range is not supported, and we ran no new API calls. Honest limit: real handheld noise is probably larger than our simulated noise, so in real use the noise floor is likely wider and the false-alarm figures above may not carry over; the user's own retake gap, which always counts, is what protects them. Rerunning the study with wider jitter needs API credits (pre-registered rule in `tools/HANDHELD_PROTOCOL.md`).
Still to do: the 10 deliberately bad photos go in `../jitter_photos/bad/`, then `python3 tools/gate_eval.py ../jitter_photos ../jitter_photos/bad` reports the quality-gate rejection rate.

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
