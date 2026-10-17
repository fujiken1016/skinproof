# Handheld jitter protocol (no face, no API, no units)
Goal: check that the simulated retake jitter in `tools/make_demo_images.py` (zoom up to 3%, shift up to about 3%, exposure +-3%, noise, JPEG) covers real handheld jitter.
1. Pick a still, faceless subject with texture (a printed poster, a book cover, a plant). No people, no faces, no personal data.
2. Hold a phone at arm's length, same light, same spot. Take 30 photos one after another as you would take selfie retakes (re-frame each time; do not use a tripod).
3. Put the JPEGs in one folder and run `python3 tools/jitter_measure.py <folder>`.
4. Record max and 95th percentile of shift, zoom, rotation, brightness change. Fill the table in the README ("simulated range covers X% of real handheld jitter").
5. Pre-registered rule: if real zoom or shift p95 exceeds the simulated range, regenerate the simulated retakes with the larger range and rerun `tools/calibrate.mjs` (needs API units); report both results either way.
