const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

/**
 * Fetch available time slots for a given date.
 * @param {string} date — ISO date string, e.g. "2026-03-25"
 * @returns {Promise<{ date_available: boolean, slots: string[] }>}
 */
export async function fetchSlots(date) {
  const res = await fetch(`${BASE_URL}/slots?date=${encodeURIComponent(date)}`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? `HTTP ${res.status}`)
  }
  return res.json()
}

/**
 * Create a booking.
 * @param {{ name: string, phone?: string, date: string, time_slot: string, party_size: number }} booking
 * @returns {Promise<{ id: number, name: string, date: string, time_slot: string, party_size: number, status: string }>}
 */
export async function createBooking(booking) {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail ?? `HTTP ${res.status}`)
  }
  return res.json()
}
