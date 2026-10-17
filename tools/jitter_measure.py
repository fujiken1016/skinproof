"""Measure handheld jitter between consecutive photos of a STILL, FACELESS subject (no API, no units, no faces).
For each photo vs the first: shift (% of width), zoom (%), rotation (deg), mean brightness change (%), via ORB + partial-affine fit.
Usage: python3 tools/jitter_measure.py <folder of jpgs of one still subject>  -> prints per-photo values and the max/95th percentile.
Compare with the simulated range in tools/make_demo_images.py (zoom up to 3%, crop-shift up to ~3%, exposure +-3%).
Protocol: tools/HANDHELD_PROTOCOL.md."""
import sys, glob, math, numpy as np, cv2
files = sorted(glob.glob(sys.argv[1].rstrip('/') + '/*.jp*g')); assert len(files) >= 3, 'need >=3 photos'
def load(f):
    im = cv2.imread(f); h, w = im.shape[:2]; s = 1000 / max(h, w); return cv2.resize(im, (int(w * s), int(h * s)))
ref = load(files[0]); g0 = cv2.cvtColor(ref, cv2.COLOR_BGR2GRAY); orb = cv2.ORB_create(3000); k0, d0 = orb.detectAndCompute(g0, None)
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True); rows = []
for f in files[1:]:
    im = load(f); g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); k, d = orb.detectAndCompute(g, None)
    m = sorted(bf.match(d0, d), key=lambda x: x.distance)[:300]
    p0 = np.float32([k0[x.queryIdx].pt for x in m]); p1 = np.float32([k[x.trainIdx].pt for x in m])
    M, _ = cv2.estimateAffinePartial2D(p0, p1, method=cv2.RANSAC)
    if M is None: continue
    sc = math.hypot(M[0, 0], M[1, 0]); rot = math.degrees(math.atan2(M[1, 0], M[0, 0]))
    cx, cy = ref.shape[1] / 2, ref.shape[0] / 2; nx = M[0, 0] * cx + M[0, 1] * cy + M[0, 2] - cx; ny = M[1, 0] * cx + M[1, 1] * cy + M[1, 2] - cy
    rows.append(dict(file=f.split('/')[-1], shift_pct=100 * math.hypot(nx, ny) / ref.shape[1], zoom_pct=100 * abs(sc - 1), rot_deg=abs(rot), bright_pct=float(100 * abs(g.mean() / g0.mean() - 1))))
for r in rows: print({k: (round(v, 2) if not isinstance(v, str) else v) for k, v in r.items()})
for k in ('shift_pct', 'zoom_pct', 'rot_deg', 'bright_pct'): v = [r[k] for r in rows]; print(k, 'max', round(max(v), 2), 'p95', round(float(np.percentile(v, 95)), 2))
