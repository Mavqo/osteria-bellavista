import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './Hero.module.css'
import heroImg from '../assets/hero.jpg'

function Hero() {
  const [showScroll, setShowScroll] = useState(true)

  useEffect(() => {
    function hide() { setShowScroll(false) }
    window.addEventListener('scroll', hide, { once: true, passive: true })
    return () => window.removeEventListener('scroll', hide)
  }, [])

  return (
    <section id="hero" className={styles.hero} aria-label="Hero">
      <img
        src={heroImg}
        alt="Interno Osteria Bellavista"
        className={styles.heroImg}
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0 }}
        >
          <span className={`section-label ${styles.badge}`}>
            Dal 1987 · Lugano, Ticino
          </span>
        </motion.div>

        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
        >
          Una cucina che<br />racconta il territorio.
        </motion.h1>

        <motion.p
          className={styles.tagline}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.25 }}
        >
          Tradizione ticinese, ingredienti locali, vista lago.
        </motion.p>

        <motion.a
          href="#booking"
          className={styles.cta}
          aria-label="Prenota un tavolo"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
        >
          Prenota un tavolo →
        </motion.a>
      </div>

      {showScroll && (
        <div className={styles.scrollIndicator} aria-hidden="true">
          <span>↓</span>
        </div>
      )}
    </section>
  )
}

export default Hero
