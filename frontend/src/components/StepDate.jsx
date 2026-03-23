import React from 'react'
import formStyles from './StepForm.module.css'

function StepDate({ value, onChange, onNext }) {
  return (
    <div>
      <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '1.25rem', fontSize: '1.3rem' }}>
        Scegli la data
      </h3>
      <div className={formStyles.fieldWrapper}>
        <input
          type="date"
          className={formStyles.input}
          value={value}
          onChange={e => onChange(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          placeholder=" "
          aria-label="Data prenotazione"
        />
        <label className={formStyles.label}>Data</label>
      </div>
      <div className={formStyles.actions}>
        <button
          className={formStyles.btnNext}
          onClick={onNext}
          disabled={!value}
        >
          Avanti →
        </button>
      </div>
    </div>
  )
}

export default StepDate
