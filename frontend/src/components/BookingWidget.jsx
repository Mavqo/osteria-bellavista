import React, { useState } from 'react'
import styles from './BookingWidget.module.css'
import StepDate from './StepDate.jsx'
import StepTime from './StepTime.jsx'
import StepGuests from './StepGuests.jsx'
import StepConfirm from './StepConfirm.jsx'
import { createBooking } from '../api/bookingApi.js'

const STEPS = ['Data', 'Orario', 'Dati', 'Conferma']

function BookingWidget() {
  const [step, setStep] = useState(1)
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [guests, setGuests] = useState({ name: '', phone: '', party_size: 2 })
  const [confirmed, setConfirmed] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      const result = await createBooking({
        name: guests.name,
        phone: guests.phone || undefined,
        date,
        time_slot: timeSlot,
        party_size: guests.party_size,
      })
      setConfirmed(result)
      setStep(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.widget}>
      {/* Step indicator */}
      <div className={styles.steps} aria-label="Passaggi prenotazione" role="list">
        {STEPS.map((label, i) => (
          <div
            key={label}
            role="listitem"
            className={`${styles.stepDot} ${i + 1 === step ? styles.active : ''} ${i + 1 < step ? styles.done : ''}`}
          >
            <span className={styles.dotNum}>{i + 1 < step ? '✓' : i + 1}</span>
            <span className={styles.dotLabel}>{label}</span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className={styles.content}>
        {step === 1 && (
          <StepDate
            value={date}
            onChange={setDate}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepTime
            date={date}
            value={timeSlot}
            onChange={setTimeSlot}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepGuests
            value={guests}
            onChange={setGuests}
            onNext={handleSubmit}
            onBack={() => setStep(2)}
            loading={loading}
            error={error}
          />
        )}
        {step === 4 && <StepConfirm booking={confirmed} />}
      </div>
    </div>
  )
}

export default BookingWidget
