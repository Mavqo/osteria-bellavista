import React from 'react'
import styles from './BookingSection.module.css'
import BookingWidget from './BookingWidget.jsx'

function BookingSection() {
  return (
    <section id="booking" className={styles.section} aria-label="Prenota un tavolo">
      <div className={styles.header}>
        <p className={`section-label ${styles.label}`}>Prenotazioni</p>
        <h2 className={styles.title}>Prenota il tuo tavolo</h2>
        <p className={styles.subtitle}>Disponibilità in tempo reale · Conferma immediata</p>
      </div>
      <BookingWidget />
    </section>
  )
}

export default BookingSection
