"""Independent samples: 6 simulated handheld retakes for each extra CC0 face (demo/face{k}.jpg)."""
import random, numpy as np
from PIL import Image, ImageEnhance
for k in (1, 10, 21, 28):
    base = Image.open(f'demo/face{k}.jpg').convert('RGB'); W, H = base.size
    for i in range(6):
        seed = 1000 * (k + 1) + i; r = random.Random(seed); s = 1 + r.uniform(0, .03)
        w, h = int(W / s), int(H / s); x = r.randint(0, W - w); y = r.randint(0, H - h)
        im = base.crop((x, y, x + w, y + h)).resize((W, H), Image.LANCZOS)
        im = ImageEnhance.Brightness(im).enhance(1 + r.uniform(-.03, .03))
        a = np.asarray(im).astype(np.float32) + np.random.RandomState(seed).normal(0, 1.5, (H, W, 3))
        Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(f'demo/f{k}_retake_{i}.jpg', quality=88)
