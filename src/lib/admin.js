/**
 * src/lib/admin.js
 * Admin API helpers — wraps the backend /api/admin endpoints.
 */
import { apiGet, apiPut, apiDelete, apiPost } from './api';

export async function getAdminStats() {
  const data = await apiGet('/admin/stats');
  return data.data?.stats || {};
}

export async function getAllUsersForAdmin() {
  const data = await apiGet('/admin/users');
  return data.data?.users || [];
}

export async function deleteUser(userId) {
  await apiDelete(`/admin/users/${userId}`);
}

export async function upgradeSubscription(userId, planId) {
  const data = await apiPut(`/admin/users/${userId}/subscription`, { planId });
  return data.data?.user || null;
}

export async function getContacts() {
  const data = await apiGet('/admin/contacts');
  return data.data?.contacts || [];
}

export async function updateContactStatus(contactId, status) {
  const data = await apiPut(`/admin/contacts/${contactId}/status`, { status });
  return data.data?.contact || null;
}

export async function getAllPropertiesForAdmin() {
  const data = await apiGet('/admin/properties');
  return data.data?.properties || [];
}

// Subscription plan definitions (shared reference)
export const SUBSCRIPTION_PLANS = [
  { id: 'basic',   name: 'Basic',         price: 'Free',    maxListings: 1 },
  { id: 'plus',    name: 'Plus',          price: '₦5,000',  maxListings: 5 },
  { id: 'premium', name: 'Premium',       price: '₦25,000', maxListings: 20 },
  { id: 'super',   name: 'Super Premium', price: '₦50,000', maxListings: Infinity },
];

export function getSubscriptionPlan(planId) {
  return SUBSCRIPTION_PLANS.find(p => p.id === planId) || SUBSCRIPTION_PLANS[0];
}
