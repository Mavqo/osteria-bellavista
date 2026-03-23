import React from 'react'
import styles from './Footer.module.css'

const INSTAGRAM_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)

const FACEBOOK_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

function Footer() {
  return (
    <footer id="footer" className={styles.footer} aria-label="Footer">
      <div className={styles.container}>
        <div className={styles.col}>
          <span className={styles.brand}>Osteria Bellavista</span>
          <p className={styles.tagline}>Tradizione ticinese dal 1987</p>
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>Link rapidi</p>
          <nav aria-label="Footer navigation">
            <ul className={styles.links}>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#booking">Prenota</a></li>
              <li><a href="#about">Contatti</a></li>
            </ul>
          </nav>
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>Seguici</p>
          <div className={styles.social}>
            <a href="#" aria-label="Instagram" className={styles.socialLink}>
              {INSTAGRAM_ICON}
            </a>
            <a href="#" aria-label="Facebook" className={styles.socialLink}>
              {FACEBOOK_ICON}
            </a>
          </div>
          <p className={styles.hours}>Mar–Sab 12:00–22:00</p>
          <p className={styles.hours}>Dom 12:00–15:00</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 Osteria Bellavista · Demo portfolio · Via Lago 12, Lugano</p>
      </div>
    </footer>
  )
}

export default Footer
