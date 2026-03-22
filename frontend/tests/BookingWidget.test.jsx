import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BookingWidget from '../src/components/BookingWidget.jsx'

// Mock bookingApi
vi.mock('../src/api/bookingApi.js', () => ({
  fetchSlots: vi.fn(),
  createBooking: vi.fn(),
}))

import { fetchSlots, createBooking } from '../src/api/bookingApi.js'

beforeEach(() => {
  fetchSlots.mockReset()
  createBooking.mockReset()
})

describe('BookingWidget', () => {
  it('shows step 1 (date picker) initially', () => {
    render(<BookingWidget />)
    expect(screen.getByLabelText(/data prenotazione/i)).toBeInTheDocument()
  })

  it('advances to step 2 after selecting a date', async () => {
    fetchSlots.mockResolvedValue({ date_available: true, slots: ['20:00', '21:00'] })
    render(<BookingWidget />)
    const dateInput = screen.getByLabelText(/data prenotazione/i)
    await userEvent.type(dateInput, '2026-04-01')
    await userEvent.click(screen.getByRole('button', { name: /avanti/i }))
    await waitFor(() => expect(screen.getByText("Scegli l'orario")).toBeInTheDocument())
  })

  it('shows no availability message when date_available is false', async () => {
    fetchSlots.mockResolvedValue({ date_available: false, slots: [] })
    render(<BookingWidget />)
    const dateInput = screen.getByLabelText(/data prenotazione/i)
    await userEvent.type(dateInput, '2026-04-01')
    await userEvent.click(screen.getByRole('button', { name: /avanti/i }))
    await waitFor(() =>
      expect(screen.getByText(/nessuna disponibilità/i)).toBeInTheDocument()
    )
  })

  it('shows confirmation after successful booking', async () => {
    fetchSlots.mockResolvedValue({ date_available: true, slots: ['20:00'] })
    createBooking.mockResolvedValue({
      id: 1, name: 'Luca', date: '2026-04-01', time_slot: '20:00', party_size: 2, status: 'confirmed',
    })
    render(<BookingWidget />)

    // Step 1: date
    await userEvent.type(screen.getByLabelText(/data prenotazione/i), '2026-04-01')
    await userEvent.click(screen.getByRole('button', { name: /avanti/i }))

    // Step 2: time slot
    await waitFor(() => expect(screen.getByText('20:00')).toBeInTheDocument())
    await userEvent.click(screen.getByText('20:00'))
    await userEvent.click(screen.getByRole('button', { name: /avanti/i }))

    // Step 3: guest data
    await waitFor(() => expect(screen.getByLabelText(/nome/i)).toBeInTheDocument())
    await userEvent.type(screen.getByLabelText(/nome/i), 'Luca')
    await userEvent.click(screen.getByRole('button', { name: /conferma prenotazione/i }))

    // Step 4: confirmation
    await waitFor(() =>
      expect(screen.getByText(/prenotazione confermata/i)).toBeInTheDocument()
    )
  })
})
