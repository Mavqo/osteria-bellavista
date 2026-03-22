import React, { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      aria-label="Navigazione principale"
    >
      <span className={styles.brand}>Osteria Bellavista</span>

      <ul className={styles.navLinks} role="list">
        <li><a href="#menu">Menu</a></li>
        <li><a href="#gallery">Gallery</a></li>
        <li><a href="#booking">Prenota</a></li>
        <li><a href="#about">Contatti</a></li>
      </ul>

      <button
        className={styles.hamburger}
        aria-label="Menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(o => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      {menuOpen && (
        <ul className={styles.mobileMenu} role="list">
          <li><a href="#menu" onClick={() => setMenuOpen(false)}>Menu</a></li>
          <li><a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a></li>
          <li><a href="#booking" onClick={() => setMenuOpen(false)}>Prenota</a></li>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>Contatti</a></li>
        </ul>
      )}
    </nav>
  )
}

export default Navbar
