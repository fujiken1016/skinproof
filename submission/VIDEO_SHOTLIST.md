# Video shot list (target 2:40, hard stop 3:00; YouTube public; no music with copyright, no third-party logos)
Record on a phone (target device) or Chrome DevTools phone view at 375px of the live server (`node server.js`, real key) or the hosted demo. Narration in English, add captions.

| Time | Shot | Say |
|---|---|---|
| 0:00-0:15 | Phone: hosted demo top. Zoom on "17.1%" stat | "Two photos of the same face, seconds apart, score differently. A tracker that trusts every wiggle cries wolf 17% of the time." |
| 0:15-0:35 | Scroll the problem card, then the scenario tabs | "Everyone asks: is this serum working? SkinProof answers that, or honestly says it can't tell." |
| 0:35-1:10 | Live server, real key: pick two photos for baseline, press Analyse (show spinner, real call) | "Two back-to-back photos. YouCam Skin Analysis scores 12 concerns. The gap between them is our noise floor." |
| 1:10-1:50 | Tab "Nothing changed": rows say No clear change. Linger. Then tab "Irritation": Redness = Worse. Then "Smoother": Moisture/Wrinkles Improved, Acne and Pores still No clear change | "Nothing changed, so it says so. A real red shift is caught. Acne moved 4 points but acne is jumpy, so we don't claim it." Say "follow-ups are simulated edits of a CC0 photo". |
| 1:50-2:15 | Slide or the "How the YouCam API is used" card; show a terminal with `npm test` (13 pass) | "File upload, skin-analysis task, poll, raw_score. Key stays on the server. The decision rule is a tested pure function." |
| 2:15-2:35 | "What it will not claim" card | "Cosmetic tracking, not a medical device. No diagnosis. Photos are never stored." |
| 2:35-2:45 | Title card with demo URL + repo | "SkinProof: an error bar for your skin score." |
Checklist: show the target device; say which YouCam API (Skin Analysis); mention units cost (about 14 per photo); no face of the author. For the social bonus: post a short cut, tag @YouCam API, include "Received API credits for sharing".
