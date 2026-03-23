import React, { useEffect, useState } from 'react'
import formStyles from './StepForm.module.css'
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
    <div>
      <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '1.25rem', fontSize: '1.3rem' }}>
        Scegli l&apos;orario
      </h3>
      {loading && <p style={{ color: 'var(--color-stone)', fontSize: '0.9rem' }}>Caricamento disponibilità...</p>}
      {error && <p className={formStyles.error}>{error}</p>}
      {!loading && !error && !available && (
        <p style={{ color: 'var(--color-stone)', fontSize: '0.9rem' }}>
          Nessuna disponibilità per questa data — prova con un&apos;altra.
        </p>
      )}
      {!loading && !error && available && (
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}
          role="group"
          aria-label="Orari disponibili"
        >
          {slots.map(slot => (
            <button
              key={slot}
              onClick={() => onChange(slot)}
              aria-pressed={value === slot}
              style={{
                padding: '0.5rem 1rem',
                border: value === slot ? '2px solid var(--color-olive)' : '2px solid var(--color-sand)',
                borderRadius: '6px',
                background: value === slot ? 'var(--color-olive)' : 'var(--color-white)',
                color: value === slot ? 'var(--color-white)' : 'var(--color-dark)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                fontWeight: value === slot ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
      <div className={formStyles.actions}>
        <button className={formStyles.btnBack} onClick={onBack}>← Indietro</button>
        <button className={formStyles.btnNext} disabled={!value} onClick={onNext}>Avanti →</button>
      </div>
    </div>
  )
}

export default StepTime
