import React from 'react'
import { motion } from 'framer-motion'
import styles from './GallerySection.module.css'
import imgRisotto from '../assets/gallery-risotto.jpg'
import imgLago from '../assets/gallery-lago.jpg'
import imgTerrazza from '../assets/gallery-terrazza.jpg'
import imgDolce from '../assets/gallery-dolce.jpg'
import imgIngredienti from '../assets/gallery-ingredienti.jpg'
import imgInterno from '../assets/gallery-interno.jpg'

const PHOTOS = [
  { src: imgRisotto,     alt: 'Risotto ai porcini — il nostro piatto firma',    label: 'Risotto ai porcini',    className: styles.wide },
  { src: imgLago,        alt: 'Vista sul Lago di Lugano dalle colline ticinesi', label: 'Vista lago',            className: styles.tall },
  { src: imgTerrazza,    alt: 'Terrazza con tavoli apparecchiati a lume di candela', label: 'La terrazza',       className: styles.normal },
  { src: imgDolce,       alt: 'Dessert al piatto con decorazione artigianale',   label: 'I nostri dolci',        className: styles.normal },
  { src: imgIngredienti, alt: 'Ingredienti freschi: pomodori ed erbe aromatiche', label: 'Km zero',             className: styles.normal },
  { src: imgInterno,     alt: 'Interno dell\'osteria con arredamento rustico in legno caldo', label: 'L\'osteria', className: styles.panoramic },
]

const photoVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.08 },
  }),
}

function GallerySection() {
  return (
    <section
      className={styles.section}
      id="gallery"
      aria-label="Galleria fotografica"
    >
      <div className={styles.header}>
        <span className={styles.label}>Galleria</span>
        <h2 className={styles.heading}>Atmosfera e sapori</h2>
      </div>

      <div className={styles.grid}>
        {PHOTOS.map((photo, i) => (
          <motion.div
            key={photo.alt}
            className={`${styles.item} ${photo.className}`}
            custom={i}
            variants={photoVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            <img src={photo.src} alt={photo.alt} className={styles.img} />
            <div className={styles.overlay}>
              <span className={styles.overlayLabel}>{photo.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default GallerySection
