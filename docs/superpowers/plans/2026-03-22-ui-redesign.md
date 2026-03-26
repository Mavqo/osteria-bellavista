# Osteria Bellavista UI/UX Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trasformare il sito demo da scheletro funzionale a prodotto visivamente professionale, con foto reali, animazioni Framer Motion chirurgiche e un booking widget redesignato.

**Architecture:** Redesign puro frontend (CSS Modules + React) senza toccare backend o API. Si aggiunge `framer-motion` come unica dipendenza nuova. La Navbar viene estratta da Hero in componente separato. Tutti gli altri componenti vengono riscritti in-place mantenendo la stessa struttura file.

**Tech Stack:** React 19 + Vite, CSS Modules, Framer Motion, Vitest + Testing Library (già configurati)

**Spec:** `docs/superpowers/specs/2026-03-22-ui-redesign-design.md`

---

## File Map

| File | Azione | Responsabilità |
| --- | --- | --- |
| `frontend/src/index.css` | Modifica | Token colori (aggiunge `--color-stone`), scala tipografica |
| `frontend/src/App.jsx` | Modifica | Aggiunge `<Navbar />`, rimuove nav da Hero |
| `frontend/src/components/Navbar.jsx` | Crea | Navbar sticky trasparente→solida con scroll |
| `frontend/src/components/Navbar.module.css` | Crea | Stili navbar + transizione scroll |
| `frontend/src/components/Hero.jsx` | Modifica | Foto real, overlay, testo bottom-left, scroll indicator, Framer Motion |
| `frontend/src/components/Hero.module.css` | Modifica | Layout foto + overlay + animazioni |
| `frontend/src/components/MenuSection.jsx` | Modifica | Two-column, SVG icons, prezzi, descrizioni, stagger |
| `frontend/src/components/MenuSection.module.css` | Modifica | Grid due colonne, card hover |
| `frontend/src/components/GallerySection.jsx` | Modifica | Foto reali, mosaico grid, hover overlay, scroll-reveal |
| `frontend/src/components/GallerySection.module.css` | Modifica | grid-template-areas mosaico, tablet fallback |
| `frontend/src/components/BookingSection.module.css` | Modifica | Dark bg, texture, titolo |
| `frontend/src/components/BookingWidget.jsx` | Modifica | Progress bar, AnimatePresence slide transitions |
| `frontend/src/components/BookingWidget.module.css` | Modifica | Widget card, progress bar, label styles |
| `frontend/src/components/StepForm.module.css` | Modifica | CSS condiviso: input floating label, bottoni step |
| `frontend/src/components/StepGuests.jsx` | Modifica | Stepper +/− per party_size, label flottanti |
| `frontend/src/components/StepDate.jsx` | Modifica | Label flottante, placeholder=" " |
| `frontend/src/components/StepTime.jsx` | Modifica | Slot buttons restyled |
| `frontend/src/components/StepConfirm.jsx` | Modifica | Checkmark SVG animato, ticket riepilogo |
| `frontend/src/components/AboutSection.jsx` | Modifica | Two-column, pillole stat, Google Maps iframe |
| `frontend/src/components/AboutSection.module.css` | Modifica | Layout due colonne, pillole, mappa |
| `frontend/src/components/Footer.jsx` | Modifica | 3 colonne, social icons SVG |
| `frontend/src/components/Footer.module.css` | Modifica | Grid 3 col, separatore, stack mobile |
| `frontend/src/assets/hero.jpg` | Crea | Foto hero ristorante (download) |
| `frontend/src/assets/gallery-*.jpg` | Crea (×6) | Foto gallery (download) |
| `frontend/tests/Hero.test.jsx` | Modifica | Aggiorna: brand si trova in Navbar ora |
| `frontend/tests/StaticSections.test.jsx` | Modifica | Aggiorna: nuove label, nuovi elementi |
| `frontend/tests/App.test.jsx` | Modifica | Aggiorna se necessario per Navbar |

---

## Task 1: Setup — installa Framer Motion + aggiorna design tokens

**Files:**
- Modify: `frontend/package.json` (via npm install)
- Modify: `frontend/src/index.css`

- [ ] **Step 1.1: Installa framer-motion**

```bash
cd /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend
npm install framer-motion
```

Expected: `framer-motion` aggiunto a `dependencies` in `package.json`, no errors.

- [ ] **Step 1.2: Aggiungi `--color-stone` e aggiorna scala tipografica in `index.css`**

Sostituisci il blocco `:root` esistente in `frontend/src/index.css`:

```css
:root {
  --color-dark:       #111111;
  --color-olive:      #3d6b4f;
  --color-terracotta: #c4614a;
  --color-sand:       #e8d5b0;
  --color-cream:      #f7f3ee;
  --color-white:      #ffffff;
  --color-stone:      #8b7355;

  --font-title: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', 'Helvetica Neue', sans-serif;

  --section-padding: clamp(3rem, 6vw, 6rem) clamp(1rem, 5vw, 4rem);
}
```

Aggiorna il body font-size da 16px a 17px e line-height a 1.75:

```css
body {
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.75;
  color: var(--color-dark);
  background-color: var(--color-cream);
}
```

- [ ] **Step 1.3: Verifica build**

```bash
cd /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend
npm run build
```

Expected: build completata senza errori.

- [ ] **Step 1.4: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/src/index.css
git commit -m "feat: add framer-motion, update design tokens and typography scale"
```

---

## Task 2: Download immagini Unsplash

**Files:**
- Crea: `frontend/src/assets/hero.jpg`
- Crea: `frontend/src/assets/gallery-risotto.jpg`
- Crea: `frontend/src/assets/gallery-lago.jpg` (verticale/portrait)
- Crea: `frontend/src/assets/gallery-terrazza.jpg`
- Crea: `frontend/src/assets/gallery-dolce.jpg`
- Crea: `frontend/src/assets/gallery-ingredienti.jpg`
- Crea: `frontend/src/assets/gallery-interno.jpg` (panoramica)

- [ ] **Step 2.1: Cerca e scarica le foto**

Per ogni immagine:
1. Vai su `unsplash.com`
2. Cerca usando il termine indicato sotto
3. Scegli una foto di qualità, clicca su "Download free" o usa l'URL CDN diretto
4. L'URL CDN ha formato: `https://images.unsplash.com/photo-<ID>?w=<WIDTH>&q=80`
5. Scarica con curl

Termini di ricerca e dimensioni target:

```bash
# HERO — cerca: "italian restaurant interior warm light rustic"
# Scegli una foto calda con tavoli in legno, dimensioni 1920px
curl -L "https://images.unsplash.com/photo-SOSTITUISCI_ID?w=1920&q=85" \
  -o /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend/src/assets/hero.jpg

# RISOTTO — cerca: "risotto mushroom truffle italian plating"
curl -L "https://images.unsplash.com/photo-SOSTITUISCI_ID?w=900&q=80" \
  -o /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend/src/assets/gallery-risotto.jpg

# LAGO — cerca: "lake lugano switzerland" oppure "lake como italy hills"
# IMPORTANTE: scegli una foto VERTICALE (portrait orientation)
curl -L "https://images.unsplash.com/photo-SOSTITUISCI_ID?w=600&h=900&fit=crop&q=80" \
  -o /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend/src/assets/gallery-lago.jpg

# TERRAZZA — cerca: "restaurant terrace candles evening outdoor"
curl -L "https://images.unsplash.com/photo-SOSTITUISCI_ID?w=900&q=80" \
  -o /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend/src/assets/gallery-terrazza.jpg

# DOLCE — cerca: "italian dessert tiramisu plate elegant"
curl -L "https://images.unsplash.com/photo-SOSTITUISCI_ID?w=900&q=80" \
  -o /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend/src/assets/gallery-dolce.jpg

# INGREDIENTI — cerca: "fresh herbs tomatoes vegetables rustic wood"
curl -L "https://images.unsplash.com/photo-SOSTITUISCI_ID?w=900&q=80" \
  -o /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend/src/assets/gallery-ingredienti.jpg

# INTERNO — cerca: "rustic italian restaurant interior wood warm"
# Scegli panoramica (landscape), più larga che alta
curl -L "https://images.unsplash.com/photo-SOSTITUISCI_ID?w=1200&q=80" \
  -o /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend/src/assets/gallery-interno.jpg
```

- [ ] **Step 2.2: Verifica dimensioni file**

```bash
ls -lh /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend/src/assets/*.jpg
```

Expected: 7 file `.jpg`, tutti > 50KB (se troppo piccoli, ri-scarica con qualità maggiore).

- [ ] **Step 2.3: Commit immagini**

```bash
git add frontend/src/assets/
git commit -m "feat: add hero and gallery images from Unsplash"
```

---

## Task 3: Navbar — componente separato + sticky

**Files:**
- Crea: `frontend/src/components/Navbar.jsx`
- Crea: `frontend/src/components/Navbar.module.css`
- Modifica: `frontend/src/components/Hero.jsx` (rimuovi `<nav>`)
- Modifica: `frontend/src/App.jsx` (aggiungi `<Navbar />`)
- Modifica: `frontend/tests/Hero.test.jsx` (brand ora in Navbar)

- [ ] **Step 3.1: Aggiorna test Hero — brand si sposta in Navbar**

Il test che cerca "Osteria Bellavista" in `Hero` fallirà perché il brand ora è in `Navbar`. Aggiorna `frontend/tests/Hero.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Hero from '../src/components/Hero.jsx'

describe('Hero', () => {
  it('renders the hero section', () => {
    render(<Hero />)
    expect(screen.getByRole('region', { name: /hero/i })).toBeInTheDocument()
  })

  it('renders the CTA link pointing to #booking', () => {
    render(<Hero />)
    const cta = screen.getByRole('link', { name: /prenota un tavolo/i })
    expect(cta).toBeInTheDocument()
    expect(cta.getAttribute('href')).toBe('#booking')
  })
})
```

- [ ] **Step 3.2: Crea test per Navbar**

Aggiungi file `frontend/tests/Navbar.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Navbar from '../src/components/Navbar.jsx'

describe('Navbar', () => {
  it('renders brand name', () => {
    render(<Navbar />)
    expect(screen.getByText('Osteria Bellavista')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /menu/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /gallery/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /prenota/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contatti/i })).toBeInTheDocument()
  })

  it('renders hamburger button on mobile (aria)', () => {
    render(<Navbar />)
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3.3: Esegui test — devono fallire**

```bash
cd /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend
npm run test -- tests/Navbar.test.jsx
```

Expected: FAIL — `Navbar.jsx` non esiste ancora.

- [ ] **Step 3.4: Crea `Navbar.jsx`**

```jsx
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
```

- [ ] **Step 3.5: Crea `Navbar.module.css`**

```css
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem clamp(1rem, 5vw, 4rem);
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease,
              padding 0.3s ease;
}

.nav.scrolled {
  background-color: rgba(17, 17, 17, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.brand {
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-sand);
  font-weight: 600;
  z-index: 1;
}

.navLinks {
  list-style: none;
  display: flex;
  gap: 2rem;
}

.navLinks a {
  font-size: 0.85rem;
  color: rgba(232, 213, 176, 0.75);
  transition: color 0.2s;
}

.navLinks a:hover {
  color: var(--color-sand);
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  z-index: 1;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background-color: var(--color-sand);
  transition: opacity 0.2s;
}

/* Mobile dropdown */
.mobileMenu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  list-style: none;
  background-color: rgba(17, 17, 17, 0.96);
  backdrop-filter: blur(12px);
  max-height: 200px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.mobileMenu li a {
  display: block;
  padding: 1rem clamp(1rem, 5vw, 4rem);
  font-size: 0.9rem;
  color: var(--color-sand);
  transition: background-color 0.15s;
}

.mobileMenu li a:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

@media (max-width: 640px) {
  .navLinks {
    display: none;
  }

  .hamburger {
    display: flex;
  }
}
```

- [ ] **Step 3.6: Aggiorna `Hero.jsx` — rimuovi `<nav>` interno**

Rimuovi l'intero blocco `<nav>` da `Hero.jsx`. Il componente risultante deve essere:

```jsx
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
```

- [ ] **Step 3.7: Aggiorna `Hero.module.css`**

```css
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--color-sand);
}

.heroImg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.25) 55%,
    rgba(0, 0, 0, 0.1) 100%
  );
}

.content {
  position: relative;
  z-index: 10;
  margin-top: auto;
  padding: 0 clamp(1rem, 5vw, 4rem) clamp(3rem, 8vh, 6rem);
  max-width: 680px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
}

.badge {
  color: var(--color-sand);
  opacity: 0.85;
  letter-spacing: 0.2em;
  font-size: 0.7rem;
}

.title {
  font-size: clamp(2.8rem, 6vw, 5.5rem);
  font-weight: 700;
  color: var(--color-white);
  line-height: 1.1;
  margin: 0;
}

.tagline {
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
}

.cta {
  display: inline-block;
  background-color: var(--color-olive);
  color: var(--color-white);
  padding: 0.9rem 2rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color 0.2s, transform 0.15s;
}

.cta:hover {
  background-color: #2d5239;
  transform: translateY(-2px);
}

.scrollIndicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 40px;
  height: 40px;
  border: 1.5px solid rgba(232, 213, 176, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(232, 213, 176, 0.6);
  font-size: 0.9rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50%       { transform: translateX(-50%) translateY(6px); }
}
```

- [ ] **Step 3.8: Aggiorna `App.jsx`**

```jsx
import React from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import MenuSection from './components/MenuSection.jsx'
import GallerySection from './components/GallerySection.jsx'
import BookingSection from './components/BookingSection.jsx'
import AboutSection from './components/AboutSection.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <main>
        <MenuSection />
        <GallerySection />
        <BookingSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  )
}

export default App
```

- [ ] **Step 3.9: Esegui tutti i test**

```bash
cd /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend
npm run test
```

Expected: tutti i test passano. Se Hero.test.jsx fallisce per "Osteria Bellavista", controlla che il test sia stato aggiornato allo Step 3.1.

- [ ] **Step 3.10: Verifica build**

```bash
npm run build
```

Expected: build senza errori.

- [ ] **Step 3.11: Commit**

```bash
git add frontend/src/components/Navbar.jsx frontend/src/components/Navbar.module.css \
        frontend/src/components/Hero.jsx frontend/src/components/Hero.module.css \
        frontend/src/App.jsx frontend/tests/Hero.test.jsx frontend/tests/Navbar.test.jsx
git commit -m "feat: extract Navbar with sticky scroll effect, redesign Hero with photo and Framer Motion"
```

---

## Task 4: Menu Section redesign

**Files:**
- Modifica: `frontend/src/components/MenuSection.jsx`
- Modifica: `frontend/src/components/MenuSection.module.css`
- Modifica: `frontend/tests/StaticSections.test.jsx`

- [ ] **Step 4.1: Aggiorna test MenuSection**

I nuovi piatti hanno descrizioni. Il test cerca ancora "Antipasti" etc — quelli rimangono, ma aggiungi un check sul layout:

```jsx
// In StaticSections.test.jsx, aggiorna solo il blocco MenuSection:
describe('MenuSection', () => {
  it('renders all 4 categories', () => {
    render(<MenuSection />)
    expect(screen.getByText('Antipasti')).toBeInTheDocument()
    expect(screen.getByText('Primi')).toBeInTheDocument()
    expect(screen.getByText('Secondi')).toBeInTheDocument()
    expect(screen.getByText('Dolci')).toBeInTheDocument()
  })

  it('renders price range for each category', () => {
    render(<MenuSection />)
    // Ogni card ha una fascia prezzo
    const prices = screen.getAllByText(/€/)
    expect(prices.length).toBeGreaterThanOrEqual(4)
  })
})
```

- [ ] **Step 4.2: Esegui test — devono passare ancora (contenuto invariato per ora)**

```bash
npm run test -- tests/StaticSections.test.jsx
```

- [ ] **Step 4.3: Riscrivi `MenuSection.jsx`**

```jsx
import React from 'react'
import { motion } from 'framer-motion'
import styles from './MenuSection.module.css'

const LEAF_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 2.5-1.5 6-5 8" />
    <path d="M12 22V12M12 12C9 9 5 8.5 4 9" />
  </svg>
)

const PLATE_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12h8M12 8v8" />
  </svg>
)

const FLAME_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 2C8 6 6 10 8 14c-2-1-3-3-3-5C3 14 5 20 12 22c7-2 9-8 7-13-1 3-3 4-5 3 2-3 1-7-2-10z" />
  </svg>
)

const FLOWER_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2a3 3 0 0 1 0 6M12 22a3 3 0 0 0 0-6M2 12a3 3 0 0 1 6 0M22 12a3 3 0 0 0-6 0" />
  </svg>
)

const CATEGORIES = [
  {
    icon: LEAF_ICON,
    label: 'Antipasti',
    price: '€ · 8–16',
    items: [
      { name: 'Salumi ticinesi con mostarda', desc: 'Selezione di salumi artigianali locali' },
      { name: 'Bruschette al pomodoro', desc: 'Pane tostato, pomodoro fresco e basilico' },
      { name: 'Carpaccio di manzo', desc: 'Con rucola, parmigiano e olio extravergine' },
    ],
  },
  {
    icon: PLATE_ICON,
    label: 'Primi',
    price: '€€ · 14–22',
    items: [
      { name: 'Risotto al vino bianco', desc: 'Con porcini e tartufo estivo' },
      { name: 'Tagliatelle al ragù', desc: 'Ragù di cinghiale della Valmaggia' },
      { name: 'Zuppa di farro', desc: 'Con verdure di stagione e erbe locali' },
    ],
  },
  {
    icon: FLAME_ICON,
    label: 'Secondi',
    price: '€€€ · 22–38',
    items: [
      { name: 'Brasato al Merlot', desc: 'Cottura lenta nel vino delle cantine ticinesi' },
      { name: 'Filetto di lavarello', desc: 'Pesce del lago con verdure grigliate' },
      { name: 'Costolette d\'agnello', desc: 'Con erbe aromatiche e patate al forno' },
    ],
  },
  {
    icon: FLOWER_ICON,
    label: 'Dolci',
    price: '€ · 7–12',
    items: [
      { name: 'Tiramisù della casa', desc: 'Ricetta tradizionale della famiglia Bianchi' },
      { name: 'Panna cotta al miele', desc: 'Con miele di acacia del Malcantone' },
      { name: 'Torta di noci', desc: 'Noci valtellinesi, caramello e panna montata' },
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
    <section id="menu" className={styles.section} aria-label="Il menu">
      <div className={styles.container}>
        <div className={styles.intro}>
          <p className={`section-label ${styles.label}`}>Il Menu</p>
          <h2 className={styles.title}>Sapori autentici<br />del territorio ticinese.</h2>
          <p className={styles.text}>
            Ogni piatto nasce dalla collaborazione con produttori locali.
            Ingredienti a km zero, vini delle cantine del Mendrisiotto,
            ricette che tramandano la memoria di questa terra.
          </p>
        </div>

        <div className={styles.grid}>
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              className={styles.card}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={cardVariants}
            >
              <div className={styles.cardIcon}>{cat.icon}</div>
              <h3 className={styles.cardTitle}>{cat.label}</h3>
              <span className={styles.price}>{cat.price}</span>
              <ul className={styles.items}>
                {cat.items.map(item => (
                  <li key={item.name} className={styles.item}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemDesc}>{item.desc}</span>
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
```

- [ ] **Step 4.4: Riscrivi `MenuSection.module.css`**

```css
.section {
  padding: var(--section-padding);
  background-color: var(--color-cream);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.intro {
  position: sticky;
  top: 120px;
}

.label {
  color: var(--color-olive);
  margin-bottom: 1rem;
}

.title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--color-dark);
  margin-bottom: 1.5rem;
}

.text {
  color: var(--color-stone);
  font-size: 1rem;
  line-height: 1.8;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.card {
  background-color: var(--color-white);
  border-radius: 12px;
  padding: 1.75rem;
  border: 1px solid rgba(139, 115, 85, 0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(61, 107, 79, 0.12);
}

.cardIcon {
  color: var(--color-olive);
  margin-bottom: 0.75rem;
}

.cardTitle {
  font-family: var(--font-title);
  font-size: 1.25rem;
  color: var(--color-dark);
  margin-bottom: 0.25rem;
}

.price {
  font-size: 0.78rem;
  color: var(--color-terracotta);
  font-weight: 600;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 1rem;
}

.items {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.itemName {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-dark);
}

.itemDesc {
  font-size: 0.8rem;
  color: var(--color-stone);
}

@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .intro {
    position: static;
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4.5: Esegui test**

```bash
npm run test -- tests/StaticSections.test.jsx
```

Expected: tutti e i test passano.

- [ ] **Step 4.6: Verifica build**

```bash
npm run build
```

- [ ] **Step 4.7: Commit**

```bash
git add frontend/src/components/MenuSection.jsx frontend/src/components/MenuSection.module.css \
        frontend/tests/StaticSections.test.jsx
git commit -m "feat: redesign MenuSection with two-column layout, SVG icons, prices, and scroll-reveal"
```

---

## Task 5: Gallery Section redesign

**Files:**
- Modifica: `frontend/src/components/GallerySection.jsx`
- Modifica: `frontend/src/components/GallerySection.module.css`

- [ ] **Step 5.1: Riscrivi `GallerySection.jsx`**

```jsx
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
  { src: imgRisotto,     alt: 'Risotto al Merlot',      cls: 'wide' },
  { src: imgLago,        alt: 'Vista lago',              cls: 'tall' },
  { src: imgTerrazza,    alt: 'Tavoli in terrazza',      cls: '' },
  { src: imgDolce,       alt: 'Dolci della casa',        cls: '' },
  { src: imgIngredienti, alt: 'Ingredienti freschi',     cls: '' },
  { src: imgInterno,     alt: 'Ambiente interno',        cls: 'panorama' },
]

function GallerySection() {
  return (
    <section id="gallery" className={styles.section} aria-label="Galleria">
      <div className={styles.container}>
        <p className={`section-label ${styles.label}`}>Galleria</p>
        <h2 className={styles.title}>Un angolo di Ticino<br />nel cuore di Lugano.</h2>
        <div className={styles.grid}>
          {PHOTOS.map((photo, i) => (
            <motion.div
              key={photo.alt}
              className={`${styles.item} ${photo.cls ? styles[photo.cls] : ''}`}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.07 }}
            >
              <img src={photo.src} alt={photo.alt} className={styles.img} />
              <div className={styles.overlay} aria-hidden="true">
                <span className={styles.caption}>{photo.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GallerySection
```

- [ ] **Step 5.2: Riscrivi `GallerySection.module.css`**

```css
.section {
  padding: var(--section-padding);
  background-color: var(--color-dark);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.label {
  color: var(--color-olive);
  margin-bottom: 1rem;
}

.title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--color-sand);
  margin-bottom: 2.5rem;
}

/* Desktop mosaico */
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  grid-template-rows: 280px 280px;
  gap: 8px;
}

.item {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background-color: #222;
}

/* wide: occupa 2 colonne, prima riga */
.wide {
  grid-column: span 2;
}

/* tall: occupa 2 righe, terza colonna */
.tall {
  grid-row: span 2;
}

/* panorama: occupa tutte e 3 le colonne, seconda riga */
.panorama {
  grid-column: 1 / -1;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  display: block;
}

.item:hover .img {
  transform: scale(1.04);
}

/* Hover overlay */
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.65) 0%,
    transparent 50%
  );
  transform: translateY(100%);
  transition: transform 0.35s ease;
  display: flex;
  align-items: flex-end;
  padding: 1rem;
}

.item:hover .overlay {
  transform: translateY(0);
}

.caption {
  font-size: 0.82rem;
  color: var(--color-white);
  letter-spacing: 0.05em;
  font-weight: 500;
}

/* Tablet: 2 colonne uniformi */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: none;
    grid-auto-rows: 240px;
  }

  .wide,
  .tall,
  .panorama {
    grid-column: span 1;
    grid-row: span 1;
  }
}

/* Mobile: 1 colonna */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 220px;
  }
}
```

- [ ] **Step 5.3: Esegui test**

```bash
npm run test -- tests/StaticSections.test.jsx
```

Expected: `GallerySection renders gallery heading` continua a passare.

- [ ] **Step 5.4: Verifica build**

```bash
npm run build
```

- [ ] **Step 5.5: Commit**

```bash
git add frontend/src/components/GallerySection.jsx frontend/src/components/GallerySection.module.css
git commit -m "feat: redesign GallerySection with real images, CSS mosaic grid, and scroll-reveal"
```

---

## Task 6: Booking Widget redesign

**Files:**
- Modifica: `frontend/src/components/BookingSection.module.css`
- Modifica: `frontend/src/components/BookingWidget.jsx`
- Modifica: `frontend/src/components/BookingWidget.module.css`
- Modifica: `frontend/src/components/StepForm.module.css` (CSS condiviso step)
- Modifica: `frontend/src/components/StepGuests.jsx` (stepper +/−)
- Modifica: `frontend/src/components/StepDate.jsx` (placeholder + label)
- Modifica: `frontend/src/components/StepTime.jsx` (slot buttons)
- Modifica: `frontend/src/components/StepConfirm.jsx` (checkmark animato)
- Modifica: `frontend/tests/BookingWidget.test.jsx` (aggiorna selettori se necessario)

- [ ] **Step 6.1: Leggi i test booking esistenti**

```bash
cat /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend/tests/BookingWidget.test.jsx
```

Annota quali selettori usano, per aggiornarli dopo se necessario.

- [ ] **Step 6.2: Aggiorna `BookingSection.module.css`**

```css
.section {
  padding: var(--section-padding);
  background-color: var(--color-dark);
  /* noise texture sottile */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.label {
  color: var(--color-olive);
  margin-bottom: 1rem;
}

.title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--color-sand);
  margin-bottom: 0.75rem;
}

.subtitle {
  color: rgba(232, 213, 176, 0.6);
  font-size: 1rem;
}
```

- [ ] **Step 6.3: Aggiorna `BookingSection.jsx` per usare i nuovi stili header**

Leggi il file corrente poi aggiungici l'header testuale:

```jsx
import React from 'react'
import styles from './BookingSection.module.css'
import BookingWidget from './BookingWidget.jsx'

function BookingSection() {
  return (
    <section id="booking" className={styles.section} aria-label="Prenota un tavolo">
      <div className={styles.header}>
        <p className={`section-label ${styles.label}`}>Prenotazioni</p>
        <h2 className={styles.title}>Prenota il tuo tavolo</h2>
        <p className={styles.subtitle}>Disponibilità in tempo reale · Conferma immediata</p>
      </div>
      <BookingWidget />
    </section>
  )
}

export default BookingSection
```

- [ ] **Step 6.4: Riscrivi `BookingWidget.module.css`**

```css
.widget {
  max-width: 540px;
  margin: 0 auto;
  background-color: var(--color-cream);
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

/* Progress bar header */
.progressHeader {
  padding: 2rem 2.5rem 1.5rem;
  border-bottom: 1px solid rgba(139, 115, 85, 0.15);
}

.progressTrack {
  height: 3px;
  background-color: rgba(139, 115, 85, 0.2);
  border-radius: 2px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background-color: var(--color-olive);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.progressLabels {
  display: flex;
  justify-content: space-between;
}

.stepLabel {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: rgba(139, 115, 85, 0.45);
  transition: color 0.3s;
  text-transform: uppercase;
}

.stepLabel.active {
  color: var(--color-olive);
}

.stepLabel.done {
  color: var(--color-stone);
}

/* Step content area */
.content {
  padding: 2rem 2.5rem 2.5rem;
  min-height: 280px;
}

@media (max-width: 600px) {
  .progressHeader {
    padding: 1.5rem;
  }

  .content {
    padding: 1.5rem;
  }
}
```

- [ ] **Step 6.5: Aggiorna `BookingWidget.jsx`**

```jsx
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './BookingWidget.module.css'
import StepDate from './StepDate.jsx'
import StepTime from './StepTime.jsx'
import StepGuests from './StepGuests.jsx'
import StepConfirm from './StepConfirm.jsx'
import { createBooking } from '../api/bookingApi.js'

const STEPS = ['Data', 'Orario', 'Dati', 'Conferma']

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit:   (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
}

function BookingWidget() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [guests, setGuests] = useState({ name: '', phone: '', party_size: 2 })
  const [confirmed, setConfirmed] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function goTo(next) {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      const result = await createBooking({
        name: guests.name,
        phone: guests.phone || undefined,
        date,
        time_slot: timeSlot,
        party_size: guests.party_size,
      })
      setConfirmed(result)
      goTo(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100

  return (
    <div className={styles.widget}>
      <div className={styles.progressHeader}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.progressLabels} aria-label="Passaggi prenotazione">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`${styles.stepLabel} ${i + 1 === step ? styles.active : ''} ${i + 1 < step ? styles.done : ''}`}
            >
              {i + 1 < step ? '✓ ' : ''}{label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {step === 1 && (
              <StepDate value={date} onChange={setDate} onNext={() => goTo(2)} />
            )}
            {step === 2 && (
              <StepTime
                date={date}
                value={timeSlot}
                onChange={setTimeSlot}
                onNext={() => goTo(3)}
                onBack={() => goTo(1)}
              />
            )}
            {step === 3 && (
              <StepGuests
                value={guests}
                onChange={setGuests}
                onNext={handleSubmit}
                onBack={() => goTo(2)}
                loading={loading}
                error={error}
              />
            )}
            {step === 4 && <StepConfirm booking={confirmed} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BookingWidget
```

- [ ] **Step 6.6: Aggiorna `StepForm.module.css` (CSS condiviso per tutti gli step)**

```css
/* ===== Input con label flottante ===== */
.fieldWrapper {
  position: relative;
  margin-bottom: 1.25rem;
}

.input {
  width: 100%;
  padding: 1rem 1rem 0.5rem;
  padding-top: 1.4rem;
  border: 1.5px solid var(--color-sand);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  background-color: var(--color-white);
  color: var(--color-dark);
  transition: border-color 0.2s;
  outline: none;
}

.input:focus {
  border-color: var(--color-olive);
  outline: 2px solid var(--color-olive);
  outline-offset: 2px;
}

.label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  color: var(--color-stone);
  pointer-events: none;
  transition: top 0.2s ease, font-size 0.2s ease, color 0.2s ease;
}

/* Label flottante: quando input è focused O ha valore (non placeholder-shown) */
.input:focus ~ .label,
.input:not(:placeholder-shown) ~ .label {
  top: 0.45rem;
  font-size: 0.68rem;
  color: var(--color-olive);
  transform: translateY(0);
}

/* ===== Bottoni step ===== */
.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.75rem;
  justify-content: flex-end;
}

.btnNext {
  background-color: var(--color-olive);
  color: var(--color-white);
  padding: 0.75rem 1.75rem;
  border-radius: 2rem;
  border: none;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.15s;
}

.btnNext:hover:not(:disabled) {
  background-color: #2d5239;
  transform: translateY(-1px);
}

.btnNext:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btnBack {
  background-color: transparent;
  color: var(--color-stone);
  padding: 0.75rem 1.25rem;
  border-radius: 2rem;
  border: 1.5px solid var(--color-stone);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}

.btnBack:hover {
  color: var(--color-dark);
  border-color: var(--color-dark);
}

/* ===== Error message ===== */
.error {
  color: var(--color-terracotta);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}
```

- [ ] **Step 6.7: Leggi `StepDate.jsx` e `StepTime.jsx` attuali, poi aggiornali**

```bash
cat /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend/src/components/StepDate.jsx
cat /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend/src/components/StepTime.jsx
```

Aggiorna `StepDate.jsx` applicando la label flottante e i bottoni condivisi. Struttura base da seguire:

```jsx
import React from 'react'
import formStyles from './StepForm.module.css'

function StepDate({ value, onChange, onNext }) {
  return (
    <div>
      <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '1.25rem', fontSize: '1.3rem' }}>
        Scegli la data
      </h3>
      <div className={formStyles.fieldWrapper}>
        <input
          type="date"
          className={formStyles.input}
          value={value}
          onChange={e => onChange(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          placeholder=" "
          aria-label="Data prenotazione"
        />
        <label className={formStyles.label}>Data</label>
      </div>
      <div className={formStyles.actions}>
        <button
          className={formStyles.btnNext}
          onClick={onNext}
          disabled={!value}
        >
          Avanti →
        </button>
      </div>
    </div>
  )
}

export default StepDate
```

Per `StepTime.jsx`: mantieni la logica slot ma applica `formStyles.btnNext/btnBack` per i pulsanti e usa un grid di slot buttons con stile olive al selected.

- [ ] **Step 6.8: Riscrivi `StepGuests.jsx` con stepper +/−**

```jsx
import React from 'react'
import formStyles from './StepForm.module.css'
import styles from './StepForm.module.css'

function StepGuests({ value, onChange, onNext, onBack, loading, error }) {
  function setField(field, val) {
    onChange({ ...value, [field]: val })
  }

  return (
    <div>
      <h3 style={{ fontFamily: 'var(--font-title)', marginBottom: '1.25rem', fontSize: '1.3rem' }}>
        I tuoi dati
      </h3>

      {/* Nome */}
      <div className={formStyles.fieldWrapper}>
        <input
          type="text"
          className={formStyles.input}
          value={value.name}
          onChange={e => setField('name', e.target.value)}
          placeholder=" "
          required
          aria-label="Nome e cognome"
        />
        <label className={formStyles.label}>Nome e cognome *</label>
      </div>

      {/* Telefono */}
      <div className={formStyles.fieldWrapper}>
        <input
          type="tel"
          className={formStyles.input}
          value={value.phone}
          onChange={e => setField('phone', e.target.value)}
          placeholder=" "
          aria-label="Telefono (opzionale)"
        />
        <label className={formStyles.label}>Telefono (opzionale)</label>
      </div>

      {/* Stepper coperti */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-stone)', marginBottom: '0.5rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Numero di coperti
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => setField('party_size', Math.max(1, value.party_size - 1))}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1.5px solid var(--color-stone)', background: 'none',
              fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            aria-label="Diminuisci coperti"
          >−</button>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, minWidth: 24, textAlign: 'center' }}>
            {value.party_size}
          </span>
          <button
            type="button"
            onClick={() => setField('party_size', Math.min(10, value.party_size + 1))}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: '1.5px solid var(--color-olive)', background: 'none',
              fontSize: '1.2rem', cursor: 'pointer', color: 'var(--color-olive)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            aria-label="Aumenta coperti"
          >+</button>
        </div>
      </div>

      {error && <p className={formStyles.error}>{error}</p>}

      <div className={formStyles.actions}>
        <button className={formStyles.btnBack} onClick={onBack}>← Indietro</button>
        <button
          className={formStyles.btnNext}
          onClick={onNext}
          disabled={!value.name.trim() || loading}
        >
          {loading ? 'Conferma...' : 'Conferma prenotazione →'}
        </button>
      </div>
    </div>
  )
}

export default StepGuests
```

- [ ] **Step 6.9: Riscrivi `StepConfirm.jsx` con checkmark animato**

```jsx
import React from 'react'
import { motion } from 'framer-motion'

function StepConfirm({ booking }) {
  return (
    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
      {/* Checkmark animato */}
      <motion.svg
        width="72" height="72" viewBox="0 0 72 72"
        fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ margin: '0 auto 1.5rem', display: 'block' }}
      >
        <motion.circle
          cx="36" cy="36" r="32"
          stroke="var(--color-olive)" strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.path
          d="M22 37l10 10 18-20"
          stroke="var(--color-olive)" strokeWidth="3.5"
          strokeLinecap="round" strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.55 }}
        />
      </motion.svg>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h3 style={{
          fontFamily: 'var(--font-title)', fontSize: '1.5rem',
          marginBottom: '0.5rem', color: 'var(--color-dark)'
        }}>
          Prenotazione confermata!
        </h3>
        <p style={{ color: 'var(--color-stone)', marginBottom: '1.5rem' }}>
          Ti aspettiamo. A presto!
        </p>

        {booking && (
          <div style={{
            background: 'var(--color-white)', borderRadius: '10px',
            padding: '1.25rem', textAlign: 'left',
            border: '1px solid rgba(139,115,85,0.15)',
            fontSize: '0.9rem', lineHeight: 2
          }}>
            <div>👤 <strong>{booking.name}</strong></div>
            <div>📅 {booking.date}</div>
            <div>⏰ {booking.time_slot}</div>
            <div>👥 {booking.party_size} {booking.party_size === 1 ? 'coperto' : 'coperti'}</div>
          </div>
        )}

        <a
          href="#"
          onClick={e => e.preventDefault()}
          style={{
            display: 'inline-block', marginTop: '1.25rem',
            fontSize: '0.85rem', color: 'var(--color-stone)',
            textDecoration: 'underline', textDecorationStyle: 'dotted'
          }}
        >
          + Aggiungi al calendario
        </a>
      </motion.div>
    </div>
  )
}

export default StepConfirm
```

- [ ] **Step 6.10: Esegui test booking**

```bash
npm run test -- tests/BookingWidget.test.jsx
```

Expected: tutti i test passano. Se qualcuno fallisce per selettori cambiati (es. dot indicator non esiste più), aggiornali per matchare la nuova progress bar.

- [ ] **Step 6.11: Verifica build**

```bash
npm run build
```

- [ ] **Step 6.12: Commit**

```bash
git add frontend/src/components/Booking*.jsx frontend/src/components/Booking*.css \
        frontend/src/components/Step*.jsx frontend/src/components/StepForm.module.css \
        frontend/tests/BookingWidget.test.jsx
git commit -m "feat: redesign BookingWidget with progress bar, Framer Motion transitions, and animated confirm"
```

---

## Task 7: About Section redesign

**Files:**
- Modifica: `frontend/src/components/AboutSection.jsx`
- Modifica: `frontend/src/components/AboutSection.module.css`

- [ ] **Step 7.1: Riscrivi `AboutSection.jsx`**

```jsx
import React from 'react'
import styles from './AboutSection.module.css'

const PILLS = ['35+ anni', 'km zero', 'vista lago']

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
          <div className={styles.pills} aria-label="Caratteristiche">
            {PILLS.map(pill => (
              <span key={pill} className={styles.pill}>{pill}</span>
            ))}
          </div>
        </div>

        <div className={styles.contactCol}>
          <iframe
            title="Posizione Osteria Bellavista su Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d44074.61!2d8.9510!3d46.0037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47842de0b0e11961%3A0x34f65b5ee1f8d3ee!2sLugano%2C+Switzerland!5e0!3m2!1sen!2sch!4v1"
            className={styles.map}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className={styles.contacts}>
            <div className={styles.contactBlock}>
              <h3>Dove siamo</h3>
              <p>Via Lago 12<br />6900 Lugano, Ticino</p>
              <p>+41 91 123 45 67</p>
            </div>
            <div className={styles.contactBlock}>
              <h3>Orari</h3>
              <p>Martedì – Sabato<br />12:00–14:30 · 19:00–22:00</p>
              <p>Domenica: 12:00–15:00</p>
              <p style={{ color: 'var(--color-terracotta)' }}>Lunedì: chiuso</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default AboutSection
```

- [ ] **Step 7.2: Riscrivi `AboutSection.module.css`**

```css
.section {
  padding: var(--section-padding);
  background-color: var(--color-white);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 5rem;
  align-items: start;
}

.label {
  color: var(--color-olive);
  margin-bottom: 1rem;
}

.title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--color-dark);
  margin-bottom: 1.5rem;
}

.text {
  color: var(--color-stone);
  line-height: 1.8;
  margin-bottom: 2rem;
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.pill {
  font-family: var(--font-title);
  font-style: italic;
  font-size: 0.9rem;
  color: var(--color-olive);
  border: 1px solid var(--color-olive);
  padding: 0.3rem 0.9rem;
  border-radius: 2rem;
}

.map {
  width: 100%;
  height: 260px;
  border: none;
  border-radius: 12px;
  display: block;
  margin-bottom: 1.5rem;
}

.contacts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.contactBlock h3 {
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-olive);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.contactBlock p {
  font-size: 0.9rem;
  color: var(--color-stone);
  line-height: 1.7;
}

@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 640px) {
  .contacts {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7.3: Esegui test**

```bash
npm run test -- tests/StaticSections.test.jsx
```

Expected: "AboutSection renders address" continua a passare.

- [ ] **Step 7.4: Verifica build**

```bash
npm run build
```

- [ ] **Step 7.5: Commit**

```bash
git add frontend/src/components/AboutSection.jsx frontend/src/components/AboutSection.module.css
git commit -m "feat: redesign AboutSection with Google Maps, stat pills, and two-column layout"
```

---

## Task 8: Footer redesign

**Files:**
- Modifica: `frontend/src/components/Footer.jsx`
- Modifica: `frontend/src/components/Footer.module.css`

- [ ] **Step 8.1: Riscrivi `Footer.jsx`**

```jsx
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
```

- [ ] **Step 8.2: Riscrivi `Footer.module.css`**

```css
.footer {
  background-color: var(--color-dark);
  color: var(--color-sand);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(2.5rem, 5vw, 4rem) clamp(1rem, 5vw, 4rem);
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
}

.brand {
  font-family: var(--font-body);
  font-size: 0.75rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-sand);
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
}

.tagline {
  font-size: 0.85rem;
  color: var(--color-stone);
}

.colTitle {
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-stone);
  font-weight: 600;
  margin-bottom: 1rem;
}

.links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.links a {
  font-size: 0.9rem;
  color: rgba(232, 213, 176, 0.7);
  transition: color 0.2s;
}

.links a:hover {
  color: var(--color-sand);
}

.social {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.socialLink {
  color: rgba(232, 213, 176, 0.6);
  transition: color 0.2s;
}

.socialLink:hover {
  color: var(--color-sand);
}

.hours {
  font-size: 0.85rem;
  color: var(--color-stone);
  line-height: 1.7;
}

.bottom {
  border-top: 1px solid rgba(139, 115, 85, 0.2);
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem clamp(1rem, 5vw, 4rem);
}

.bottom p {
  font-size: 0.8rem;
  color: rgba(139, 115, 85, 0.6);
  text-align: center;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr 1fr;
  }

  .col:first-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .container {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 8.3: Esegui test**

```bash
npm run test -- tests/StaticSections.test.jsx
```

Expected: "Footer renders brand name" passa.

- [ ] **Step 8.4: Verifica build**

```bash
npm run build
```

- [ ] **Step 8.5: Commit**

```bash
git add frontend/src/components/Footer.jsx frontend/src/components/Footer.module.css
git commit -m "feat: redesign Footer with 3-column layout and social icons"
```

---

## Task 9: Test suite finale + deploy

**Files:**
- Modifica: `frontend/tests/App.test.jsx` (se necessario)
- Modifica: eventuali test rotti

- [ ] **Step 9.1: Esegui l'intera test suite**

```bash
cd /Users/marco/Documents/ClaudeProjects/osteria-bellavista/frontend
npm run test
```

Expected: tutti i test passano. Se qualcuno fallisce, leggi l'errore e aggiorna solo il test (non il codice componente) se il comportamento corretto è confermato.

- [ ] **Step 9.2: Build finale**

```bash
npm run build
```

Expected: `✓ built in X.XXs`, nessun errore, nessun warning critico.

- [ ] **Step 9.3: Verifica visiva locale**

```bash
npm run preview
```

Apri `http://localhost:4173` e verifica:
- [ ] Navbar parte trasparente, diventa scura scrollando
- [ ] Hero mostra foto con overlay e testo animato in basso-sinistra
- [ ] Scroll indicator visibile, scompare al primo scroll
- [ ] Menu mostra layout 2 colonne con card animate
- [ ] Gallery mostra mosaico con 6 foto reali
- [ ] Booking widget ha progress bar e slide tra step
- [ ] About ha mappa Google + pillole
- [ ] Footer 3 colonne con social icons
- [ ] Tutto responsive a 375px (usa DevTools → iPhone SE)

- [ ] **Step 9.4: Push e deploy**

```bash
git push origin main
```

Expected: Vercel triggera deploy automaticamente. Dopo ~1 min verifica su `https://osteria-bellavista.vercel.app`.

- [ ] **Step 9.5: Commit finale se ci sono fix minori post-verifica**

```bash
git add -A
git commit -m "fix: post-deploy visual adjustments"
git push origin main
```

---

## Checklist finale

- [ ] `npm run test` — tutti i test passano
- [ ] `npm run build` — build pulita senza errori
- [ ] Navbar sticky funzionante
- [ ] Hero con foto reale e animazioni Framer Motion
- [ ] Menu due colonne con SVG icons e stagger reveal
- [ ] Gallery mosaico con 6 foto reali
- [ ] Booking widget progress bar + slide transitions + confirm animato
- [ ] About Google Maps + pillole stat
- [ ] Footer 3 colonne + social icons
- [ ] Responsive mobile ≥ 375px verificato
- [ ] Deploy live su Vercel
