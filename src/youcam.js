// Minimal YouCam API client (docs.perfectcorp.com). Skin Analysis flow:
// POST /file -> PUT upload -> POST /task/skin-analysis -> poll GET /task/skin-analysis/{id}
const BASE = process.env.YOUCAM_BASE || 'https://yce-api-01.makeupar.com';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(key, path, opts = {}) {
  const res = await fetch(BASE + path, { ...opts, headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(opts.headers || {}) } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || (body.status && body.status !== 200)) {
    const e = new Error(body.error || `HTTP ${res.status}`); e.code = body.error_code || res.status; throw e;
  }
  return body.data;
}

export async function analyze(key, jpeg /* Buffer */, actions) {
  const up = await api(key, '/s2s/v2.0/file', { method: 'POST', body: JSON.stringify({ files: [{ content_type: 'image/jpeg', file_name: 'selfie.jpg', file_size: jpeg.length }] }) });
  const f = up.files[0], r = f.requests[0];
  const put = await fetch(r.url, { method: r.method || 'PUT', headers: r.headers, body: jpeg });
  if (!put.ok) throw new Error('upload failed ' + put.status);
  const t = await api(key, '/s2s/v2.0/task/skin-analysis', { method: 'POST', body: JSON.stringify({ src_file_id: f.file_id, dst_actions: actions, format: 'json' }) });
  for (let i = 0; i < 40; i++) {
    await sleep(i < 3 ? 1500 : 3000);
    const s = await api(key, `/s2s/v2.0/task/skin-analysis/${encodeURIComponent(t.task_id)}`);
    if (s.task_status === 'success') return s.results.output;
    if (s.task_status === 'error') { const e = new Error(s.error?.message || s.error || 'analysis failed'); e.code = s.error_code || 'task_error'; throw e; }
  }
  throw new Error('timed out waiting for YouCam');
}
