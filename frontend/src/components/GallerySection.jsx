import React from 'react'
import styles from './GallerySection.module.css'

const PLACEHOLDERS = [
  { id: 1, label: 'Risotto al Merlot', wide: true },
  { id: 2, label: 'Vista lago', wide: false },
  { id: 3, label: 'Tavoli in terrazza', wide: false },
  { id: 4, label: 'Dolci della casa', wide: false },
  { id: 5, label: 'Ingredienti freschi', wide: true },
  { id: 6, label: 'Ambiente interno', wide: false },
]

function GallerySection() {
  return (
    <section id="gallery" className={styles.section} aria-label="Galleria">
      <div className={styles.container}>
        <p className={`section-label ${styles.label}`}>Galleria</p>
        <h2 className={styles.title}>Un angolo di Ticino<br />nel cuore di Lugano.</h2>
        <div className={styles.grid}>
          {PLACEHOLDERS.map(p => (
            <div
              key={p.id}
              className={`${styles.item} ${p.wide ? styles.wide : ''}`}
              aria-label={p.label}
            >
              <span className={styles.caption}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GallerySection
