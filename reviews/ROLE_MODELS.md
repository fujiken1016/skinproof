# SkinProof - Role models (pakuru research)
Opened: 2026-10-17. Pages marked "failed" could not be read. Demo videos were NOT watched (only page text), so video-format notes are inferred from rules/page text, not observed.

## 0. This hackathon (rules + judging) - READ
- https://youcam-api-skin-ai-ecommerce.devpost.com/ (opened 2026-10-17, via Chrome; WebFetch got 403)
- https://youcam-api-skin-ai-ecommerce.devpost.com/rules (opened 2026-10-17)
- https://youcam-api-skin-ai-ecommerce.devpost.com/project-gallery: opened, "gallery not published yet" (no round-two entries visible).
Facts:
- Submission 2026-09-29 to 2026-11-02 11:45 ET. Judging to 11-20. Winners ~11-24.
- Required: working web/mobile app using >=1 YouCam API; repo URL (public, or private shared with contact_event@PerfectCorp.com); text description; **1-3 min demo video, judges need not watch past 3:00; must explain the YouCam API used; must show the project running on its target device; YouTube preferred; no third-party trademarks / copyrighted music**; free access for judges until judging ends; exit interview if winner. English only.
- Stage 1 pass/fail: fits theme + reasonably applies the API. Stage 2: four EQUAL criteria:
  1. Technological Implementation: how thoroughly/skillfully the API is integrated; clear consumer/eCommerce value; "genuine effort, non-trivial" code.
  2. Design: "complete, coherent product experience, not just a technical proof of concept".
  3. Potential Impact: "credible, specific case for solving a real problem for a real audience", and the solution actually addresses it "based on what's demonstrated".
  4. Quality of Idea: creative, non-obvious API use + "genuine understanding of the problem space".
- Tie-break goes to the highest score in criterion order (Technology first).
- Brief text: Skin AI track = "wonder right before a purchase, after a breakout, or standing at the mirror deciding whether a product is working... help users know exactly what to do next". "Not surface-level wrappers." Agentic AI workflows welcomed.
- Prizes: $2,500 / $1,000 / $500 + Women in Tech $1,000 + Rising Star (student) $1,000. Social-share bonus 500 API units (tag @YouCam API, say which API, disclosure "Received API credits for sharing", form by deadline).
- NOTE for SkinProof: "whether a product is working" is literally the Skin AI track wording; SkinProof's noise-floor idea answers it directly.

## 1. Round-one 1st place: Aloud
- https://devpost.com/software/aloud-lxqr70 (opened 2026-10-17). Badge on page: "WINNER 1st Place Winner" in the round-one hackathon (YouCam API Skin AI & Apparel VTO).
- Press release (round-one recap incl. 1,280 registrants / 238 submissions): https://www.webull.com/news/15740848956318720 (opened 2026-10-17).
What it does: voice-first beauty assistant for blind/low-vision shoppers: barcode scan by sound, ingredient/allergen Q&A, selfie skin read (YouCam Skin Analysis + Skin Tone Analysis), "Verify" flow comparing post-makeup capture with session's bare-skin scores.
Why it wins (from the page):
- Impact framing in retail/legal terms with numbers: 8.5M US blind/low-vision, ADA suits, EU Accessibility Act, named lawsuits; and "Perfect Corp's own site has no accessibility statement" - i.e. it finds a gap in the sponsor's own business.
- Page is organised on the judging criteria: heading literally "How we used the YouCam API (Technological Implementation)", plus "Impact". Judges can score by scrolling.
- API shown precisely: exact endpoints (register file -> upload to presigned URL -> create task -> poll), tier (12-unit, 7 concerns), fixtures captured from real API runs, key stays server-side. Also used the YouCam MCP server.
- Honesty engineered: a CI "claim linter" blocks medical/treatment language; every spoken skin statement traces to a ui_score; uncertainty stated aloud; confidence lowered on dark skin tones / low light (disclosing its own bias); nothing stored; consent before camera.
- Measured proof: "kill experiment" - 10/10 iPhone scans accepted, all <30 s.
- Many deployment surfaces: live web URL, TestFlight, APK, repo.
Avoid: sprawling scope (4 flows + voice + MCP) - only copy if SkinProof stays crisp.

## 2. Round-one placing (3rd-5th, per its page): ConfidFit
- https://devpost.com/software/confidfit (opened 2026-10-17). Badge: "WINNER 3rd-5th Place Winner".
What: Shopify app; apparel VTO (cloth-v3) behind a product-page button; merchant billing, analytics.
Why it works: real shipped product (Shopify App Store link, marketing site); "Honest Label: visual preview only, not a fit guarantee"; explicit anti-overclaim lesson ("No 'perfect fit', no invented conversion percentages. Judges and merchants both notice when the copy overclaims"); analytics "refuse fake lift when sample sizes are too small" (same spirit as SkinProof's noise floor); API key never in browser; lists what blocked it (App Proxy auth, long async tasks, pose detection rejects synthetic test squares - use real person photos).
Avoid: private repo only (judges must be added) - SkinProof should use a public repo.

## 3. Round-one entry: ToneGrid (placement not shown on page text I read)
- https://devpost.com/software/tonegrid (opened 2026-10-17). Page text showed "SUBMITTED TO" only, no winner badge in extracted text.
What: skin/lip/hair/eye colour -> scores a 24-SKU catalogue; merchant view scores catalogue vs 18 population segments ("2.8x assortment gap"; same dress 98 vs 29 across six complexions).
Why it works: states the thesis in one number on the landing page; deterministic colour-science engine (CIELAB/CIEDE2000) - "the differentiator isn't the wrapper"; 5 YouCam APIs all live-tested; Demo Mode with no signup; candid "nearly shipped a too-generous scoring model (median 72) - tightened to 55 so it discriminates"; consumer + merchant inversion of the same engine.
Avoid: docs-vs-live mismatch costs (their docs for 2 APIs were wrong - test endpoints early; they recovered via API validation errors and Playground sample code).

## 4. Round-one entry (skin tracker, closest to SkinProof): TintKin
- https://devpost.com/software/tintkin-ai-skin-analysis-and-wellness-journey (opened 2026-10-17). Placement: none shown.
What: skin journal, radar charts of YouCam scores over time, "What-If" simulation, AI regimen (Qwen), admin console.
Takeaways: this is the obvious competing pattern (track scores over time). It plots raw scores with no uncertainty - SkinProof's differentiator. Cautions: unzip/normalise YouCam responses that can be flat JSON or zip with score_info.json; server-side face crop needed for strict alignment rules. Weakness to avoid: broad feature list (auth, admin, Mongo) with no claim about whether change is real.

## 5. Round-one recap (winners list)
- https://www.perfectcorp.com/business/news/hackathon-2026-perfect-corp (opened 2026-10-17) - this is the earlier DeveloperWeek hackathon page, no winners; used only for the API list, "1-3 minute end-to-end demo video" convention and 1,000 free units.
- Winners named in the recap (via the Webull press release): Aloud (1st), ShadeSpan (2nd; "14.3% of garments pass on all six tones"), CASTING (8 people, ~28 s, four APIs), KeepMe (user-approved edit scope), ConfidFit. ShadeSpan/CASTING/KeepMe Devpost pages: not opened (failed: search did not return their URLs). Pattern across winners: **each leads with one hard, measured number and a statement of what the tool will NOT claim.**

## 6. Traction apps
### SkinVision
- https://www.skinvision.com/ (opened 2026-10-17). https://www.skinvision.com/how-it-works/ -> 404 (failed).
What: mole/spot risk check, photo -> risk result + "when to see a doctor"; body map to track each spot over time; reminders; dermatologist panel reviews uncertain cases; insurer partnerships.
Why it works: one-line promise ("Accurate skin cancer detection made simple"), proof numbers on first screen (3M+ users, 5M+ checks - company claim), 4-step story (scan, dermatologists, next step, track changes), "Not to replace your doctor, but to support your decision" framing, customer stories, tiered pricing (single check EUR 6.99 / 3 mo / 12 mo), clinical-validation badge. Key idea: output is an ACTION ("see a doctor within 4 weeks"), not a score.
Avoid: medical claims. SkinVision is a regulated device; SkinProof must stay cosmetic ("no clear change"), no diagnosis.
Third-party summary (search result, secondary): SkinVision's 95% sensitivity / 78% specificity figure comes from one study of an older version - do not quote accuracy numbers we cannot source.

### Cureskin
- https://www.cureskin.com/ (opened 2026-10-17; redirects to cureskin.com).
What: dermatologist-led skin/hair treatment in India; AI photo-based diagnosis; doctor monitors progress via monthly photos.
Why it works: proof stack on first screen (98% see results - company claim with asterisk, 83.8K reviews 4.5 stars), journey-over-time stories ("Each week showed progress", "28 weeks"), monthly photo check-ins = the exact use case SkinProof makes trustworthy. Gap SkinProof fills: "98% see visible results" is self-reported; SkinProof gives a per-user measured answer with a noise floor.
Avoid: percent-success headline claims without method.

### Not opened (failed/unfetched)
Skinive, Haut.AI demo, YouCam Makeup app: not opened in this pass (time-boxed; no claims made about them).

## COPY LIST (pakuru)
1. Page skeleton = Aloud: headings that mirror the four judging criteria ("How we used the YouCam API (Technological Implementation)", "Impact", "Why it is honest").
2. Lead with one measured headline number (ToneGrid 98 vs 29; Aloud 10/10 under 30 s). SkinProof: "Same face, two retakes seconds apart: score differs by X points - that is the noise. Only changes above 2X count."
3. Show the API precisely: endpoints, task flow, which concerns/tier, keys server-side, fixtures from real runs, handle zip/flat JSON (TintKin). State units used per check.
4. Honesty as a feature (Aloud claim linter, ConfidFit Honest Label, ConfidFit "refuse fake lift on small samples"): ship a copy linter that bans "treats/cures/diagnoses/clinically", and show the "no clear change" verdict in the demo as a hero state, not an error.
5. SkinVision pattern: output = next action ("no clear change - keep routine 4 more weeks / retake in same light"), plus "supports your decision, does not replace a doctor".
6. Cureskin/SkinVision pattern: progress over time, but SkinProof replaces self-reported % with measured per-user verdicts.
7. Live URL with no signup + Demo Mode (ToneGrid) so judges can test; public repo with setup steps; mobile layout (375 px) since the video must show the target device.
8. Real-photo proof: ConfidFit learned the pose check rejects synthetic images; use real faces (own consented photos) for tests and demo.
9. Disclose limits aloud: lighting gate (Aloud), lower-confidence on poor light/dark skin tones if measured. Use the API's lighting/quality signals as noise inputs.
10. Frame impact with real consumer moment from the brief: "is this product working?" - and cost of false claims (people buy on placebo); keep any stat sourced or say "unverified".
11. Share-bonus: post the video, tag @YouCam API, include "Received API credits for sharing", submit the Google form before 11-02 11:45 ET.

## AVOID LIST
- Raw-score line charts with no uncertainty (TintKin-style) as the main pitch.
- Overclaims: "clinically", "accurate", percent-improved headlines, invented conversion/accuracy figures.
- Scope creep (accounts, admin console, Mongo) that does not serve the noise-floor idea.
- Private-only repo; untested endpoints; unsourced statistics; third-party logos/music in the video; synthetic test images.
- Medical framing (SkinVision is regulated; we are cosmetic).

## JUDGING-CRITERIA CHECKLIST (each equal weight)
Technology
- [ ] >=1 YouCam Skin Analysis calls for baseline (A1,A2) and follow-up (B1,B2); noise floor from A1 vs A2 per concern
- [ ] Verdict rule coded and unit-tested (improved/worse only if |delta| > 2x noise; else "no clear change"); show numbers
- [ ] Zip/flat JSON handled, async polling, server-side key, error and quality-gate handling
- [ ] Optionally a second API (skin tone / lighting) to modulate confidence; units/cost stated
- [ ] README with setup, tests, sample fixtures from real runs
Design
- [ ] One coherent flow: capture x2 -> baseline -> (days later) capture x2 -> verdict; 375 px verified; no jargon; verdict colours not sole signal
- [ ] "No clear change" screen designed as carefully as "improved"
Impact
- [ ] Named audience + moment ("deciding if a product is working"), one sourced stat or an explicitly-labelled own measurement
- [ ] Merchant/brand angle (honest efficacy claims, fewer returns) in one sentence; demonstrates it works on the shown data
Idea
- [ ] State why raw-score tracking misleads (measurement noise) - show real noise from same-face retakes
- [ ] Understanding of the problem space: lighting, pose, makeup, time of day

## VIDEO STRUCTURE RECOMMENDATION (<= 2:45, judges stop at 3:00)
0:00-0:15 Hook on phone screen: same face, two photos 10 s apart, score moves 4 points. "Your skin app is lying to you by this much."
0:15-0:35 Problem and audience: "Is this serum working?" - people judge by noise. One sourced fact or honest "we measured it".
0:35-1:15 Demo baseline: capture two retakes, show noise floor per concern (live, on target device).
1:15-1:50 Demo follow-up: one concern with a real change > 2x noise -> "Improved" with numbers; another below -> "No clear change" (emphasise this as the feature).
1:50-2:15 How the YouCam API is used (required): Skin Analysis task flow, concerns, units; one slide/diagram, server-side key, rule of 2x noise.
2:15-2:35 Honesty + limits: no medical claims, lighting gate, what we do not claim; consent/no storage.
2:35-2:45 Impact + CTA: audience, merchant angle, live URL.
Rules: show device, no copyrighted music or third-party logos, English captions, upload public on YouTube; post a second cut for the social bonus.
