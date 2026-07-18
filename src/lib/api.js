/**
 * src/lib/api.js
 * Central API client — auto-injects Bearer token, unified error handling.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('auth_token');
}

function buildHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res) {
  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { error: text || 'Request failed' }; }

  if (!res.ok) {
    const msg = data.error || data.message || `Request failed with status ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function apiGet(path) {
  return handleResponse(await fetch(`${BASE}${path}`, { headers: buildHeaders() }));
}

export async function apiPost(path, body) {
  return handleResponse(await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  }));
}

export async function apiPut(path, body) {
  return handleResponse(await fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  }));
}

export async function apiDelete(path) {
  return handleResponse(await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(),
  }));
}
