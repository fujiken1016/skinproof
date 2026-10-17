# Dataset search: same-person retakes, commercial-OK license (opened 2026-10-17)

## Verdict
No dataset found that has BOTH real same-session neutral retakes AND a clearly commercial-OK license. Closest: Face Research Lab London Set (CC BY 4.0, 1350x1350) but only ONE neutral frontal image per person (retakes absent). Usable only as a license-clean pool of different people, not for test-retest.

## 1. Face Research Lab London Set (figshare) - license verified, retakes NOT present
- Record: https://doi.org/10.6084/m9.figshare.5047666 (API https://api.figshare.com/v2/articles/5047666, opened 2026-10-17): license field "CC BY 4.0" https://creativecommons.org/licenses/by/4.0/ (v5, 2021-04-01).
- 102 adults, 1350x1350 full colour, taken in London April 2012. Consent: images "used in lab-based and web-based studies in their original or altered forms and to illustrate research (e.g., in scientific journals, news media or presentations)" (record description). Consent wording is narrower than CC BY commercial use; flag for caveat.
- Files (each one image per person per condition): neutral_front.zip 33.9MB https://ndownloader.figshare.com/files/8541961 ; smiling_front.zip 53.5MB (…/8541964); 3/4 and profile sets ~24MB each; ratings CSV; info CSV (age/gender/ethnicity).
- Downloaded neutral_front.zip (md5 236c1c94defbb34a79074b195841cfd6 matches figshare). Contains 102 jpg (e.g. 067_03.jpg, 1350x1350, quality 100) + 102 .tem landmark files. One neutral frontal per person => NO retakes. neutral vs smiling are different expressions, not retakes.
- Frontal, face fills most of frame; short side 1350 >= 480.

## 2. Others - ruled out
- Chicago Face Database: "may be used for non-commercial scientific research purposes only"; no redistribution; no cloud services (April 2024). https://www.chicagofaces.org/ (opened 2026-10-17).
- FEI: "available for research purposes only"; "Permission to use but not distribute or reproduce". 200 persons x 14 images, 640x480 (2 frontal: neutral+smile, not retakes). https://fei.edu.br/~cet/facedatabase.html
- CaNAFF: signed license + access form, "scientific and academic research purposes only", "no commercial or private use". 147 x 3 gaze directions. https://lippc2s.fr/canaff/
- MUCT: no license text; README (https://raw.githubusercontent.com/StephenMilborrow/muct/master/README.txt) says do NOT reproduce images in public documents; paper says free for academic use (secondary source). 640x480.
- Warsaw Set (WSEFEP) OSF: per search snippet non-commercial research only (not opened directly: failed, OSF API returned no parseable data).
- Caltech Faces 1999: https://data.caltech.edu/records/20237 lists rights "mit" ("No further description"); 450 imgs 896x592, "27 or so" people, varying lighting/expressions/backgrounds (README). Not controlled retakes, no per-person counts, no subject consent statement; MIT label on photos of people is unreliable. Not recommended. (75MB faces.tar; not downloaded.)
- Large-scale Labeled Faces (figshare 13077329): CC0 label but scraped video frames of 11k individuals, 5.36GB, provenance/consent doubtful. https://api.figshare.com/v2/articles/13077329
- UniDataPro facial skin condition (HF): cc-by-nc-nd-4.0 (per search snippet, not opened). CASIA-Face-Africa: academic-only consent. Hyper-Skin: EULA-gated. Adience: Flickr CC mix, not single session.
- Georgia Tech, Yale, AR, ORL, PUT, Essex: license not verifiable from original page (failed: search found no license page; these are historically research-only / unspecified). Essex also 180x200 (too small). FFHQ per-photo licenses: Flickr in-the-wild, no same-session retakes (not opened; failed to verify).
- Wikimedia Commons / Flickr: searched (Commons API search returned 0; web search found WikiPortraits project, CC-licensed portraits of notable people, https://meta.wikimedia.org/wiki/Grants:Programs/Wikimedia_Community_Fund/General_Support_Fund/WikiPortraits:2025_Activities). failed: no verified category with repeated same-session shots per person; could be mined manually (photographers often upload 2-3 takes) but license per file (mostly CC BY-SA, share-alike) and depicting named notable people.

## Recommendation
Retakes of the same person under identical conditions with a commercial-clean license do not seem to exist publicly. Options: (a) collect own retakes with consenting volunteers (written consent for publishing aggregate scores only); (b) use London Set as license-clean cross-person sample (and test API's response to trivial re-encodes/crops as a pseudo-retake, labelled as such).
