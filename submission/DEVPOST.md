**Tagline:** An error bar for your skin score: YouCam Skin AI that says "no clear change yet" when that is the honest answer.

**What we measured:** with small simulated retake jitter (4 held-out faces), a rule that reports any 1-point move claimed a change that never happened 22.9% of the time on average; SkinProof's rule, 0.1%. **What we also measured:** real handheld jitter is several times larger than we simulated, so these two numbers are a best case, not a forecast. SkinProof's defence is that the bar is measured from your own two retakes, so it widens when your photos are less consistent. It makes no claim that any product works.

**YouCam API used:** Skin Analysis (SD, 12 concerns, `format: json`; 14 units per photo per the official docs).
**Try it:** keyless replay of real recorded results https://fujiken1016.github.io/skinproof/ , shop-page badge demo https://fujiken1016.github.io/skinproof/shop-demo/ , code https://github.com/fujiken1016/skinproof . Your own photos in about 2 minutes: clone, then `node server.js` (Node 22, no install; no key = MOCK scores so you can walk the whole flow; `YOUCAM_API_KEY=... node server.js` = live YouCam). Steps are in the README.
**Video:** https://youtu.be/zVjPz-tkBYE

| Demonstrated | Not demonstrated |
|---|---|
| Live YouCam flow end to end; real scores for 12 concerns | Real handheld retakes scored by the API (none of the public datasets we found had them; credits ran out) |
| False-alarm rates on simulated retakes, 4 held-out CC0 faces | Any effect of any product on real skin |
| Measured on real handheld photos, no API: framing jitter (14 photos of a still object) and quality-gate behaviour (14 normal, 10 bad photos) | Sales or return-rate impact (no primary skincare-specific source found, so none stated) |
| Verdict logic, quality checks, claims linter, shop badge, consent flow | |

## Quality of Idea
Right before you rebuy a serum you ask: is this actually working? One before/after selfie cannot answer that, because in our tests two photos of the same face already score differently. SkinProof takes two back-to-back photos at baseline and two at follow-up, measures the gap between the two retakes (the noise), and reports a score as risen or fallen only if the change exceeds twice that noise. Otherwise it says **"no clear change yet"**. If retakes disagree wildly it says it cannot judge.
Unlike a tracker that subtracts two scores, it will not report a difference smaller than its own noise. The noise differs by person and by score: with a fixed 3-point rule, acne was a false alarm 43.7% of the time on one face (the face the prior was fitted on; SkinProof 1.9%), and firmness 16.7% on the other faces (SkinProof 0%).

## Technological Implementation
- Flow: `POST /s2s/v2.0/file`, `PUT` to the pre-signed URL, `POST /s2s/v2.0/task/skin-analysis` (12 SD concerns), poll the task, read `raw_score`. The key stays on the server; the hosted page has no key.
- Quirks we hit and handle: `all`, `skin_age`, `resize_image` entries carry no `raw_score`; `error_large_face_angle`, `error_src_face_too_small`, `error_src_face_out_of_bound` reject photos (not charged).
- Pure, unit-tested decision logic (`verdict.js`, 29 tests across 3 files) plus a claims linter that fails the build on medical, ingredient or efficacy wording in all user-facing files; CI runs both.
- Internal noise test (real API scores, simulated retakes: shift, zoom, exposure, noise, JPEG; no rotation): one CC0 portrait (8 photos) plus 4 more CC0 faces as held-out faces. The face is the unit. Per held-out face:

| Held-out face | Photos | 1-point rule | 3-point rule | SkinProof |
|---|---|---|---|---|
| 1 | 5 | 26.1% | 4.4% | 0.6% |
| 2 | 4 | 27.8% | 0% | 0% |
| 3 | 6 | 23.1% | 3.0% | 0% |
| 4 | 6 | 14.6% | 0.6% | 0% |
| Average | | 22.9% | 2.0% | 0.1% |

  n = 4 faces, so the range is the honest summary; do not read 0.1% as a rate. On the face the prior was fitted on: 17.1%, 8.1%, 0.4% (in-sample). A CC BY 4.0 research set added a secondary check, reported in the README only.
- What if noise were larger? A hypothetical scaling of the observed score deviations (not a measurement; `tools/noise_scaling.mjs`): at 3x noise the 1-point rule's false alarms rise to 46.5%, the 3-point rule's to 22.9%, SkinProof's to 2.0%; at 10x, 68.3%, 48.7%, 3.5%. A Gaussian simulation agrees on the structure: SkinProof also degrades with noise (5.6% at SD 4) but much more slowly, because its bar grows with the retake gap.
- Pores, a decision we made: pores now get a higher minimum noise (3 points instead of 2; `tools/pores_tradeoff.mjs`): on the fitted face, pore false alarms fell from 6.7% to 2.4%, at the cost of some power (a red-cast shift of 4.7 pore points is now "close to the line").
- Quality checks (`src/quality.js`, pure functions, tested). Size and exposure are checked in the browser before a photo is sent, but real failed photos usually pass these because phone auto-exposure corrects them: on 10 deliberately bad phone photos the shipped absolute gate rejected 0 of 10 (and passed 14 of 14 normal photos). A within-session sharpness ratio (one photo under 0.6 of its pair's sharpness) catches about 5 of 10 bad photos with 0 of 14 good ones flagged (thresholds chosen on half the photos, tested on the other half). A translation check warns when the two photos of a pair are framed very differently (unit-tested on synthetic images, not yet validated on real photos). Verdicts also carry a confidence tier (confident, borderline, clearly inside noise, cannot judge).
- Cost: one check is 4 photos = 56 units (14 per photo). 43 successful analyses (about 600 units) went into the whole project.

## Design
One flow: consent, two photos, baseline, re-check, verdict. "No clear change" is a designed result, not an error. Verdicts use icons and text, not colour alone; 48px targets; 375px layout; dark mode. A shop-page badge shows the same logic as an embeddable widget, with a specification page for a shop's reviewer (three states, wording rules).

## Potential Impact
**Who:** a shopper about to rebuy a skincare product, and the shop that shows before/after photos.
**Two readers, both illustrative (not real people):** Mina, three weeks into a serum with one before and one after photo; she takes two photos now and two more in the same light, SkinProof says "No clear change beyond noise. Re-check in two weeks", and she waits instead of rebuying on a hunch. And a shop's compliance reviewer who must decide whether a before/after image can sit next to a product; the badge gives a number with its noise attached. No expert has reviewed SkinProof; we quote nobody.
**Why shops care:** advertising regulators already ask before/after images to be honest. The UK ASA says advertisers should hold proof that before-and-after photos are genuine and have not been manipulated, and the photos should not exaggerate the efficacy of the product (https://www.asa.org.uk/advice-online/before-and-after-photos.html, opened 2026-10-18). The US FTC says that when endorsers' results are atypical, the ad must make clear what results are generally expected (https://consumer.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking). Japan's Consumer Affairs Agency covers misleading quality claims and substantiation (https://www.caa.go.jp/policies/policy/representation/fair_labeling/representation_regulation; no explicit mention of before/after photos, so a general principle).

| Regulator idea | What SkinProof does |
|---|---|
| Photos genuine, not manipulated (ASA) | Measures the photos you give it; it does not detect manipulation |
| Show what results to expect (FTC) | Reports whether a score change is beyond measurement noise; the badge never says a product works |
| Do not exaggerate efficacy (ASA) | Banned words are enforced by a build-time linter |

Perfect Corp's own page says its Skin Analysis scores 15 skin metrics on a 0-100 scale (https://www.perfectcorp.com/business/products/ai-skin-analysis); SkinProof uses 12. Cost for a shop: one badge = 4 photos = 56 units (the USD price per unit is not stated in the docs we could read, so we state units only).

## Limits (read these)
- Cosmetic self-tracking, not a medical device; it cannot diagnose. Photos are sent to YouCam (Perfect Corp) for analysis; SkinProof does not store them; YouCam's retention follows its own policy; the app asks for consent first.
- Simulated retakes only for the false-alarm figures. Real handheld jitter, measured on 14 photos of a still object (no API, numbers only):

| Measure | Simulated | Real handheld, vs first photo (p95) | vs previous photo (p95) |
|---|---|---|---|
| Shift (% of width) | about 3 | 24 | 30 |
| Zoom (%) | 3 | 23 | 15 |
| Rotation (degrees) | 0 | 5 | 10 |
| Brightness (%) | 3 | 8 | 12 |

  So real noise is probably larger than simulated and the figures above may not carry over; we could not convert this into an error rate without new API credits (within the simulated range the scores did not track the jitter). One object, one phone, one feature-matching method. Retakes at wider jitter are pre-generated for when credits arrive.
- No public dataset with real same-session retakes under a commercial-and-research license qualified (London Set, Chicago, FEI, CaNAFF, MUCT, Caltech, Wikimedia Commons and others checked). Our own face photos were deliberately not used.
- Demo follow-ups are simulated edits of a CC0 photo and imply nothing about the person shown. The demo's two photo sets were taken on the same day; the screen says so. A real follow-up should wait two weeks or more. The gate scene in the video uses synthetic dark and blurry photos.
- Fairness: the 8 faces we scored are not a representative sample of skin tones or ages and we did not label skin tones, so the noise prior may not transfer. The bar is measured per person (your own retake gap always counts and can only raise the bar). Skin Tone Analysis is not used.
- Review: a 3-question review request for a skincare professional is prepared (`tools/EXPERT_REVIEW_QUESTIONS.md`); none has been received.

## Next, and why it is not here
- Re-running the study at the measured, wider jitter and Skin Tone Analysis: not here because the free API credits ran out; the wider retakes are generated and waiting.
- Real handheld retakes with consented volunteers: not here because it needs consent and time.

Built with: YouCam Skin Analysis API, Node 22 (no dependencies), vanilla JS, GitHub Pages. Photo credits in `demo/CREDITS.md`.
