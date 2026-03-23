import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './BookingWidget.module.css'
import StepDate from './StepDate.jsx'
import StepTime from './StepTime.jsx'
import StepGuests from './StepGuests.jsx'
import StepConfirm from './StepConfirm.jsx'
import { createBooking } from '../api/bookingApi.js'

const STEPS = ['Data', 'Orario', 'Dati', 'Conferma']

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
}

function BookingWidget() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [guests, setGuests] = useState({ name: '', phone: '', party_size: 2 })
  const [confirmed, setConfirmed] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function goTo(next) {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

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
      goTo(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100

  return (
    <div className={styles.widget}>
      <div className={styles.progressHeader}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.progressLabels} aria-label="Passaggi prenotazione">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`${styles.stepLabel} ${i + 1 === step ? styles.active : ''} ${i + 1 < step ? styles.done : ''}`}
            >
              {i + 1 < step ? '✓ ' : ''}{label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {step === 1 && (
              <StepDate value={date} onChange={setDate} onNext={() => goTo(2)} />
            )}
            {step === 2 && (
              <StepTime
                date={date}
                value={timeSlot}
                onChange={setTimeSlot}
                onNext={() => goTo(3)}
                onBack={() => goTo(1)}
              />
            )}
            {step === 3 && (
              <StepGuests
                value={guests}
                onChange={setGuests}
                onNext={handleSubmit}
                onBack={() => goTo(2)}
                loading={loading}
                error={error}
              />
            )}
            {step === 4 && <StepConfirm booking={confirmed} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BookingWidget
