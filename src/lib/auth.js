/**
 * src/lib/auth.js
 * Auth helpers — signup, login, getMe, updateProfile, completeOnboarding, logout.
 * Token and user are stored in localStorage under 'auth_token' and 'auth_user'.
 */

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api') + '/auth';

// ── Storage helpers ────────────────────────────────────────────────────────────
export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('auth_token');
}

function setStoredToken(token) {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem('auth_token', token);
  else window.localStorage.removeItem('auth_token');
}

function persistUser(user) {
  if (typeof window === 'undefined') return;
  if (user) window.localStorage.setItem('auth_user', JSON.stringify(user));
  else window.localStorage.removeItem('auth_user');
}

function buildHeaders(extra = {}) {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = getStoredToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function parseResponse(response) {
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { error: text || 'Request failed' }; }
  return { response, data };
}

// ── API calls ──────────────────────────────────────────────────────────────────
export async function loginWithBackend(payload) {
  const { response, data } = await parseResponse(
    await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );

  if (!response.ok) throw new Error(data.error || data.message || 'Login failed.');

  if (data.token) setStoredToken(data.token);

  const user = data.data?.user || data.user || null;
  persistUser(user);
  return { ...data, user };
}

export async function signupWithBackend(payload) {
  const { response, data } = await parseResponse(
    await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );

  if (!response.ok) throw new Error(data.error || data.message || 'Signup failed.');

  if (data.token) setStoredToken(data.token);

  const user = data.data?.user || data.user || null;
  persistUser(user);
  return { ...data, user };
}

export async function getAuthenticatedUser() {
  const { response, data } = await parseResponse(
    await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: buildHeaders(),
    })
  );

  if (!response.ok) throw new Error(data.error || data.message || 'Unable to load your account.');

  const user = data.data?.user || data.user || null;
  persistUser(user);
  return user;
}

export async function updateProfileWithBackend(payload) {
  const { response, data } = await parseResponse(
    await fetch(`${API_BASE_URL}/me`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    })
  );

  if (!response.ok) throw new Error(data.error || data.message || 'Profile update failed.');

  const user = data.data?.user || data.user || null;
  persistUser(user);
  return user;
}

export async function completeOnboardingWithBackend(answers) {
  const { response, data } = await parseResponse(
    await fetch(`${API_BASE_URL}/onboarding`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify({ answers }),
    })
  );

  if (!response.ok) throw new Error(data.error || data.message || 'Onboarding failed.');

  const user = data.data?.user || data.user || null;
  persistUser(user);
  return user;
}

export function logoutAuth() {
  setStoredToken(null);
  persistUser(null);
}

export function getStoredAuthUser() {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem('auth_user');
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

// Alias used by storage.js and other files that call getCurrentUser()
export function getCurrentUser() {
  return getStoredAuthUser();
}
