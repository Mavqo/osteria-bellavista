import React from 'react'
import styles from './StepForm.module.css'

function StepDate({ value, onChange, onNext }) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className={styles.step}>
      <h3 className={styles.stepTitle}>Scegli la data</h3>
      <input
        type="date"
        className={styles.input}
        min={today}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Data prenotazione"
      />
      <button
        className={styles.btn}
        disabled={!value}
        onClick={onNext}
      >
        Avanti →
      </button>
    </div>
  )
}

export default StepDate
