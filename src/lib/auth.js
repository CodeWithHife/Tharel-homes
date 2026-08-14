/**
 * src/lib/auth.js
 * Instant client-side authentication engine using localStorage.
 * No external backend process required!
 */

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

export async function loginWithBackend(payload) {
  const storedUsers = JSON.parse(localStorage.getItem("mock_users_db") || "[]");
  const existing = storedUsers.find((u) => u.email?.toLowerCase() === payload.email?.toLowerCase());

  const mockToken = "tharel_token_" + Date.now();
  setStoredToken(mockToken);

  const user = existing || {
    id: "user_" + Date.now(),
    firstName: payload.email.split("@")[0] || "Client",
    lastName: "User",
    email: payload.email,
    role: "buyer",
    onboardingDone: true,
    subscriptionPlan: "basic",
  };

  persistUser(user);
  return { token: mockToken, user };
}

export async function signupWithBackend(payload) {
  const mockToken = "tharel_token_" + Date.now();
  setStoredToken(mockToken);

  const newUser = {
    id: "user_" + Date.now(),
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    role: payload.role || "buyer",
    onboardingDone: false,
    subscriptionPlan: "basic",
  };

  const storedUsers = JSON.parse(localStorage.getItem("mock_users_db") || "[]");
  storedUsers.push(newUser);
  localStorage.setItem("mock_users_db", JSON.stringify(storedUsers));

  persistUser(newUser);
  return { token: mockToken, user: newUser };
}

export async function getAuthenticatedUser() {
  return getStoredAuthUser();
}

export async function updateProfileWithBackend(payload) {
  const current = getStoredAuthUser() || {};
  const updated = { ...current, ...payload };
  persistUser(updated);

  // Update in mock DB
  const storedUsers = JSON.parse(localStorage.getItem("mock_users_db") || "[]");
  const idx = storedUsers.findIndex((u) => u.id === current.id);
  if (idx !== -1) {
    storedUsers[idx] = { ...storedUsers[idx], ...payload };
    localStorage.setItem("mock_users_db", JSON.stringify(storedUsers));
  }

  return updated;
}

export async function completeOnboardingWithBackend(answers) {
  const current = getStoredAuthUser() || {};
  const updated = { ...current, onboardingDone: true, onboardingAnswers: answers };
  persistUser(updated);

  const storedUsers = JSON.parse(localStorage.getItem("mock_users_db") || "[]");
  const idx = storedUsers.findIndex((u) => u.id === current.id);
  if (idx !== -1) {
    storedUsers[idx] = updated;
    localStorage.setItem("mock_users_db", JSON.stringify(storedUsers));
  }

  return updated;
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
