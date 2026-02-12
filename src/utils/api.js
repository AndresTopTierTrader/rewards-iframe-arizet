// API base: in dev use relative path (proxied by Vite to api.tx3funding.com);
// in production use full URL so requests go to api.tx3funding.com, not the iframe origin.
const API_BASE = import.meta.env.DEV
  ? '/api/iframe/rewards'
  : 'http://localhost:8000/api/iframe/rewards';

// Default API key for Arizet endpoint
const DEFAULT_API_KEY = 'vSSI4iMuwMZjCbMgzYDIj3o33dK3niKyYdPgrSil6xjdVzSQ0SQyZWt9mfVgXYSZr2hUMJPwYgni5TgfcL53leIcE3AxCjJrMuCxkCvtiOOHgU5a4fKRilacGeNOU3I7';

// Get API key from environment variable, URL parameter, or use default
export function getApiKey() {
  // Check for API key in URL query params first (highest priority)
  const urlKey = getParam('apiKey');
  if (urlKey) return urlKey;
  
  // Fallback to environment variable (if set in build)
  const envKey = import.meta.env.VITE_API_KEY || import.meta.env.VITE_REWARDS_API_KEY;
  if (envKey) return envKey;
  
  // Use default API key
  return DEFAULT_API_KEY;
}

// Get URL parameter
export function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Get user ID from token parameter in URL
export function getUserId() {
  return getParam('token');
}

// Add admin key to URL
export function withAdmin(url) {
  const params = new URLSearchParams(window.location.search);
  const s = params.toString();
  return url + (s ? ('?' + s) : '');
}

// Fetch JSON helper with API key authentication
export async function fetchJSON(url, opts = {}) {
  const apiKey = getApiKey();
  const headers = {
    'Accept': 'application/json',
    ...(opts.headers || {}),
  };

  // Auth: x-api-key header only (avoid apiKey in query string)
  if (apiKey) {
    headers['X-Api-Key'] = apiKey;
  }

  const res = await fetch(url, {
    ...opts,
    headers,
  });

  if (!res.ok) {
    const txt = await res.text();
    let json = null;
    try { json = txt ? JSON.parse(txt) : null; } catch {}
    const msg = (json && (json.message ?? json.detail)) || txt || res.statusText;
    const error = new Error(`${res.status} ${res.statusText}: ${msg}`);
    error.status = res.status;
    error.statusCode = res.status;
    throw error;
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

// Get user rewards data: GET /api/iframe/rewards/{user_id}
export function getUserRewardsRoute(userId) {
  return `${API_BASE}/${encodeURIComponent(userId)}`;
}

// Claim prize endpoint - PUT request to mark giveaway as inactive and blocked
const REWARDS_API_BASE = import.meta.env.DEV
  ? '/api'
  : 'http://localhost:8000/api';
export function claimPrizeRoute(giveawayId) {
  // Note: This endpoint is different from the iframe rewards endpoint
  return `${REWARDS_API_BASE}/rewards/giveaways/${giveawayId}`;
}

// Claim prize API call
export async function claimPrize(giveawayId, userData) {
  const payload = {
    locked: true,
    modifiedByUserId: String(userData.id),
    modifiedByEmail: userData.email || '',
    modifiedByName: userData.name || '',
  };
  
  return fetchJSON(claimPrizeRoute(giveawayId), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
