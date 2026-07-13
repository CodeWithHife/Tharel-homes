/**
 * src/lib/hotels.js
 * Hotel & Booking API helpers — wraps the backend /api/hotels endpoints.
 */
import { apiGet, apiPost, apiPut, apiDelete } from './api';

// ── HOTEL LISTINGS ─────────────────────────────────────────────────────────────
export async function getAllHotels() {
  const data = await apiGet('/hotels');
  return data.data?.hotels || [];
}

export async function getMyHotels() {
  const data = await apiGet('/hotels/mine');
  return data.data?.hotels || [];
}

export async function createHotel(payload) {
  const data = await apiPost('/hotels', payload);
  return data.data?.hotel || null;
}

export async function updateHotel(id, payload) {
  const data = await apiPut(`/hotels/${id}`, payload);
  return data.data?.hotel || null;
}

export async function deleteHotel(id) {
  await apiDelete(`/hotels/${id}`);
}

// ── BOOKINGS ──────────────────────────────────────────────────────────────────
export async function getMyAllBookings() {
  const data = await apiGet('/hotels/bookings/mine');
  return data.data?.bookings || [];
}

export async function getHotelBookings(hotelId) {
  const data = await apiGet(`/hotels/${hotelId}/bookings`);
  return data.data?.bookings || [];
}

export async function createBooking(hotelId, payload) {
  const data = await apiPost(`/hotels/${hotelId}/bookings`, payload);
  return data.data?.booking || null;
}

export async function updateBookingStatus(bookingId, status) {
  const data = await apiPut(`/hotels/bookings/${bookingId}/status`, { status });
  return data.data?.booking || null;
}

export async function deleteBooking(bookingId) {
  await apiDelete(`/hotels/bookings/${bookingId}`);
}
