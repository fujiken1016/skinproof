"""Does the browser quality gate (src/quality.js) catch bad photos? Mirrors its thresholds exactly (no API, no faces needed).
Usage: python3 tools/gate_eval.py <good_folder> <bad_folder>  -> pass rate on good photos, rejection rate on deliberately bad ones.
good = normal handheld shots of the still subject; bad = deliberately dark, bright or blurred shots (take ~10)."""
import sys, glob, numpy as np
from PIL import Image
def gate(path):
    im = Image.open(path).convert('RGB'); w0, h0 = im.size; issues = []
    if min(w0, h0) < 480: issues.append('small')
    sm = im.resize((96, max(8, round(96 * h0 / w0)))); g = np.asarray(sm.convert('L'), dtype=np.float32)
    m = g.mean()
    if m < 60: issues.append('dark')
    elif m > 215: issues.append('bright')
    c = g[1:-1, 1:-1]; lap = 4 * c - g[1:-1, :-2] - g[1:-1, 2:] - g[:-2, 1:-1] - g[2:, 1:-1]
    if lap.var() < 25: issues.append('blurry')
    return issues
def run(d):
    fs = sorted(glob.glob(d.rstrip('/') + '/*.jp*g')); r = [(f, gate(f)) for f in fs]
    for f, i in r: print(f.split('/')[-1], i or 'pass')
    return r
good = run(sys.argv[1]); bad = run(sys.argv[2])
print('good photos passed: %d/%d' % (sum(not i for _, i in good), len(good)))
print('bad photos rejected: %d/%d' % (sum(bool(i) for _, i in bad), len(bad)))
