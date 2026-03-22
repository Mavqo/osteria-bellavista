import React from 'react'
import styles from './StepForm.module.css'

function StepGuests({ value, onChange, onNext, onBack, loading, error }) {
  const valid = value.name.trim().length > 0 && value.party_size >= 1 && value.party_size <= 10

  return (
    <div className={styles.step}>
      <h3 className={styles.stepTitle}>I tuoi dati</h3>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Nome *
          <input
            type="text"
            className={styles.input}
            value={value.name}
            onChange={e => onChange({ ...value, name: e.target.value })}
            maxLength={100}
            aria-label="Nome"
          />
        </label>
        <label className={styles.label}>Telefono
          <input
            type="tel"
            className={styles.input}
            value={value.phone}
            onChange={e => onChange({ ...value, phone: e.target.value })}
            aria-label="Telefono"
          />
        </label>
        <label className={styles.label}>Numero coperti *
          <input
            type="number"
            className={styles.input}
            min={1}
            max={10}
            value={value.party_size}
            onChange={e => onChange({ ...value, party_size: parseInt(e.target.value, 10) || 1 })}
            aria-label="Numero coperti"
          />
        </label>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.nav}>
        <button className={styles.btnSecondary} onClick={onBack} disabled={loading}>← Indietro</button>
        <button className={styles.btn} disabled={!valid || loading} onClick={onNext}>
          {loading ? 'Invio...' : 'Conferma prenotazione'}
        </button>
      </div>
    </div>
  )
}

export default StepGuests
