import React, { useEffect, useState } from 'react'
import styles from './StepForm.module.css'
import { fetchSlots } from '../api/bookingApi.js'

function StepTime({ date, value, onChange, onNext, onBack }) {
  const [slots, setSlots] = useState([])
  const [available, setAvailable] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetchSlots(date)
      .then(data => {
        setAvailable(data.date_available)
        setSlots(data.slots)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [date])

  return (
    <div className={styles.step}>
      <h3 className={styles.stepTitle}>Scegli l&apos;orario</h3>
      {loading && <p className={styles.muted}>Caricamento disponibilità...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && !available && (
        <p className={styles.muted}>Nessuna disponibilità per questa data — prova con un&apos;altra.</p>
      )}
      {!loading && !error && available && (
        <div className={styles.slotGrid} role="group" aria-label="Orari disponibili">
          {slots.map(slot => (
            <button
              key={slot}
              className={`${styles.slotBtn} ${value === slot ? styles.slotSelected : ''}`}
              onClick={() => onChange(slot)}
              aria-pressed={value === slot}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
      <div className={styles.nav}>
        <button className={styles.btnSecondary} onClick={onBack}>← Indietro</button>
        <button className={styles.btn} disabled={!value} onClick={onNext}>Avanti →</button>
      </div>
    </div>
  )
}

export default StepTime
