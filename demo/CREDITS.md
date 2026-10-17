# Demo photo credits
- Source: Wikimedia Commons, "Lesley Ray.jpg" by Fairyallen, license **CC0 1.0** (public domain dedication). https://commons.wikimedia.org/wiki/File:Lesley_Ray.jpg (license verified via the Commons API on 2026-10-17).
- Cropped to the face for YouCam's framing rules. `retake_*` = simulated handheld retakes (shift, zoom, exposure, noise, JPEG). `better_*` / `worse_*` = simulated edits (soft smoothing / red cast). They exercise the verdict logic and are **not** evidence about any product.
- No photo of the author or any private person is used. The edits (smoothing, red cast) are simulated and imply nothing about the person shown. Only scores (`demo/results.json`) come from the YouCam API.

## Additional faces (independent samples), all CC0 per the Wikimedia Commons API on 2026-10-17
- face 1: "Curly hair and freckles man (Unsplash).jpg" by Jeremy Bishop tidesinourveins (CC0). Only scores are published in `demo/results_faces.json`; the cropped images are kept for reproducibility.
- face 10: "A friend. (Unsplash).jpg" by Ishan @seefromthesky seefromthesky (CC0). Only scores are published in `demo/results_faces.json`; the cropped images are kept for reproducibility.
- face 21: "Face portrait (Unsplash).jpg" by William Stitt willpower (CC0). Only scores are published in `demo/results_faces.json`; the cropped images are kept for reproducibility.
- face 28: "Hooded woman in snow (Unsplash).jpg" by Pete Bellis petebellis (CC0). Only scores are published in `demo/results_faces.json`; the cropped images are kept for reproducibility.
- Retake and edit images are programmatic simulations and imply no real skin change. Not shown on the hosted demo except face A.

## Face Research Lab London Set (fully held-out test faces)
- DeBruine, L., & Jones, B. (2017). Face Research Lab London Set. figshare. https://doi.org/10.6084/m9.figshare.5047666 . License **CC BY 4.0** (verified on the figshare record 2026-10-17). Images are NOT redistributed here or on the hosted demo; only aggregate scores (`demo/results_faces.json`) are published. The participants' consent text on the record covers research and media use, which is narrower than CC BY, so we publish scores only.
- Used faces (neutral frontal, 1 photo each, 4 simulated retakes): see `demo/london_meta.json`. One face (L045) was dropped because the API rejected most retakes as `error_src_face_too_small`.
