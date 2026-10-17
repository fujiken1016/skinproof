# SOURCES (all opened 2026-10-17; fetched via WebFetch summaries / curl, quotes <= 1 short phrase)

## 1. Regulator guidance: before/after images must be representative, not misleading

### 1a. UK - CAP/ASA (confidence: high)
- Claim: CAP/ASA treat before-and-after photos like testimonials; advertisers need evidence the images are genuine, unmanipulated, and reflect results consumers can realistically expect. Retouching that affects apparent product performance (e.g. smoothing wrinkles in an eye-cream ad) can mislead; a disclaimer does not cure an ad that is misleading in itself.
- URL: https://www.asa.org.uk/advice-online/before-and-after-photos.html (page dated 05 Jun 2025)
- Cited rulings on that page: https://www.asa.org.uk/rulings/the-laser-treatment-clinic-ltd-a18-447095.html (22 Aug 2018, images not shown genuine/representative); https://www.asa.org.uk/rulings/the-dental-suite-a17-390603.html (13 Dec 2017, "signed and dated proof" phrase).
- Note: the "disclaimer cannot rescue" point is a summary by the fetch tool; re-check wording on the page before quoting.

### 1b. US - FTC (confidence: medium-high)
- Claim: Before/after photos with an extraordinary result convey that the result is typical; the advertiser needs substantiation or must clearly and conspicuously disclose the generally expected results. FTC's testing found "results not typical"-style disclaimers did not adequately dispel the typicality impression (2009 Endorsement Guides notice).
- URLs: https://consumer.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking (opened; says ad must "make clear to the audience what the generally expected results" are when endorser results are atypical; this page does NOT mention before/after explicitly)
  https://www.ftc.gov/system/files/ftc_gov/pdf/P204500%20Guides%20Concerning%20Endors%20and%20Testimonials.pdf (Guides, 16 CFR 255; found via search, not read in full)
  https://www.ftc.gov/sites/default/files/documents/federal_register_notices/guides-concerning-use-endorsements-and-testimonials-advertising-16-cfr-part-255/091015guidesconcerningtestimonials.pdf (2009 FR notice; the before/after + disclaimer-testing statements come from a search-result summary, NOT verified in the PDF text: confidence medium)
- Page date: consumer.ftc.gov page shows no own date.

### 1c. Japan - Consumer Affairs Agency (confidence: medium-high)
- Claim: Under Act against Unjustifiable Premiums and Misleading Representations Art. 5(1) (優良誤認表示), presenting a product's quality as significantly better than reality is prohibited; under the substantiation rule (不実証広告規制) the Commissioner can require evidence for efficacy claims within a set period, and if not adequately supported the claim is treated as misleading (page does not state a day count).
- URLs: https://www.caa.go.jp/policies/policy/representation/fair_labeling/representation_regulation ; parent: https://www.caa.go.jp/policies/policy/representation/fair_labeling/
- Page date: none shown. Pharmaceutical and Medical Device Act Art. 66/68 (cosmetics claims): not fetched (optional).
- Neither JP page mentions before/after photos explicitly; relevance is by general 優良誤認 principle.

## 2. Return / purchase-regret rates for skincare
- Result: NOT FOUND for skincare/beauty from a primary source.
- General retail only (primary): NRF + Appriss Retail, press release 26 Dec 2023: total 2023 return rate 14.5% of sales, online 17.6%, in-store 10.02%. URL: https://nrf.com/media-center/press-releases/nrf-and-appriss-retail-report-743-billion-merchandise-returned-2023 (confidence: high; no beauty category on page). Report PDF: https://cdn.nrf.com/sites/default/files/2024-01/2023 Consumer Returns in the Retail Industry.pdf (not read).
- Secondary only (do NOT use as stat): Beauty Independent quotes a goTRG director "sub-20%" for cosmetics: https://orbit.beautyindependent.com/article/in-a-cost-vs-impact-world-what-really-happens-to-returned-beauty-products (no primary data; failed to verify).

## 3. YouCam API pricing / units
- Units are the API currency ("Credit" in docs); different features deduct different amounts. https://docs.perfectcorp.com/reference/unit_system.md (confidence: high). Docs state costs match https://yce.perfectcorp.com/ai-api/api-pricing .
- Skin Analysis (V2.0/2.1) unit consumption, https://docs.perfectcorp.com/reference/ai_skin_analysis.md (confidence: high): SD: 1-4 concerns = 9 units; 5-8 = 12; 9-12 = 14; 13-16 = 16. HD: 12 / 16 / 20 / 22. => SD with 12 concerns = 14 units per successful call. Units consumed only on success; failed tasks consume none. SD and HD concerns cannot be mixed.
- USD price per unit: NOT STATED in docs. failed: https://yce.perfectcorp.com/ai-api/api-pricing is JS-rendered; curl, WebFetch and headless Chrome returned no price text. Must be read manually in a browser (also /ai-api/unit-calculator).
- Free tier: https://yce.makeupar.com/ai-api says "Test our AI API with free credits" (amount not stated). Quick-start (https://docs.perfectcorp.com/develop/quick_start_guide.md): register account free, then purchase or subscribe to get units; pay-as-you-go units exist. Free-credit count: not stated.

## 4. Positioning of Skin Analysis for eCommerce
- One sentence: Perfect Corp pitches its AI Skin Analysis as a selfie tool that gives online beauty shoppers quick, measurable skin-metric scores to help them choose products.
- URL: https://www.perfectcorp.com/business/products/ai-skin-analysis (confidence: medium; paraphrase from fetch summary; page says "15 skin metrics" while docs show up to 16 concerns).

## Correction 2026-10-18
- ASA page wording (re-read 2026-10-18): "signed and dated proof that the photos are genuine and have not been manipulated"; "should not exaggerate the efficacy of the product"; ruling summary: no evidence that images were "representative of the effect consumers could likely expect". The phrase "realistically achievable" is not on the page and must not be used.
- Perfect Corp product page: "scores 15 skin metrics on a 0-100 scale"; it does not state a 'help shoppers choose' sentence, so that paraphrase was removed.
