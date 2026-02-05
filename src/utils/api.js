// API base path (relative, will be proxied by Vite)
// Maps to localhost:8000/api/iframe/rewards
const API_BASE = '/api/iframe/rewards';

// Get URL parameter
export function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Add admin key to URL
export function withAdmin(url) {
  const params = new URLSearchParams(window.location.search);
  const s = params.toString();
  return url + (s ? ('?' + s) : '');
}

// Fetch JSON helper
export async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      'Accept': 'application/json',
      ...(opts.headers || {}),
    },
  });
  
  if (!res.ok) {
    const txt = await res.text();
    let json = null;
    try { json = txt ? JSON.parse(txt) : null; } catch {}
    const msg = json && json.detail ? json.detail : (txt || res.statusText);
    throw new Error(`${res.status} ${res.statusText}: ${msg}`);
  }
  
  return res.json();
}

// POST helper
export async function post(url) {
  return fetchJSON(withAdmin(url), { method: 'POST' });
}

// API route builders
export function apiRoute(path) {
  return `${API_BASE}${path}`;
}
