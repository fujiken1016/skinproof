"""Can stored API results say how scores react to MORE jitter? Uses only existing results (no API calls).
Rebuilds each simulated retake's jitter parameters from its seed (zoom %, centre shift %, brightness %) and checks whether the retake's
score deviation (per concern, in units of that face's SD) tracks them. If it does not within the simulated range, extrapolating to the measured
handheld range (several times larger) is not supported by the data."""
import json, random, numpy as np
from PIL import Image
def spearman(a, b):
    ra = np.argsort(np.argsort(a)); rb = np.argsort(np.argsort(b)); return float(np.corrcoef(ra, rb)[0, 1])
R = json.load(open('demo/results.json')); F = json.load(open('demo/results_faces.json'))
def params(seed, W, H):
    r = random.Random(seed); s = 1 + r.uniform(0, .03); w, h = int(W / s), int(H / s); x = r.randint(0, W - w); y = r.randint(0, H - h); b = r.uniform(-.03, .03)
    return dict(zoom=(s - 1) * 100, shift=100 * np.hypot(x + w / 2 - W / 2, y + h / 2 - H / 2) / W, bright=abs(b) * 100)
groups = {}
W, H = Image.open('demo/base.jpg').size
groups['A'] = [(f'retake_{i}', params(100 + i, W, H)) for i in range(8)]
for k, kk in (('f1', 1), ('f10', 10), ('f21', 21), ('f28', 28)):
    W, H = Image.open(f'demo/face{kk}.jpg').size
    groups[k] = [(f'{k}_retake_{i}', params(1000 * (kk + 1) + i, W, H)) for i in range(6)]
rows = []
for g, items in groups.items():
    names = [n for n, _ in items if (R.get(n) if g == 'A' else F.get(n)) and 'error' not in (R.get(n) if g == 'A' else F.get(n))]
    src = lambda n: R[n] if g == 'A' else F[n]
    types = [t for t in src(names[0]) if isinstance(src(names[0])[t], (int, float))]
    for n in names:
        zs = []
        for t in types:
            v = np.array([src(m)[t] for m in names]); sd = v.std() or 1e-9; zs.append(abs(src(n)[t] - v.mean()) / sd)
        p = dict(items)[n]; rows.append((np.mean(zs), p['zoom'], p['shift'], p['bright']))
a = np.array(rows); print('photos', len(a))
for i, nm in ((1, 'zoom %'), (2, 'shift %'), (3, 'brightness %')): print(nm, 'range', round(a[:, i].min(), 2), '-', round(a[:, i].max(), 2), 'Spearman vs mean |z| of scores:', round(spearman(a[:, 0], a[:, i]), 2))
