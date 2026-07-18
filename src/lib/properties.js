/**
 * src/lib/properties.js
 * Property API helpers — wraps the backend /api/properties endpoints.
 */
import { apiGet, apiPost, apiPut, apiDelete } from './api';

export async function getAllProperties(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const path = `/properties${params ? '?' + params : ''}`;
  const data = await apiGet(path);
  return data.data?.properties || [];
}

export async function getPropertyBySlug(slug) {
  const data = await apiGet(`/properties/${slug}`);
  return data.data?.property || null;
}

export async function getRealtorProperties() {
  const data = await apiGet('/properties/realtor/mine');
  return data.data?.properties || [];
}

export async function createProperty(payload) {
  const data = await apiPost('/properties', payload);
  return data.data?.property || null;
}

export async function updateProperty(id, payload) {
  const data = await apiPut(`/properties/${id}`, payload);
  return data.data?.property || null;
}

export async function deleteProperty(id) {
  await apiDelete(`/properties/${id}`);
}

export async function incrementViews(id) {
  try { await apiPost(`/properties/${id}/view`, {}); } catch { /* silent */ }
}
