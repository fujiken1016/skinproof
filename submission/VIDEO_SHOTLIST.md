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

## R2 changes for the video owner
- Phone column: make the browser capture fill the full frame height (about 1000px wide, zoom 140%); add a 4-second zoom-in on the "Redness: Score fell" row and on the Acne row.
- Acne beat (slow, 4 to 5 s, show the grey noise band with the tick inside it): "Acne moved four points. On this face acne wanders by more than that, so SkinProof says: no clear change."
- Replace "jumpy" with "noisy". Pauses of 0.8 s before "No clear change" and "Beyond the noise". Listen through once and rewrite any stiff sentence.
- Add 10 s after the live runs: use scene ("Mina, three weeks in, one before and one after photo; SkinProof says no clear change, re-check in two weeks"; mark it "illustrative") and the shop badge page (`/shop-demo/`): "A shop can show the same measurement next to its before/after photos."
- Say "recorded in a second take" over the follow-up. Captions 2 lines of 28 characters. URL card held 6 to 8 s.

## Must-haves checklist
- [ ] Live run: file picker, previews, real wait, results, in one continuous capture.
- [ ] Says "YouCam Skin Analysis API" aloud and shows the endpoint flow.
- [ ] Says "simulated" before or when the numbers appear.
- [ ] No API key, no env file, no author face, no personal name in frame (check the browser tab bar and bookmarks).
- [ ] URL on screen at least 6 s at the end; captions burned in, 28 characters per line, split at phrases.
- [ ] Social bonus cut (30 s): tag @YouCam API, include "Received API credits for sharing".

## Copied from winners' videos (reviews/ROLE_MODELS_VIDEO2.md, opened 2026-10-17)
Open on a concrete problem line within 2 s; burned-in captions with one big headline per scene; show the live app plus real API steps; end card 8 to 10 s with tagline, QR codes (demo / repo) and readable URLs; same links and chapter timestamps in the YouTube description; show the YouCam credit early; 2:20 to 3:00 is the winners' range.

## R3 list for the video owner (edits only, no API credit needed)
1. Pores beat: over the red-cast scene say "Redness fell far beyond the noise. Pores moved too, because a red cast changes how pores read. Both are measurement changes, not skin claims." (app note matches).
2. "0 days": the same-day demo now reads "same-day demo run"; add an on-screen chip "TIME SKIP: 3 weeks later (illustrative)" at the cut, keep the voice "Weeks later" only after the chip.
3. Numbers on screen: use the per-face averages 22.9% / 2.0% / 0.1% (4 held-out CC0 faces), not 20.1% and not "1,296". Say "on average per face".
4. Regulator wording (if shown): ASA says photos should be genuine and not manipulated, and should not exaggerate the efficacy. Do not say "realistically achievable".
5. End card 8 to 10 s with two QR codes (demo, GitHub) plus readable URLs; add the shop badge page for 6 s before it (replace part of the Mina card, keep Mina to 8 s, three short sentences).
6. Voice: someone listens through once. Say "Acne varies more than that on this face". Pause 0.8 s before "No clear change".
7. Captions: split at phrases; fix the double space in "so it says  no clear change". Voice "Second take: real YouCam scores, simulated follow-up photos" and add the chip "recorded earlier".
8. Show the photo preview appearing right after selection (one keyframe).

## R4 list for the video owner (edits and short captures, no API credit needed)
1. Quality gate demo (5 to 6 s, new): run `node server.js` (MOCK is fine, the gate runs in the browser), pick a dark photo and a blurred photo; "Too dark" and "Looks blurry" appear and nothing is sent. On screen: "no API call: the gate runs in the browser". Voice: "Before anything is sent, a quality gate rejects dark or blurry photos, so units are not wasted."
2. Second reader (6 to 8 s, new, replaces part of the Mina card): the shop-demo badge plus the 3-row regulator table, chip "ILLUSTRATIVE". Voice: "A shop's compliance reviewer sees one number with its noise attached." Mina shrinks to 8 s.
3. Fewer still frames in the last 45 s: in the shop demo, show the cursor pressing Set 1 then Set 2 and hold the two badge states for 2 s each; heading "Badge: 2 of 12 beyond noise"; scroll so the tile is not cut at the eyes.
4. Pores (changed): in the red-cast scene only Redness is a verdict now; Pores is "No clear change (close to the line)". Voice: "Redness fell far beyond the noise. Pores moved too, because a red cast changes how pores read, but not enough to call." Regenerate that audio line only.
5. Numbers: 22.9% and 0.1% average per held-out face (4 faces); merge the "Four held-out faces" card into the number card and hold 3 s.
6. Voice: a person listens once; add `|0.8|` pauses before "no clear change" and "beyond the noise"; or record a human voice and replace `audio.wav`.
7. Overlaps: move the TIME SKIP chip away from the "4x speed" chip; keep the "All tests pass" caption off the last line of the terminal; show a photo preview appearing right after a file is chosen.
8. Test count if shown: 25.
