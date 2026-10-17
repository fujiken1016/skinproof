"""Build the demo photo set from ONE CC0 portrait (see demo/CREDITS.md). No real person is
re-photographed: 'retakes' are simulated handheld jitter (shift/zoom/exposure/noise/JPEG).
'followup_*' are SIMULATED edits used only to exercise the verdict logic; they are not product claims."""
import random, numpy as np
from PIL import Image, ImageFilter, ImageEnhance
base = Image.open('demo/base.jpg').convert('RGB'); W, H = base.size
def retake(seed):
    r = random.Random(seed); s = 1 + r.uniform(0, .03)
    w, h = int(W / s), int(H / s); x = r.randint(0, W - w); y = r.randint(0, H - h)
    im = base.crop((x, y, x + w, y + h)).resize((W, H), Image.LANCZOS)
    im = ImageEnhance.Brightness(im).enhance(1 + r.uniform(-.03, .03))
    a = np.asarray(im).astype(np.float32) + np.random.RandomState(seed).normal(0, 1.5, (H, W, 3))
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
def save(im, name): im.save(f'demo/{name}.jpg', quality=88)
for i in range(8): save(retake(100 + i), f'retake_{i}')
def smooth(im):   # simulated 'better skin': soft blur blended + slightly brighter
    return ImageEnhance.Brightness(Image.blend(im, im.filter(ImageFilter.GaussianBlur(3)), .6)).enhance(1.04)
def redden(im):   # simulated 'irritation': red cast
    a = np.asarray(im).astype(np.float32); a[..., 0] *= 1.10; a[..., 1] *= .94; a[..., 2] *= .94
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
for i in range(2):
    save(smooth(retake(200 + i)), f'better_{i}'); save(redden(retake(300 + i)), f'worse_{i}')
