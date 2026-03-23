import React from 'react'
import styles from './AboutSection.module.css'

const PILLS = ['35+ anni', 'km zero', 'vista lago']

function AboutSection() {
  return (
    <section id="about" className={styles.section} aria-label="Chi siamo e contatti">
      <div className={styles.container}>

        <div className={styles.story}>
          <p className={`section-label ${styles.label}`}>La Nostra Storia</p>
          <h2 className={styles.title}>Dal 1987, una cucina<br />che sa di casa.</h2>
          <p className={styles.text}>
            Osteria Bellavista nasce dalla passione di una famiglia ticinese per la buona tavola.
            Da oltre trent'anni proponiamo ricette della tradizione locale, preparate con ingredienti
            a km zero e il vino delle cantine regionali.
          </p>
          <div className={styles.pills} aria-label="Caratteristiche">
            {PILLS.map(pill => (
              <span key={pill} className={styles.pill}>{pill}</span>
            ))}
          </div>
        </div>

        <div className={styles.contactCol}>
          <iframe
            title="Posizione Osteria Bellavista su Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44074.61!2d8.9510!3d46.0037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47842de0b0e11961%3A0x34f65b5ee1f8d3ee!2sLugano%2C+Switzerland!5e0!3m2!1sen!2sch!4v1"
            className={styles.map}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className={styles.contacts}>
            <div className={styles.contactBlock}>
              <h3>Dove siamo</h3>
              <p>Via Lago 12<br />6900 Lugano, Ticino</p>
              <p>+41 91 123 45 67</p>
            </div>
            <div className={styles.contactBlock}>
              <h3>Orari</h3>
              <p>Martedì – Sabato<br />12:00–14:30 · 19:00–22:00</p>
              <p>Domenica: 12:00–15:00</p>
              <p style={{ color: 'var(--color-terracotta)' }}>Lunedì: chiuso</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default AboutSection
