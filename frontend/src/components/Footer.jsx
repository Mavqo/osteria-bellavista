import React from 'react'
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer id="footer" className={styles.footer} aria-label="Footer">
      <div className={styles.container}>
        <span className={styles.brand}>Osteria Bellavista</span>
        <p className={styles.address}>Via Lago 12 · 6900 Lugano</p>
        <p className={styles.copy}>© 2026 Osteria Bellavista · Demo portfolio</p>
      </div>
    </footer>
  )
}

export default Footer
