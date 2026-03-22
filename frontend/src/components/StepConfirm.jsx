import React from 'react'
import styles from './StepForm.module.css'

function StepConfirm({ booking }) {
  if (!booking) return null
  return (
    <div className={styles.step} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>&#10003;</div>
      <h3 className={styles.stepTitle}>Prenotazione confermata!</h3>
      <p className={styles.muted}>
        {booking.name} — {booking.date} alle {booking.time_slot} per {booking.party_size} {booking.party_size === 1 ? 'persona' : 'persone'}
      </p>
      <p className={styles.muted} style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
        Il ristorante riceverà una notifica con i tuoi dati.
      </p>
    </div>
  )
}

export default StepConfirm
