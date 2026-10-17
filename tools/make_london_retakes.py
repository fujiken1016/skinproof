"""Face Research Lab London Set (CC BY 4.0, figshare 5047666): crop by the set's own landmarks, then simulate 4 handheld retakes each.
Usage: python3 tools/make_london_retakes.py <dir with neutral_front/neutral_front/*.jpg+.tem> <face_width_fraction>"""
import csv, glob, os, random, sys, json, numpy as np
from PIL import Image, ImageEnhance
D = sys.argv[1].rstrip('/') + '/'; FRAC = float(sys.argv[2])
rows = [r for r in csv.DictReader(open(D + 'info.csv')) if r['face_age'].strip()]
def pick(g, e, rev=False):
    c = [r for r in rows if r['face_gender'] == g and r['face_eth'] == e and glob.glob(D + f"neutral_front/neutral_front/{r['face_id']}_*.jpg")]
    return sorted(c, key=lambda r: int(r['face_age']), reverse=rev)[0]
sel = [pick('female', 'black'), pick('male', 'east_asian'), pick('male', 'white', True), pick('female', 'west_asian')]
meta = {}
for r in sel:
    fid = r['face_id']; img = glob.glob(D + f'neutral_front/neutral_front/{fid}_*.jpg')[0]; tem = glob.glob(D + f'neutral_front/neutral_front/{fid}_*.tem')[0]
    pts = np.array([[float(v) for v in l.split()] for l in open(tem).read().split('\n')[1:] if len(l.split()) == 2])
    pts = pts[(pts[:, 0] > 200) & (pts[:, 1] > 100)]
    x0, y0 = pts.min(0); x1, y1 = pts.max(0); side = (x1 - x0) / FRAC; cx = (x0 + x1) / 2; cy = (y0 + y1) / 2
    im = Image.open(img).convert('RGB'); c = im.crop((int(max(0, cx - side / 2)), int(max(0, cy - side / 2)), int(min(im.width, cx + side / 2)), int(min(im.height, cy + side / 2))))
    c = c.resize((900, int(900 * c.height / c.width))); k = 'L' + fid; c.save(f'demo/face{k}.jpg', quality=92); W, H = c.size
    for i in range(4):
        seed = 5000 + int(fid) * 10 + i; rr = random.Random(seed); s = 1 + rr.uniform(0, .03); w2, h2 = int(W / s), int(H / s); x = rr.randint(0, W - w2); y = rr.randint(0, H - h2)
        t = c.crop((x, y, x + w2, y + h2)).resize((W, H), Image.LANCZOS); t = ImageEnhance.Brightness(t).enhance(1 + rr.uniform(-.03, .03))
        a = np.asarray(t).astype(np.float32) + np.random.RandomState(seed).normal(0, 1.5, (H, W, 3)); Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(f'demo/f{k}_retake_{i}.jpg', quality=88)
    meta[k] = dict(file=os.path.basename(img), license='CC BY 4.0', source='Face Research Lab London Set, figshare doi:10.6084/m9.figshare.5047666', age=r['face_age'], gender=r['face_gender'], eth=r['face_eth'])
json.dump(meta, open('demo/london_meta.json', 'w'), indent=1)
