import React from 'react'
import { motion } from 'framer-motion'

function StepConfirm({ booking }) {
  return (
    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
      {/* Checkmark animato */}
      <motion.svg
        width="72" height="72" viewBox="0 0 72 72"
        fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ margin: '0 auto 1.5rem', display: 'block' }}
      >
        <motion.circle
          cx="36" cy="36" r="32"
          stroke="var(--color-olive)" strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.path
          d="M22 37l10 10 18-20"
          stroke="var(--color-olive)" strokeWidth="3.5"
          strokeLinecap="round" strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.55 }}
        />
      </motion.svg>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h3 style={{
          fontFamily: 'var(--font-title)', fontSize: '1.5rem',
          marginBottom: '0.5rem', color: 'var(--color-dark)'
        }}>
          Prenotazione confermata!
        </h3>
        <p style={{ color: 'var(--color-stone)', marginBottom: '1.5rem' }}>
          Ti aspettiamo. A presto!
        </p>

        {booking && (
          <div style={{
            background: 'var(--color-white)', borderRadius: '10px',
            padding: '1.25rem', textAlign: 'left',
            border: '1px solid rgba(139,115,85,0.15)',
            fontSize: '0.9rem', lineHeight: 2
          }}>
            <div>👤 <strong>{booking.name}</strong></div>
            <div>📅 {booking.date}</div>
            <div>⏰ {booking.time_slot}</div>
            <div>👥 {booking.party_size} {booking.party_size === 1 ? 'coperto' : 'coperti'}</div>
          </div>
        )}

        <a
          href="#"
          onClick={e => e.preventDefault()}
          style={{
            display: 'inline-block', marginTop: '1.25rem',
            fontSize: '0.85rem', color: 'var(--color-stone)',
            textDecoration: 'underline', textDecorationStyle: 'dotted'
          }}
        >
          + Aggiungi al calendario
        </a>
      </motion.div>
    </div>
  )
}

export default StepConfirm
