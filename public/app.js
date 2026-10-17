import { judge, summarize, toMap } from './verdict.js';
const $ = (id) => document.getElementById(id);
const LS = 'skinproof.v1';
const load = () => { try { return JSON.parse(localStorage.getItem(LS)) || []; } catch { return []; } };
const store = (t) => { try { localStorage.setItem(LS, JSON.stringify(t)); } catch {} };
let info = { next: {}, disclaimer: '' }, trials = load(), files = {}, active = null;

fetch('/api/info').then((r) => r.json()).then((i) => { info = i; $('disc').textContent = i.disclaimer;
  if (i.mock) { $('mode').hidden = false; $('mode').textContent = 'Demo mode: synthetic scores (no API key set)'; } });

async function shrink(file) {                       // JPEG, long side <= 1600, short side >= 480
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const s = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  if (Math.min(c.width, c.height) < 480) throw new Error('Photo is too small (short side must be 480px+).');
  return c.toDataURL('image/jpeg', 0.9);
}
async function analyse(dataUrl) {
  const r = await fetch('/api/analyze', { method: 'POST', body: JSON.stringify({ image: dataUrl }) });
  const j = await r.json(); if (!r.ok) throw new Error(friendly(j));
  return toMap(j.output);
}
const friendly = (j) => ({ error_no_face: 'No face found. Face the camera in good light.', error_face_position: 'Centre your face and fill 60-80% of the frame.' }[j.code] || j.error || 'Something went wrong.');

function pick(prefix, slots, onChange) {
  slots.forEach((id, i) => $(id).querySelector('input').addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { files[id] = await shrink(f); $(id).classList.add('done'); $(id).querySelector('span').textContent = 'Photo ' + (i + 1) + ' ready'; }
    catch (err) { delete files[id]; $(id).classList.remove('done'); msg(prefix, err.message, true); }
    onChange();
  }));
}
const msg = (p, t, err) => { const m = $(p === 'b' ? 'msg1' : 'msg2'); m.textContent = t; m.className = 'msg' + (err ? ' err' : ''); };
pick('b', ['b0', 'b1'], () => { $('save').disabled = !(files.b0 && files.b1 && $('name').value.trim()); });
pick('a', ['a0', 'a1'], () => { $('judge').disabled = !(files.a0 && files.a1); });
$('name').addEventListener('input', () => { $('save').disabled = !(files.b0 && files.b1 && $('name').value.trim()); });

$('save').onclick = async () => {
  $('save').disabled = true; msg('b', 'Analysing 2 photos (about 20 seconds)...');
  try {
    const before = [await analyse(files.b0), await analyse(files.b1)];
    trials.unshift({ id: Date.now(), name: $('name').value.trim().slice(0, 60), date: new Date().toISOString().slice(0, 10), before, after: null });
    store(trials); files = {}; reset(); msg('b', 'Baseline saved. Use the product, then re-check from "Your trials".'); render();
  } catch (e) { msg('b', e.message, true); $('save').disabled = false; }
};
$('judge').onclick = async () => {
  $('judge').disabled = true; msg('a', 'Analysing 2 photos...');
  try {
    active.after = [await analyse(files.a0), await analyse(files.a1)]; active.afterDate = new Date().toISOString().slice(0, 10);
    store(trials); files = {}; show(active); render(); msg('a', '');
  } catch (e) { msg('a', e.message, true); $('judge').disabled = false; }
};
function reset() { ['b0', 'b1', 'a0', 'a1'].forEach((id, i) => { const el = $(id); el.classList.remove('done'); el.querySelector('input').value = ''; el.querySelector('span').textContent = (i < 2 ? 'Baseline' : 'Follow-up') + ' photo ' + ((i % 2) + 1); }); $('name').value = ''; $('save').disabled = true; $('judge').disabled = true; }
function days(a, b) { return Math.round((new Date(b) - new Date(a)) / 864e5); }

function show(t) {
  const rows = judge(t.before, t.after), sm = summarize(rows);
  $('s-result').hidden = false; $('rtitle').textContent = `${t.name}: ${days(t.date, t.afterDate)} days`; $('headline').textContent = sm.headline;
  $('rows').replaceChildren(...rows.map((r) => {
    const d = document.createElement('div'); d.className = 'row';
    const sign = r.delta > 0 ? '+' : '';
    const lab = { improved: 'Improved', worse: 'Worse', no_clear_change: 'No clear change', unreliable: 'Retakes disagree: cannot judge' }[r.verdict];
    d.innerHTML = `<div class="top"><span>${r.label}</span><span class="v-${r.verdict}">${lab}</span></div>
      <div class="bar" aria-hidden="true"><b style="left:${Math.max(0, 50 - r.needed)}%;width:${Math.min(100, r.needed * 2)}%"></b><i style="left:calc(${Math.max(0, Math.min(100, 50 + r.delta))}% - 1px)"></i></div>
      <small>${r.before} to ${r.after} (${sign}${r.delta}). Needs more than &plusmn;${r.needed} to count (retake noise ${r.noise}).</small>`;
    return d; }));
  const worst = rows.filter((r) => r.verdict === 'worse' || r.verdict === 'no_clear_change').slice(0, 3);
  $('next').replaceChildren(...worst.map((r) => { const li = document.createElement('li'); li.textContent = `${r.label}: ${info.next[r.type] || ''}`; return li; }));
  if (!worst.length) { const li = document.createElement('li'); li.textContent = 'Nothing flagged. Keep your routine steady and re-check in a few weeks.'; $('next').replaceChildren(li); }
  $('s-result').scrollIntoView({ behavior: 'smooth' });
}
function render() {
  $('s-trials').hidden = !trials.length;
  $('trials').replaceChildren(...trials.map((t) => { const li = document.createElement('li');
    const s = document.createElement('span'); s.textContent = `${t.name} (${t.date})`;
    const b = document.createElement('button'); b.textContent = t.after ? 'View result' : 'Re-check now';
    b.onclick = () => { if (t.after) show(t); else { active = t; $('s-follow').hidden = false; $('fhint').textContent = `Same light and distance as your baseline for "${t.name}". Wait at least 2 weeks for most concerns.`; $('s-follow').scrollIntoView({ behavior: 'smooth' }); } };
    li.append(s, b); return li; }));
}
$('wipe').onclick = () => { if (confirm('Delete all saved trials from this browser?')) { trials = []; store(trials); render(); $('s-result').hidden = true; $('s-follow').hidden = true; } };
render();
