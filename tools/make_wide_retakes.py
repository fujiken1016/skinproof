"""Pre-generate retakes with jitter scaled to the MEASURED real handheld range (README table), so the study can be rerun the moment API credits arrive.
Images only, no API. Output (local, git-ignored): demo_wide/. Shift up to 24% of width is impossible with a tight face crop, so shift is capped by the margin
(set MARGIN to the share of extra background around the face); zoom 0-15%, rotation +-5 deg, brightness +-8%."""
import glob, random, sys, os, numpy as np
from PIL import Image, ImageEnhance
os.makedirs('demo_wide', exist_ok=True)
for src in ['demo/base.jpg', 'demo/face1.jpg', 'demo/face10.jpg', 'demo/face21.jpg', 'demo/face28.jpg']:
    base = Image.open(src).convert('RGB'); W, H = base.size; tag = os.path.basename(src).split('.')[0]
    for i in range(6):
        r = random.Random(sum(map(ord, tag)) * 100 + i); s = 1 + r.uniform(0, .15); rot = r.uniform(-5, 5)
        im = base.rotate(rot, resample=Image.BICUBIC, expand=False, fillcolor=(128, 128, 128)); w, h = int(W / s), int(H / s)
        x = r.randint(0, W - w); y = r.randint(0, H - h); im = im.crop((x, y, x + w, y + h)).resize((W, H), Image.LANCZOS)
        im = ImageEnhance.Brightness(im).enhance(1 + r.uniform(-.08, .08))
        a = np.asarray(im).astype(np.float32) + np.random.RandomState(i).normal(0, 1.5, (H, W, 3)); Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(f'demo_wide/{tag}_wide_{i}.jpg', quality=88)
print(len(glob.glob('demo_wide/*.jpg')), 'images in demo_wide/ (not committed)')
