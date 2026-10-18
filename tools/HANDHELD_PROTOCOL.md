# Handheld jitter protocol (no face, no API, no units)
Goal: check that the simulated retake jitter in `tools/make_demo_images.py` (zoom up to 3%, shift up to about 3%, exposure +-3%, noise, JPEG) covers real handheld jitter.
1. Pick a still, faceless subject with texture (a printed poster, a book cover, a plant). No people, no faces, no personal data.
2. Hold a phone at arm's length, same light, same spot. Take 30 photos one after another as you would take selfie retakes (re-frame each time; do not use a tripod).
3. Put the JPEGs in one folder and run `python3 tools/jitter_measure.py <folder>`.
4. Record max and 95th percentile of shift, zoom, rotation, brightness change. Fill the table in the README ("simulated range covers X% of real handheld jitter").
5. Pre-registered rule: if real zoom or shift p95 exceeds the simulated range, regenerate the simulated retakes with the larger range and rerun `tools/calibrate.mjs` (needs API units); report both results either way.

## Gate check (same session, no API)
6. Also take about 10 deliberately bad photos of the same subject (too dark, too bright, blurred by moving) and put them in a second folder.
7. `python3 tools/gate_eval.py <good_folder> <bad_folder>` prints how many good photos pass and how many bad photos are rejected by the same thresholds as `src/quality.js`. Report both numbers.

## Where to put the photos and what happens next
Put the 30 still-subject photos in `~/Desktop/claude/hackathons/youcam-2026/jitter_photos/` (bad ones in `jitter_photos/bad/`). Do not commit them. Then run:
`cd skinproof && python3 tools/jitter_measure.py ../jitter_photos` and `python3 tools/gate_eval.py ../jitter_photos ../jitter_photos/bad`, and paste the max and p95 lines into the README table and the DEVPOST Limits line.

## Result log
2026-10-18: 14 photos measured; real jitter exceeds the simulated range on every measure (see README table and `demo/jitter_measured.json`). Per the pre-registered rule, the wider-jitter rerun is pending API credits.
