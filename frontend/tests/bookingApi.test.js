import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchSlots, createBooking } from '../src/api/bookingApi.js'

function mockFetch(status, body) {
  return vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
  }))
}

beforeEach(() => { vi.clearAllMocks() })
afterEach(() => { vi.unstubAllGlobals() })

describe('fetchSlots', () => {
  it('returns slots on success', async () => {
    mockFetch(200, { date_available: true, slots: ['12:00', '20:00'] })
    const result = await fetchSlots('2026-03-25')
    expect(result.date_available).toBe(true)
    expect(result.slots).toEqual(['12:00', '20:00'])
  })

  it('throws with detail message on error', async () => {
    mockFetch(422, { detail: 'date must not be in the past' })
    await expect(fetchSlots('2020-01-01')).rejects.toThrow('date must not be in the past')
  })
})

describe('createBooking', () => {
  it('returns booking on 201', async () => {
    const booking = { id: 1, name: 'Luca', date: '2026-03-25', time_slot: '20:00', party_size: 2, status: 'confirmed' }
    mockFetch(201, booking)
    const result = await createBooking({ name: 'Luca', date: '2026-03-25', time_slot: '20:00', party_size: 2 })
    expect(result.id).toBe(1)
    expect(result.status).toBe('confirmed')
  })

  it('throws with detail message on 409', async () => {
    mockFetch(409, { detail: 'slot is fully booked' })
    await expect(createBooking({ name: 'X', date: '2026-03-25', time_slot: '20:00', party_size: 2 })).rejects.toThrow('slot is fully booked')
  })
})
