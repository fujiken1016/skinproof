"""Where could a quality gate separate real 'bad' phone photos from normal ones? Metrics per photo, then 2-fold cross-validated thresholds
(threshold chosen on one half, tested on the other half, both directions). No API, no faces.
Usage: python3 tools/gate_analysis.py <good_folder> <bad_folder>"""
import sys, glob, itertools, numpy as np
from PIL import Image
def metrics(p):
    im = Image.open(p).convert('RGB'); w0, h0 = im.size
    out = {}
    for tag, width in (('96', 96), ('480', 480)):
        g = np.asarray(im.resize((width, max(8, round(width * h0 / w0))), Image.LANCZOS).convert('L'), dtype=np.float32)
        c = g[1:-1, 1:-1]; lap = 4 * c - g[1:-1, :-2] - g[1:-1, 2:] - g[:-2, 1:-1] - g[2:, 1:-1]
        out['lapvar' + tag] = float(lap.var())
        if tag == '96': out['mean'] = float(g.mean()); out['std'] = float(g.std()); out['dark_frac'] = float((g < 40).mean()); out['bright_frac'] = float((g > 230).mean())
    return out
def load(d): return {p.split('/')[-1]: metrics(p) for p in sorted(glob.glob(d.rstrip('/') + '/*.jp*g'))}
G, B = load(sys.argv[1]), load(sys.argv[2])
keys = list(next(iter(G.values())).keys())
print('metric   good(min/median/max)   bad(min/median/max)')
for k in keys:
    g = [v[k] for v in G.values()]; b = [v[k] for v in B.values()]
    print(f'{k:12s} {min(g):9.1f} {np.median(g):9.1f} {max(g):9.1f} | {min(b):9.1f} {np.median(b):9.1f} {max(b):9.1f}')
def best_thr(gv, bv):  # threshold + direction maximising balanced accuracy on training half
    best = (0, None, None)
    for t in sorted(set(gv + bv)):
        for d in ('lt', 'gt'):
            tp = np.mean([(x < t) if d == 'lt' else (x > t) for x in bv]); tn = np.mean([(x >= t) if d == 'lt' else (x <= t) for x in gv]); s = (tp + tn) / 2
            if s > best[0]: best = (s, t, d)
    return best
gk, bk = list(G), list(B); rng = np.random.RandomState(0)
print('\n2-fold cross-validation (train on half, test on the other half; balanced accuracy, chance = 0.5)')
for k in keys:
    accs = []
    for rep in range(20):
        gi = rng.permutation(len(gk)); bi = rng.permutation(len(bk)); gh, bh = len(gk) // 2, len(bk) // 2
        for tr_g, te_g, tr_b, te_b in ((gi[:gh], gi[gh:], bi[:bh], bi[bh:]), (gi[gh:], gi[:gh], bi[bh:], bi[:bh])):
            _, t, d = best_thr([G[gk[i]][k] for i in tr_g], [B[bk[i]][k] for i in tr_b])
            tp = np.mean([((B[bk[i]][k] < t) if d == 'lt' else (B[bk[i]][k] > t)) for i in te_b]); tn = np.mean([((G[gk[i]][k] >= t) if d == 'lt' else (G[gk[i]][k] <= t)) for i in te_g]); accs.append((tp + tn) / 2)
    print(f'{k:12s} held-out balanced accuracy {np.mean(accs):.2f}')
