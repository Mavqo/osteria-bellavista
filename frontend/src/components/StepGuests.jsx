import React from 'react'
import formStyles from './StepForm.module.css'

function StepGuests({ value, onChange, onNext, onBack, loading, error }) {
  function setField(field, val) {
    onChange({ ...value, [field]: val })
  }

  return (
    <div>
      <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '1.25rem', fontSize: '1.3rem' }}>
        I tuoi dati
      </h3>

      {/* Nome */}
      <div className={formStyles.fieldWrapper}>
        <input
          type="text"
          className={formStyles.input}
          value={value.name}
          onChange={e => setField('name', e.target.value)}
          placeholder=" "
          required
          aria-label="Nome e cognome"
        />
        <label className={formStyles.label}>Nome e cognome *</label>
      </div>

      {/* Telefono */}
      <div className={formStyles.fieldWrapper}>
        <input
          type="tel"
          className={formStyles.input}
          value={value.phone}
          onChange={e => setField('phone', e.target.value)}
          placeholder=" "
          aria-label="Telefono (opzionale)"
        />
        <label className={formStyles.label}>Telefono (opzionale)</label>
      </div>

      {/* Stepper coperti */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-stone)', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Numero di coperti
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => setField('party_size', Math.max(1, value.party_size - 1))}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1.5px solid var(--color-stone)', background: 'none',
              fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            aria-label="Diminuisci coperti"
          >−</button>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, minWidth: 24, textAlign: 'center' }}>
            {value.party_size}
          </span>
          <button
            type="button"
            onClick={() => setField('party_size', Math.min(10, value.party_size + 1))}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1.5px solid var(--color-olive)', background: 'none',
              fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-olive)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            aria-label="Aumenta coperti"
          >+</button>
        </div>
      </div>

      {error && <p className={formStyles.error}>{error}</p>}

      <div className={formStyles.actions}>
        <button className={formStyles.btnBack} onClick={onBack}>← Indietro</button>
        <button
          className={formStyles.btnNext}
          onClick={onNext}
          disabled={!value.name.trim() || loading}
        >
          {loading ? 'Conferma...' : 'Conferma prenotazione →'}
        </button>
      </div>
    </div>
  )
}

export default StepGuests
