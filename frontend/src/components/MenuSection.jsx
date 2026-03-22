import React from 'react'
import styles from './MenuSection.module.css'

const CATEGORIES = [
  { icon: '🥗', label: 'Antipasti', items: ['Salumi ticinesi', 'Bruschette al pomodoro', 'Carpaccio di manzo'] },
  { icon: '🍝', label: 'Primi', items: ['Risotto al vino bianco', 'Tagliatelle al ragù', 'Zuppa di farro'] },
  { icon: '🥩', label: 'Secondi', items: ['Brasato al Merlot', 'Filetto di pesce lago', 'Costolette d\'agnello'] },
  { icon: '🍮', label: 'Dolci', items: ['Tiramisù della casa', 'Panna cotta al miele', 'Torta di noci'] },
]

function MenuSection() {
  return (
    <section id="menu" className={styles.section} aria-label="Il menu">
      <div className={styles.container}>
        <p className={`section-label ${styles.label}`}>Il Menu</p>
        <h2 className={styles.title}>Sapori autentici<br />del territorio ticinese.</h2>
        <div className={styles.grid}>
          {CATEGORIES.map(cat => (
            <div key={cat.label} className={styles.card}>
              <span className={styles.icon}>{cat.icon}</span>
              <h3 className={styles.cardTitle}>{cat.label}</h3>
              <ul className={styles.items}>
                {cat.items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MenuSection
