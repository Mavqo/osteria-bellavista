import React from 'react'
import styles from './BookingSection.module.css'
import BookingWidget from './BookingWidget.jsx'

function BookingSection() {
  return (
    <section id="booking" className={styles.section} aria-label="Prenotazioni">
      <div className={styles.container}>
        <p className="section-label" style={{ color: 'var(--color-olive)', marginBottom: '0.5rem' }}>
          Prenota il tuo tavolo
        </p>
        <h2 className={styles.title}>Riserva il tuo posto<br />con un click.</h2>
        <BookingWidget />
      </div>
    </section>
  )
}

export default BookingSection
