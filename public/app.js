import { judge, summarize, toMap } from './verdict.js';
const $ = (id) => document.getElementById(id);
const LS = 'skinproof.v1';
const load = () => { try { return JSON.parse(localStorage.getItem(LS)) || []; } catch { return []; } };
const store = (t) => { try { localStorage.setItem(LS, JSON.stringify(t)); } catch {} };
let info = { next: {}, disclaimer: '', mock: false }, trials = load(), files = {}, active = null, live = false;

const NEXT_FALLBACK = {
  acne: 'Acne: gentle exfoliating acids (e.g. salicylic) or niacinamide, one at a time. Persistent or painful acne: see a dermatologist.',
  redness: 'Redness: pause actives, use a fragrance-free barrier moisturiser and daily SPF. Sudden or burning redness: stop the new product.',
  oiliness: 'Oiliness: a light gel moisturiser and gentle cleanser usually beat harsh stripping.',
  moisture: 'Moisture: humectants (glycerin, hyaluronic acid) under an occlusive moisturiser.',
  pore: 'Pores respond slowly; judge over 8+ weeks, not days.', texture: 'Texture needs weeks of gentle exfoliation or retinoids plus sunscreen.',
  wrinkle: 'Wrinkles change slowest; re-check at 12 weeks.', age_spot: 'Dark spots: daily SPF is the base.',
  radiance: 'Radiance swings with sleep, light and hydration. Retake at the same hour in the same light.',
  dark_circle_v2: 'Dark circles are partly structural; retake at the same time of day.', eye_bag: 'Eye bags are mostly structural or fluid. Retake at the same time of day.', firmness: 'Firmness changes over months; protect with SPF.' };
const DISC = 'SkinProof is a cosmetic self-tracking tool, not a medical device. It cannot diagnose skin conditions. See a clinician for concerns.';
$('disc').textContent = DISC;

/* ---------- recorded demo (real YouCam results) ---------- */
const SCN = [
  { id: 'none', label: 'Nothing changed', note: 'Same scene, 2 fresh retakes. A good tool should say "no clear change".', before: ['retake_0', 'retake_1'], after: ['retake_2', 'retake_3'], tag: 'Follow-up' },
  { id: 'better', label: 'Skin looks smoother', note: 'SIMULATED: follow-up photos are a soft-smoothed edit of the same photo. Exercises the "improved" path; not evidence any product works.', before: ['retake_0', 'retake_1'], after: ['better_0', 'better_1'], tag: 'Edited' },
  { id: 'worse', label: 'Irritation (redder)', note: 'SIMULATED: follow-up photos get a red colour cast. Exercises the "worse" path.', before: ['retake_0', 'retake_1'], after: ['worse_0', 'worse_1'], tag: 'Edited' }];
let results = null;
Promise.all([fetch('demo/results.json').then((r) => r.json()), fetch('demo/study.json').then((r) => r.json())]).then(([r, st]) => { results = r; study(st); tabs(); pickScn(SCN[0]); }).catch(() => {});

function study(s) {
  const f = (k) => s.rates[k] + '%';
  $('study').innerHTML = `<div class="stat bad"><b>${f('naive1')}</b><span>false "changed" if any 1-point move counts</span></div>
    <div class="stat bad"><b>${f('naive3')}</b><span>even if only 3+ points count</span></div>
    <div class="stat hero"><b>${f('calibrated')}</b><span>SkinProof rule (2 x retake noise)</span></div>
    <div class="stat"><b>${s.comparisons.toLocaleString()}</b><span>no-change comparisons (real API)</span></div>`;
}
function tabs() {
  $('tabs').replaceChildren(...SCN.map((s, i) => { const b = document.createElement('button'); b.role = 'tab'; b.textContent = s.label; b.setAttribute('aria-selected', i === 0);
    b.onclick = () => { [...$('tabs').children].forEach((x) => x.setAttribute('aria-selected', x === b)); pickScn(s); }; return b; }));
}
function pickScn(s) {
  $('scn-note').textContent = s.note;
  const fig = (n, cap) => `<figure><img src="demo/${n}.jpg" alt="${cap}" loading="lazy"><figcaption>${cap}</figcaption></figure>`;
  $('thumbs').innerHTML = fig(s.before[0], 'Baseline 1') + fig(s.before[1], 'Baseline 2') + fig(s.after[0], s.tag + ' 1') + fig(s.after[1], s.tag + ' 2');
  const m = (n) => results[n];
  render({ name: s.label, rows: judge(s.before.map(m), s.after.map(m)) }, $('result'));
}

/* ---------- shared result renderer ---------- */
function render(t, el) {
  const rows = t.rows, sm = summarize(rows);
  const lab = { improved: 'Improved', worse: 'Worse', no_clear_change: 'No clear change', unreliable: 'Retakes disagree' };
  const ico = { improved: '▲ ', worse: '▼ ', no_clear_change: '≈ ', unreliable: '? ' };
  const head = `<p class="headline">${sm.headline}</p><p class="legend">Bar: dashed line = no change. Shaded zone = change that still counts as noise. Black tick = your measured change.</p>`;
  const body = rows.map((r) => {
    const sign = r.delta > 0 ? '+' : '';
    return `<div class="row"><div class="top"><span>${r.label}</span><span class="pill v-${r.verdict}">${ico[r.verdict]}${lab[r.verdict]}</span></div>
      <div class="bar" aria-hidden="true"><b style="left:${Math.max(0, 50 - r.needed)}%;width:${Math.min(100, r.needed * 2)}%"></b><i style="left:calc(${Math.max(1, Math.min(99, 50 + r.delta))}% - 2px)"></i></div>
      <small>${r.before} to ${r.after} (${sign}${r.delta}). Needs more than ±${r.needed} to count. Noise ${r.noise} from ${r.noiseFrom}.</small></div>`; }).join('');
  const flag = rows.filter((r) => r.verdict === 'worse' || r.verdict === 'no_clear_change').slice(0, 3);
  const nxt = (info.next && Object.keys(info.next).length ? info.next : NEXT_FALLBACK);
  const next = `<h3>What to do next</h3><ul id="next">${flag.length ? flag.map((r) => `<li><b>${r.label}.</b> ${(nxt[r.type] || '').replace(/^[^:]*:\s*/, '')}</li>`).join('') : '<li>Nothing flagged. Keep your routine steady and re-check in a few weeks.</li>'}</ul>`;
  el.innerHTML = head + body + next;
}

/* ---------- live mode (only when a server answers /api/info) ---------- */
fetch('api/info').then((r) => (r.ok ? r.json() : Promise.reject())).then((i) => { info = i; live = true; $('s-live').hidden = false; $('wipe').hidden = false; $('disc').textContent = i.disclaimer;
  $('mode').hidden = false; $('mode').textContent = i.mock ? 'Local server, MOCK scores (no API key set)' : 'Local server, live YouCam API'; trialsRender(); })
  .catch(() => { $('s-nolive').hidden = false; $('mode').hidden = false; $('mode').textContent = 'Hosted demo: recorded real YouCam results'; });

async function shrink(file) {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const s = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  if (Math.min(c.width, c.height) < 480) throw new Error('Photo is too small (short side must be 480px+).');
  return c.toDataURL('image/jpeg', 0.9);
}
async function analyse(dataUrl) {
  const r = await fetch('api/analyze', { method: 'POST', body: JSON.stringify({ image: dataUrl }) });
  const j = await r.json(); if (!r.ok) throw new Error(friendly(j));
  return toMap(j.output);
}
const friendly = (j) => ({ error_no_face: 'No face found. Face the camera in good light.', error_face_position: 'Centre your face and fill 60 to 80% of the frame.', error_large_face_angle: 'Face the camera straight on (head angle too large).' }[j.error] || j.error || 'Something went wrong.');
const msg = (p, t, err) => { const m = $(p === 'b' ? 'msg1' : 'msg2'); m.textContent = t; m.className = 'msg' + (err ? ' err' : ''); };
function pick(prefix, slots, onChange) {
  slots.forEach((id, i) => $(id).querySelector('input').addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { files[id] = await shrink(f); $(id).classList.add('done'); $(id).querySelector('span').textContent = 'Photo ' + (i + 1) + ' ready'; }
    catch (err) { delete files[id]; $(id).classList.remove('done'); msg(prefix, err.message, true); }
    onChange();
  }));
}
const okSave = () => { $('save').disabled = !(files.b0 && files.b1 && $('name').value.trim()); };
pick('b', ['b0', 'b1'], okSave); pick('a', ['a0', 'a1'], () => { $('judge').disabled = !(files.a0 && files.a1); }); $('name').addEventListener('input', okSave);
$('save').onclick = async () => {
  $('save').disabled = true; msg('b', 'Analysing 2 photos (about 20 seconds)...');
  try {
    const before = [await analyse(files.b0), await analyse(files.b1)];
    trials.unshift({ id: Date.now(), name: $('name').value.trim().slice(0, 60), date: new Date().toISOString().slice(0, 10), before, after: null });
    store(trials); files = {}; reset(); msg('b', 'Baseline saved. Use the product, then re-check from the list below.'); trialsRender();
  } catch (e) { msg('b', e.message, true); $('save').disabled = false; }
};
$('judge').onclick = async () => {
  $('judge').disabled = true; msg('a', 'Analysing 2 photos...');
  try {
    active.after = [await analyse(files.a0), await analyse(files.a1)]; active.afterDate = new Date().toISOString().slice(0, 10);
    store(trials); files = {}; reset(); showTrial(active); trialsRender(); msg('a', '');
  } catch (e) { msg('a', e.message, true); $('judge').disabled = false; }
};
function reset() { ['b0', 'b1', 'a0', 'a1'].forEach((id, i) => { const el = $(id); el.classList.remove('done'); el.querySelector('input').value = ''; el.querySelector('span').textContent = (i < 2 ? 'Baseline' : 'Follow-up') + ' photo ' + ((i % 2) + 1); }); $('name').value = ''; $('save').disabled = true; $('judge').disabled = true; }
const days = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);
function showTrial(t) {
  $('thumbs').replaceChildren(); $('scn-note').textContent = `${t.name}: ${days(t.date, t.afterDate)} days between baseline and follow-up.`;
  render({ rows: judge(t.before, t.after) }, $('result')); $('h-demo').scrollIntoView({ behavior: 'smooth' });
}
function trialsRender() {
  $('trials').replaceChildren(...trials.map((t) => { const li = document.createElement('li');
    const s = document.createElement('span'); s.textContent = `${t.name} (${t.date})`;
    const b = document.createElement('button'); b.textContent = t.after ? 'View result' : 'Re-check now';
    b.onclick = () => { if (t.after) showTrial(t); else { active = t; $('s-follow').hidden = false; $('fhint').textContent = `Same light and distance as your baseline for "${t.name}". Wait at least 2 weeks for most concerns.`; $('s-follow').scrollIntoView({ behavior: 'smooth' }); } };
    li.append(s, b); return li; }));
}
$('wipe').onclick = () => { if (confirm('Delete all saved trials from this browser?')) { trials = []; store(trials); trialsRender(); $('s-follow').hidden = true; } };
