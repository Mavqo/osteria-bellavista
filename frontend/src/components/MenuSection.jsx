import React from 'react'
import { motion } from 'framer-motion'
import styles from './MenuSection.module.css'

const LEAF_ICON = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 4C14 4 6 8 6 16C6 20.4 9.6 24 14 24C18.4 24 22 20.4 22 16C22 8 14 4 14 4Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <line x1="14" y1="24" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const PLATE_ICON = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="14" y1="5" x2="14" y2="3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const FLAME_ICON = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 24C10.7 24 8 21.3 8 18C8 14 11 11 12 8C12.5 10 14 11.5 14 11.5C14 11.5 18 8.5 16 4C20 6 22 11 22 14C22 19.5 18.6 24 14 24Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
)

const FLOWER_ICON = (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <ellipse cx="14" cy="8" rx="2.5" ry="4" stroke="currentColor" strokeWidth="1.5"/>
    <ellipse cx="14" cy="20" rx="2.5" ry="4" stroke="currentColor" strokeWidth="1.5"/>
    <ellipse cx="8" cy="14" rx="4" ry="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <ellipse cx="20" cy="14" rx="4" ry="2.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const CATEGORIES = [
  {
    icon: LEAF_ICON,
    name: 'Antipasti',
    price: '€€ · 8–14€',
    dishes: [
      { name: 'Salumi ticinesi con mostarda', desc: 'Selezione di salumi locali con mostarda artigianale' },
      { name: 'Bruschette al pomodoro e basilico', desc: 'Pane casereccio tostato con pomodoro fresco' },
      { name: 'Carpaccio di manzo con rucola', desc: 'Manzo ticinese, rucola, grana, limone' },
    ],
  },
  {
    icon: PLATE_ICON,
    name: 'Primi',
    price: '€€ · 14–20€',
    dishes: [
      { name: 'Risotto al vino bianco con porcini', desc: 'Riso Carnaroli, porcini freschi, Ticino DOC' },
      { name: 'Tagliatelle al ragù di cinghiale', desc: 'Pasta fresca, ragù di cinghiale del bosco' },
      { name: 'Zuppa di farro e verdure', desc: 'Farro biologico, verdure di stagione, erbe' },
    ],
  },
  {
    icon: FLAME_ICON,
    name: 'Secondi',
    price: '€€€ · 22–32€',
    dishes: [
      { name: 'Brasato al Merlot ticinese', desc: 'Guancia di manzo, Merlot del Ticino, polenta' },
      { name: 'Filetto di lavarello del lago', desc: 'Lavarello del Lago di Lugano, erbe aromatiche' },
      { name: 'Costolette d\'agnello alle erbe', desc: 'Agnello di montagna, rosmarino, timo, patate' },
    ],
  },
  {
    icon: FLOWER_ICON,
    name: 'Dolci',
    price: '€ · 7–10€',
    dishes: [
      { name: 'Tiramisù della casa', desc: 'Ricetta tradizionale, mascarpone, caffè espresso' },
      { name: 'Panna cotta al miele di acacia', desc: 'Miele di acacia locale, coulis di frutti rossi' },
      { name: 'Torta di noci valtellinesi', desc: 'Noci della Valtellina, caramello, panna fresca' },
    ],
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.1 },
  }),
}

function MenuSection() {
  return (
    <section className={styles.section} id="menu">
      <div className={styles.container}>
        <div className={styles.intro}>
          <span className={styles.label}>Il Menu</span>
          <h2 className={styles.heading}>Una cucina che onora il territorio</h2>
          <p className={styles.text}>
            Ogni piatto nasce dal rispetto per gli ingredienti locali e per la tradizione
            ticinese. Collaboriamo con produttori della regione per portare in tavola
            sapori autentici, stagione dopo stagione.
          </p>
          <div className={styles.leafDeco} aria-hidden="true">
            {LEAF_ICON}
          </div>
        </div>

        <div className={styles.grid}>
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              className={styles.card}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              <div className={styles.cardIcon}>{cat.icon}</div>
              <h3 className={styles.cardTitle}>{cat.name}</h3>
              <span className={styles.cardPrice}>{cat.price}</span>
              <ul className={styles.dishList}>
                {cat.dishes.map((dish) => (
                  <li key={dish.name} className={styles.dishItem}>
                    <span className={styles.dishName}>{dish.name}</span>
                    <span className={styles.dishDesc}>{dish.desc}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MenuSection
