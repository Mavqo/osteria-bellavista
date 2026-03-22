import React from 'react'
import styles from './Hero.module.css'

function Hero() {
  return (
    <section id="hero" className={styles.hero} aria-label="Hero">
      <nav className={styles.nav} aria-label="Navigazione principale">
        <span className={styles.brand}>Osteria Bellavista</span>
        <ul className={styles.navLinks} role="list">
          <li><a href="#menu">Menu</a></li>
          <li><a href="#booking">Prenota</a></li>
          <li><a href="#about">Contatti</a></li>
        </ul>
      </nav>

      <div className={styles.content}>
        <h1 className={styles.title}>
          Una cucina che<br />racconta il territorio.
        </h1>
        <p className={styles.tagline}>
          Tradizione ticinese, ingredienti locali, vista lago.
        </p>
        <a href="#booking" className={styles.cta} aria-label="Prenota un tavolo">
          Prenota un tavolo →
        </a>
      </div>
    </section>
  )
}

export default Hero
