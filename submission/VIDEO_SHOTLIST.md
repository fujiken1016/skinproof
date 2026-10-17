# Video shot list v2: a REAL SCREEN RECORDING with a live analysis (for the video owner)
Target 2:00 to 2:30 (rules: 1 to 3 min, judges stop at 3:00; YouTube public; must explain which YouCam API is used and show the app running on its target device; no copyrighted music, no third-party logos).
**Why v2:** the panel (R1) failed v1 because it was stitched screenshots. Every app scene below must be one continuous browser capture. No device frame, no slides in place of the app. Capture the browser window at phone width (DevTools responsive 390x844) filling at least 85% of the frame; zoom 125% so text reads at 1080p.

## Setup (before recording)
1. `cd skinproof && YOUCAM_API_KEY=... node server.js` (never show the key or the env file; do not `cat` it). Open http://localhost:8787 in a clean browser profile.
2. Photos: use the CC0 portraits in `demo/` (`demo/retake_4.jpg` + `demo/retake_5.jpg` for baseline; `demo/retake_6.jpg` + `demo/retake_7.jpg` for the follow-up = "nothing changed"; `demo/worse_0.jpg` + `demo/worse_1.jpg` = redder follow-up). Never the author's face. Budget: each live run is 4 photos, about 56 units; plan 3 takes (about 170 units; about 580 remain after the study).
3. Screen recorder: QuickTime (File, New Screen Recording) or the browser's built-in capture. Record the narration separately, in a human voice (author or a natural TTS), 12 words per sentence max, no idioms.

## Shots
| Time | On screen (real capture) | Narration (plain English) |
|---|---|---|
| 0:00-0:10 | Hosted demo top, the stats card, cursor rests on the 20.1% figure | "In our test, a skin tracker that trusts every small move claimed a change that never happened one time in five." |
| 0:10-0:20 | Slow scroll to "Our internal test" note (simulated retakes, 5 faces) | "That test used real YouCam scores on simulated retakes of five public photos. SkinProof puts an error bar on the score." |
| 0:20-1:05 | **LIVE.** localhost:8787: type a product name, tick the consent box, pick 2 baseline photos from disk (file picker visible, previews appear), click Analyse, **real spinner for the whole wait (if sped up, show "4x" on screen)**, baseline saved | "Two photos taken back to back. Each goes to YouCam Skin Analysis, 12 concerns. The gap between the two is the noise." |
| 1:05-1:35 | **LIVE.** Click Re-check, pick 2 follow-up photos, Judge it, results appear. Pause 3 s on a "No clear change" row. Cursor on the bar and the "Needs more than" line | "Nothing changed, so it says no clear change. That answer is a result, not an error." |
| 1:35-1:55 | Second live run (pre-recorded earlier, same capture style) with the redder follow-up, one row says "Score fell"; then the hosted demo's tab with the smoother simulated follow-up | "A real shift beyond the noise is reported. These follow-ups are simulated edits of a public-domain photo, not evidence about any product." |
| 1:55-2:15 | One diagram frame: Photo, /file, PUT, /task/skin-analysis, poll, raw_score, verdict (static is OK here, 4 s). Then terminal `npm test` for 3 s | "Upload, skin analysis task, poll, raw score. The key stays on the server. The decision rule is a tested function." |
| 2:15-2:30 | "What it will not claim" card, then URL card held 6 s: fujiken1016.github.io/skinproof and the repo | "Cosmetic tracking, not a medical device. Photos go to YouCam and SkinProof does not keep them. Try it at the link." |

## Must-haves checklist
- [ ] Live run: file picker, previews, real wait, results, in one continuous capture.
- [ ] Says "YouCam Skin Analysis API" aloud and shows the endpoint flow.
- [ ] Says "simulated" before or when the numbers appear.
- [ ] No API key, no env file, no author face, no personal name in frame (check the browser tab bar and bookmarks).
- [ ] URL on screen at least 6 s at the end; captions burned in, 28 characters per line, split at phrases.
- [ ] Social bonus cut (30 s): tag @YouCam API, include "Received API credits for sharing".
