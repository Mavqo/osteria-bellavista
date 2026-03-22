import React from 'react'
import styles from './AboutSection.module.css'

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
        </div>
        <div className={styles.info}>
          <div className={styles.infoBlock}>
            <h3>Dove siamo</h3>
            <p>Via Lago 12<br />6900 Lugano, Ticino</p>
            <p>+41 91 123 45 67</p>
          </div>
          <div className={styles.infoBlock}>
            <h3>Orari</h3>
            <p>Martedì – Sabato<br />12:00–14:30 · 19:00–22:00</p>
            <p>Domenica: 12:00–15:00</p>
            <p>Lunedì: chiuso</p>
          </div>
          <div className={`${styles.infoBlock} ${styles.mapPlaceholder}`} aria-label="Mappa Google Maps">
            <span>📍 Lugano, Ticino</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
