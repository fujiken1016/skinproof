**Tagline:** An error bar for your skin score: YouCam Skin AI that says "no clear change yet" when that is the honest answer.

**In one line:** In our internal test (real YouCam scores on simulated retakes), a rule that reports any 1-point move claimed a change that never happened about 1 time in 5; SkinProof's rule did so 0.1% to 0.9% of the time on faces it was not fitted on. Limits are listed below. SkinProof makes no claim that any product works.

**YouCam API used:** Skin Analysis (SD, 12 concerns, `format: json`; 14 units per photo per the official docs).
**Try it:** keyless replay of real recorded results https://fujiken1016.github.io/skinproof/ , shop-page badge demo https://fujiken1016.github.io/skinproof/shop-demo/ , code https://github.com/fujiken1016/skinproof . Your own photos in about 2 minutes: clone, then `node server.js` (Node 22, no install; no key = MOCK scores so you can walk the whole flow; `YOUCAM_API_KEY=... node server.js` = live YouCam). Steps are in the README.
**Video:** <YouTube URL: TODO, filled in by the author before submitting>

## Quality of Idea
Right before you rebuy a serum you ask: is this actually working? One before/after selfie cannot answer that, because in our tests two photos of the same face already score differently. SkinProof takes two back-to-back photos at baseline and two at follow-up, measures the gap between the two retakes (the noise), and reports a score as risen or fallen only if the change exceeds twice that noise. Otherwise it says **"no clear change yet"**. If retakes disagree wildly it says it cannot judge.
Unlike a tracker that subtracts two scores, it will not report a difference smaller than its own noise. And the noise is not the same for everyone: with a fixed 3-point rule, acne was a false alarm 43.7% of the time on one face (SkinProof 1.9%), and firmness 16.7% on the other faces (SkinProof 0%). The jumpy score differs by person, so the bar has to be measured per person and per score.

## Technological Implementation
- Flow: `POST /s2s/v2.0/file`, `PUT` to the pre-signed URL, `POST /s2s/v2.0/task/skin-analysis` (12 SD concerns), poll the task, read `raw_score`. The key stays on the server; the hosted page has no key.
- Quirks we hit and handle: `all`, `skin_age`, `resize_image` entries carry no `raw_score`; `error_large_face_angle`, `error_src_face_too_small`, `error_src_face_out_of_bound` reject photos (not charged), so the app guides framing.
- Pure, unit-tested decision logic (`verdict.js`, 18 tests) plus a claims linter that fails the build on medical, ingredient or efficacy wording in all user-facing files; CI runs both.
- Internal noise test: 8 real-API scored photos of one CC0 portrait plus 4 more CC0 portraits plus 3 people from a CC BY 4.0 research set (Face Research Lab London Set, 3 faces fully held out, scores only). "Retakes" are simulated (shift, zoom, exposure, noise, JPEG). On the 4 CC0 held-out faces (1,296 no-change comparisons): any-1-point rule 20.1%, 3-point rule 2.1%, SkinProof 0.1%. On the 3 London faces (108 comparisons, shipped rule): 21.3%, 2.8%, 0.9%. In-sample on the first face: 17.1%, 8.1%, 0.4%. Five to eight people and simulated retakes: read it as "much lower false alarms in our test", not an accuracy claim.
- Cost: one check is 4 photos = 56 units (14 per photo). 43 successful analyses (about 600 units) went into the whole project.

## Design
One flow: consent, two photos, baseline, re-check, verdict. "No clear change" is a designed result, not an error. Verdicts use icons and text, not colour alone; 48px targets; 375px layout; dark mode. A shop-page badge shows the same logic as an embeddable widget.

## Potential Impact
**Who:** a shopper about to rebuy a skincare product, and the shop that shows before/after photos.
**A use scene (illustrative, not a real person):** Mina has used a serum for three weeks and has one before photo and one after photo. They look slightly different, and the shop's page shows a dramatic before/after. She takes two photos now and two more in the same light. SkinProof says: "No clear change beyond noise. Re-check in two weeks." She waits instead of rebuying on a hunch.
**Why shops care:** advertising regulators already ask before/after images to be genuine and representative. The UK ASA/CAP says before-and-after photos must be genuine, unmanipulated and reflect realistically achievable results (https://www.asa.org.uk/advice-online/before-and-after-photos.html, opened 2026-10-17). The US FTC says that when shown results are atypical, the ad must make clear what results are generally expected (https://consumer.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking). Japan's Consumer Affairs Agency covers misleading quality claims and substantiation (https://www.caa.go.jp/policies/policy/representation/fair_labeling/representation_regulation). A measured "this change is beyond noise" or "it is not" is a way to describe a before/after honestly; the demo badge (https://fujiken1016.github.io/skinproof/shop-demo/) is about 10 lines to embed. Perfect Corp itself positions Skin Analysis as measurable scores that help online shoppers choose products (https://www.perfectcorp.com/business/products/ai-skin-analysis).
**What is demonstrated and what is not:**
| Demonstrated | Not demonstrated |
|---|---|
| Live YouCam flow end to end; real scores for 12 concerns | Real handheld retakes by volunteers |
| False-alarm rates on simulated retakes, 8 faces, 3 held out and CC BY licensed | Any effect of any product on real skin |
| Verdict logic, claims linter, shop badge, consent flow | Sales or return-rate impact (we found no primary skincare-specific return-rate source, so we state none) |
**Cost for a shop:** one badge = 4 photos = 56 units at 14 per photo (the USD price per unit is on Perfect Corp's pricing page, which we could not read automatically, so we state units only).

## Limits (read these)
- Cosmetic self-tracking, not a medical device; it cannot diagnose. Photos are sent to YouCam (Perfect Corp) for analysis; SkinProof does not store them; YouCam's retention follows its own policy; the app asks for consent first.
- Simulated retakes only. We searched for a public dataset with real same-session retakes of the same person under a license that allows commercial and research use (Face Research Lab London Set, Chicago Face Database, FEI, CaNAFF, MUCT, Caltech Faces, Wikimedia Commons and others). None qualified: the only clearly licensed one (London Set, CC BY 4.0) has one neutral photo per person, and the rest are research-only or unverifiable. Our own face photos were deliberately not used. Real handheld retakes remain untested.
- Demo follow-ups are simulated edits of a CC0 photo and imply nothing about the person shown. Only 5 CC0 faces and 3 London Set faces were scored; the London images are not redistributed.
- The noise prior is a rough guide fitted on simulated retakes; your own retake gap always counts.

## Not built yet
Skin Tone Analysis to widen the noise bar in hard light; a study with consented real retakes.

Built with: YouCam Skin Analysis API, Node 22 (no dependencies), vanilla JS, GitHub Pages. Photo credits in `demo/CREDITS.md`.
