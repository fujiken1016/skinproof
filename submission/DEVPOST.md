**Tagline:** An error bar for your skin score: YouCam Skin AI that says "no clear change yet" when that is the honest answer.

**In one line:** Average per held-out face, a rule that reports any 1-point move claims a change that never happened 22.9% of the time; SkinProof's rule, 0.1%. Simulated retakes, 4 faces, details in the tables and limits. SkinProof makes no claim that any product works.

**YouCam API used:** Skin Analysis (SD, 12 concerns, `format: json`; 14 units per photo per the official docs).
**Try it:** keyless replay of real recorded results https://fujiken1016.github.io/skinproof/ , shop-page badge demo https://fujiken1016.github.io/skinproof/shop-demo/ , code https://github.com/fujiken1016/skinproof . Your own photos in about 2 minutes: clone, then `node server.js` (Node 22, no install; no key = MOCK scores so you can walk the whole flow; `YOUCAM_API_KEY=... node server.js` = live YouCam). Steps are in the README.
**Video:** https://youtu.be/zVjPz-tkBYE

| Demonstrated | Not demonstrated |
|---|---|
| Live YouCam flow end to end; real scores for 12 concerns | Real handheld retakes (none of the public datasets we found had them; protocol and measurement script are in `tools/`) |
| False-alarm rates on simulated retakes, 4 held-out CC0 faces (plus 3 London Set faces as a supplement) | Any effect of any product on real skin |
| Verdict logic, quality gate, claims linter, shop badge, consent flow | Sales or return-rate impact (no primary skincare-specific source found, so none stated) |

## Quality of Idea
Right before you rebuy a serum you ask: is this actually working? One before/after selfie cannot answer that, because in our tests two photos of the same face already score differently. SkinProof takes two back-to-back photos at baseline and two at follow-up, measures the gap between the two retakes (the noise), and reports a score as risen or fallen only if the change exceeds twice that noise. Otherwise it says **"no clear change yet"**. If retakes disagree wildly it says it cannot judge.
Unlike a tracker that subtracts two scores, it will not report a difference smaller than its own noise. And the noise is not the same for everyone: with a fixed 3-point rule, acne was a false alarm 43.7% of the time on one face (the face the prior was fitted on; SkinProof 1.9%), and firmness 16.7% on the other faces (SkinProof 0%). The jumpy score differs by person, so the bar has to be measured per person and per score.

## Technological Implementation
- Flow: `POST /s2s/v2.0/file`, `PUT` to the pre-signed URL, `POST /s2s/v2.0/task/skin-analysis` (12 SD concerns), poll the task, read `raw_score`. The key stays on the server; the hosted page has no key.
- Quirks we hit and handle: `all`, `skin_age`, `resize_image` entries carry no `raw_score`; `error_large_face_angle`, `error_src_face_too_small`, `error_src_face_out_of_bound` reject photos (not charged), so the app guides framing.
- Pure, unit-tested decision logic (`verdict.js`, 25 tests across 3 files) plus a claims linter that fails the build on medical, ingredient or efficacy wording in all user-facing files; CI runs both.
- Internal noise test: real-API scores of one CC0 portrait (8 photos) plus 4 more CC0 portraits as held-out faces. "Retakes" are simulated (shift, zoom, exposure, noise, JPEG; no rotation or perspective change). The face, not the comparison, is the unit (comparisons inside a face overlap). Per held-out CC0 face, average (range): any-1-point rule 22.9% (14.6 to 27.8), 3-point rule 2.0% (0 to 4.4), SkinProof 0.1% (0 to 0.6). Adding 3 people from a CC BY 4.0 research set as a secondary supplement (7 faces, bootstrap over faces): 22.2% (17.3 to 27.2), 2.3% (0.9 to 3.9), 0.5% (0 to 1.3). On the face the prior was fitted on: 17.1%, 8.1%, 0.4% (in-sample). Seven or eight people and simulated retakes: read it as "much lower false alarms in our test", not an accuracy claim.
- Pores, a decision we made: pores had the highest false-alarm rate, so pores now get a higher minimum noise (3 points instead of 2; `tools/pores_tradeoff.mjs`). On the fitted face pore false alarms fell from 6.7% to 2.4% (0% on the other faces either way). The cost is power: a red-cast shift of 4.7 pore points, which was a verdict before, is now shown as "close to the line". In the red-cast demo only Redness gets a verdict; Pores moves too (a colour cast changes how pores read) but stays below it.
- Quality gate (`src/quality.js`, pure function, tested): checks size, exposure and blur in the browser before a photo is sent, saving units. Verdicts also carry a margin and a confidence tier (confident, borderline, clearly inside noise, cannot judge); borderline rows show "close to the line".
- Cost: one check is 4 photos = 56 units (14 per photo). 43 successful analyses (about 600 units) went into the whole project.

## Design
One flow: consent, two photos, baseline, re-check, verdict. "No clear change" is a designed result, not an error. Verdicts use icons and text, not colour alone; 48px targets; 375px layout; dark mode. A shop-page badge shows the same logic as an embeddable widget.

## Potential Impact
**Who:** a shopper about to rebuy a skincare product, and the shop that shows before/after photos.
**A use scene (illustrative, not a real person):** Mina has used a serum for three weeks and has one before photo and one after photo. They look slightly different, and the shop's page shows a dramatic before/after. She takes two photos now and two more in the same light. SkinProof says: "No clear change beyond noise. Re-check in two weeks." She waits instead of rebuying on a hunch.
**Why shops care:** advertising regulators already ask before/after images to be honest. The UK ASA says advertisers should hold proof that before-and-after photos are genuine and have not been manipulated, and the photos should not exaggerate the efficacy of the product; it cites a ruling where the advertiser lacked evidence that the images were representative of the effect consumers could likely expect (https://www.asa.org.uk/advice-online/before-and-after-photos.html, opened 2026-10-18). The US FTC says that when endorsers' results are atypical, the ad must make clear what results are generally expected (https://consumer.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking). Japan's Consumer Affairs Agency covers misleading quality claims and substantiation (https://www.caa.go.jp/policies/policy/representation/fair_labeling/representation_regulation; it does not name before/after photos, so this is a general principle).

| Regulator idea | What SkinProof does |
|---|---|
| Photos genuine, not manipulated (ASA) | Works on the photos you give it and measures them; it does not detect manipulation, and says nothing about whether a photo is genuine |
| Show what results to expect (FTC) | Reports whether a score change is beyond measurement noise; the badge never says a product works |
| Do not exaggerate efficacy (ASA) | Banned words are enforced by a build-time linter |

**Two readers, both illustrative (not real people):** a shopper, Mina, three weeks into a serum with one before and one after photo; and a shop's compliance reviewer who has to decide whether a before/after image can sit next to a product. The badge gives the reviewer a number with its noise attached. No expert has reviewed SkinProof; we have not quoted one. Perfect Corp's own page says its Skin Analysis scores 15 skin metrics on a 0-100 scale (https://www.perfectcorp.com/business/products/ai-skin-analysis); SkinProof uses 12 of them. The demo badge (https://fujiken1016.github.io/skinproof/shop-demo/) is about 10 lines to embed.
**Cost for a shop:** one badge = 4 photos = 56 units at 14 per photo (the USD price per unit is on Perfect Corp's pricing page, which we could not read automatically, so we state units only).

## Limits (read these)
- Cosmetic self-tracking, not a medical device; it cannot diagnose. Photos are sent to YouCam (Perfect Corp) for analysis; SkinProof does not store them; YouCam's retention follows its own policy; the app asks for consent first.
- Simulated retakes only. We searched for a public dataset with real same-session retakes of the same person under a license that allows commercial and research use (Face Research Lab London Set, Chicago Face Database, FEI, CaNAFF, MUCT, Caltech Faces, Wikimedia Commons and others). None qualified: the only clearly licensed one (London Set, CC BY 4.0) has one neutral photo per person, and the rest are research-only or unverifiable. Our own face photos were deliberately not used. Real handheld retakes remain untested; the protocol (`tools/HANDHELD_PROTOCOL.md`) and measurement script (`tools/jitter_measure.py`) are ready, need no face and no API credit, and the script is verified on our simulated retakes.
- Demo follow-ups are simulated edits of a CC0 photo and imply nothing about the person shown. London Set faces (CC BY 4.0) were sent to YouCam for scoring and are not redistributed; the participants' consent text covers research and media use, which may be narrower than a commercial API call, so these results are secondary and the headline numbers use CC0 faces only.
- The demo's baseline and follow-up photos were taken on the same day; the screen says so. A real follow-up should wait two weeks or more.
- Fairness: the 8 faces are not a representative sample of skin tones or ages, so the noise prior may not transfer; we did not label skin tones. The bar is measured per person (your own retake gap always counts and can only raise the bar). Skin Tone Analysis is not used.
- Review: we prepared a 3-question review request for a skincare professional (`tools/EXPERT_REVIEW_QUESTIONS.md`); none has been received, and we quote nobody.
- The noise prior is a rough guide fitted on simulated retakes; your own retake gap always counts.

## Next, and why it is not here
- Skin Tone Analysis to widen the bar in hard light: not built because the free API credits were used up on the validation study; the browser quality gate (exposure, blur, size) is the credit-free step in that direction.
- Real handheld retakes with consented volunteers: not done because it needs consent and time; instead a faceless handheld-jitter measurement (`tools/HANDHELD_PROTOCOL.md`, `tools/jitter_measure.py`, `tools/gate_eval.py`) checks whether our simulated jitter covers real jitter. Result: not measured yet.

Built with: YouCam Skin Analysis API, Node 22 (no dependencies), vanilla JS, GitHub Pages. Photo credits in `demo/CREDITS.md`.
