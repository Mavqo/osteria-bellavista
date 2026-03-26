# Osteria Bellavista — UI/UX Redesign Spec
**Date:** 2026-03-22
**Status:** Approved by user
**Scope:** Frontend only (`frontend/src/`)

---

## 1. Obiettivo

Trasformare il sito demo da scheletro funzionale a prodotto visivamente professionale, adatto a un portfolio da sviluppatore full-stack. Il sito deve sembrare un vero sito di ristorante premium, dimostrare competenza in UI/UX, animazioni, design system e interazioni moderne.

**Target audience (del portfolio):** Recruiter, clienti freelance, stakeholder tecnici che valutano capacità frontend.

---

## 2. Design Direction

**Mood:** Rustico-elegante + Ticinese autentico
**Riferimenti:** Trattoria di lusso italiana, osterie premium svizzere, atmosfera lago Lugano

### Design System

**Palette (estesa dall'attuale):**
```css
--color-dark:       #111111
--color-olive:      #3d6b4f
--color-terracotta: #c4614a
--color-sand:       #e8d5b0
--color-cream:      #f7f3ee
--color-white:      #ffffff
--color-stone:      #8b7355   /* nuovo — testi secondari caldi */
```

**Tipografia:**
- Titoli: `Playfair Display`, serif — già presente
- Body: `Inter`, sans-serif — già presente
- Scale: H1 `clamp(3rem, 6vw, 5.5rem)`, H2 `clamp(2rem, 4vw, 3.5rem)`, body 17px / line-height 1.75

**Spacing:** sistema 8pt — valori: 8, 16, 24, 32, 48, 64, 96px

---

## 3. Dipendenze da aggiungere

- `framer-motion` — animazioni scroll-reveal, transizioni booking widget, hero mount animation

---

## 4. Sezioni — Specifiche dettagliate

### 4.1 Navbar (sticky)

**Comportamento:**
- Parte trasparente sull'hero (testo chiaro su sfondo scuro della foto)
- Al scroll > 80px: background `rgba(17,17,17, 0.92)` + `backdrop-filter: blur(12px)`
- Transizione CSS `0.3s ease` — NO Framer Motion (CSS sufficiente)
- Aggiunto link "Gallery" (attualmente mancante)

**Struttura JSX:**
```
<nav> (posizione fixed, z-index alto)
  <span brand />
  <ul> Menu | Gallery | Prenota | Contatti </ul>
</nav>
```

**Implementazione:** estratta da `Hero.jsx` in componente separato `Navbar.jsx` con `useEffect` per listener scroll.

---

### 4.2 Hero

**Immagine:** foto Unsplash di interno ristorante rustico italiano con luce calda (scaricata localmente in `/assets/hero.jpg`)

**Layout:**
- `<img>` con `object-fit: cover`, `object-position: center`, altezza `100vh`
- Overlay gradient: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)`
- Testo posizionato in basso-sinistra (`position: absolute`, `bottom: 15%`, `left: clamp(1rem, 5vw, 4rem)`)

**Contenuto:**
```
[badge] DAL 1987 · LUGANO, TICINO
[h1]   Una cucina che racconta il territorio.
[p]    Tradizione ticinese, ingredienti locali, vista lago.
[cta]  Prenota un tavolo →
```

**Animazione (Framer Motion):**
- `motion.div` wrapper con `initial={{ opacity: 0, y: 30 }}` → `animate={{ opacity: 1, y: 0 }}`
- `transition={{ duration: 0.6, ease: "easeOut" }}`
- Stagger tra badge, titolo, tagline, CTA: delays 0, 0.15, 0.25, 0.4s

**Scroll indicator:** cerchio con freccia `↓` centrato in basso, animazione CSS `bounce` infinita. Scompare al primo scroll via `useState(true)` + `useEffect` con listener `window.addEventListener('scroll', handler, { once: true })` → `setVisible(false)`.

---

### 4.3 Menu Section

**Layout:** due colonne su desktop (50/50), una colonna su mobile

- **Colonna sinistra:** intro testuale — label "Il Menu", H2, paragrafo filosofia cucina (3 righe), icona foglia SVG decorativa
- **Colonna destra:** 4 card categoria in grid 2×2

**Ogni card:**
```
[icona SVG minimal]  (foglia/piatto/fuoco/fiore — inline SVG, no emoji)
[h3]  Categoria
[fascia prezzo]  €€ · 8–14€
[lista piatti]  ogni voce con descrizione breve su riga separata
```

**Aggiornamento contenuto:**
- Antipasti: Salumi ticinesi con mostarda · Bruschette al pomodoro e basilico · Carpaccio di manzo con rucola
- Primi: Risotto al vino bianco con porcini · Tagliatelle al ragù di cinghiale · Zuppa di farro e verdure
- Secondi: Brasato al Merlot ticinese · Filetto di lavarello del lago · Costolette d'agnello alle erbe
- Dolci: Tiramisù della casa · Panna cotta al miele di acacia · Torta di noci valtellinesi

**Hover card:** `translateY(-4px)` + `box-shadow` più profonda, `transition 0.2s`

**Animazione (Framer Motion):**
- `whileInView` con `initial={{ opacity: 0, y: 40 }}` → `animate={{ opacity: 1, y: 0 }}`
- Stagger 4 card: delay 0, 0.1, 0.2, 0.3s
- `viewport={{ once: true, margin: "-50px" }}`

---

### 4.4 Gallery Section

**Immagini (6 foto Unsplash, scaricate localmente):**
1. `gallery-risotto.jpg` — piatto di risotto con porcini (hero dish)
2. `gallery-lago.jpg` — vista lago Lugano con colline
3. `gallery-terrazza.jpg` — tavoli in terrazza con candele serali
4. `gallery-dolce.jpg` — dessert al piatto con decorazione
5. `gallery-ingredienti.jpg` — ingredienti freschi (pomodori, erbe aromatiche)
6. `gallery-interno.jpg` — interno osteria rustico con legno caldo

**Grid layout CSS (mosaico asimmetrico):**
```
[  1-risotto wide  ] [ 2-lago tall ]
[ 3-terr ] [ 4-dolce ] [ 5-ingr ]
[      6-interno wide panoramica      ]
```
Implementato con `grid-template-areas` o `grid-column/row span`.

**Hover overlay:**
- Overlay `rgba(17,17,17, 0.6)` che sale dal basso (`transform: translateY(100%)` → `translateY(0)`) su hover
- Label foto in bianco `position: absolute bottom`

**Animazione (Framer Motion):**
- Ogni foto: `whileInView` con `initial={{ opacity: 0, scale: 0.96 }}` → `animate={{ opacity: 1, scale: 1 }}`
- Stagger leggero, `once: true`

---

### 4.5 Booking Section

**Wrapper section:**
- Background `--color-dark` full-width
- Pattern texture sottile: SVG noise CSS (background-image data URI) con opacità 3%
- Titolo "Prenota il tuo tavolo" + sottotitolo in `--color-sand`

**Widget card:**
- Background `--color-cream`, `max-width: 540px`, centrata
- `border-radius: 16px`, `box-shadow: 0 24px 64px rgba(0,0,0,0.3)`
- Padding interno: 40px desktop, 24px mobile

**Progress bar (sostituisce dot indicator):**
```
[==============          ] 50%
  Data   Orario  Dati  Conferma
```
- Barra orizzontale olive, `transition: width 0.4s ease`
- Labels sotto con step attivo in olive, completati in stone, futuri in sand/grigio

**Inputs:**
- `border-radius: 8px`, padding `14px 16px`
- `border: 1.5px solid` con `--color-sand` default → `--color-olive` focus
- Focus ring: `outline: 2px solid --color-olive`, `outline-offset: 2px`
- Label flottante: `position: absolute`, scala e risale su focus/filled (CSS puro via `:not(:placeholder-shown)` + `:focus`). Ogni input **deve** avere `placeholder=" "` (spazio singolo) per attivare correttamente il selettore.

**Pulsanti:**
- Avanti: `background --color-olive`, bianco, pill (`border-radius: 2rem`)
- Indietro: ghost — `border: 1.5px solid --color-stone`, `color: --color-stone`

**Transizioni step (Framer Motion):**
- `AnimatePresence mode="wait"`
- Step uscente: `exit={{ opacity: 0, x: -40 }}`
- Step entrante: `initial={{ opacity: 0, x: 40 }}` → `animate={{ opacity: 1, x: 0 }}`
- `transition: { duration: 0.25, ease: "easeInOut" }`

**Step "Dati" — StepGuests.jsx (step 3):**
Campi del form:

- Nome e cognome (required, `placeholder=" "`, label flottante)
- Telefono (optional, `placeholder=" "`, label flottante, `type="tel"`)
- Numero di ospiti (stepper +/− da 1 a 10, non input testuale)
- Pulsanti: Indietro (ghost) + Avanti/Conferma (olive)

`StepForm.module.css` è il **CSS condiviso per tutti e 3 gli step form** (StepDate, StepTime, StepGuests). Contiene gli stili degli input, label flottanti, pulsanti Avanti/Indietro, messaggi di errore. Ogni step ne fa `import`. Non va creato un `StepForm.jsx`.

**Step conferma:**
- Checkmark SVG con animazione `pathLength` (Framer Motion draw) — cerchio che si chiude poi check
- Card "ticket" riepilogo prenotazione: nome, data, orario, coperti
- CTA "Aggiungi al calendario" — puro placeholder decorativo (`href="#"`, `onClick e.preventDefault()`). Non implementa logica calendario reale.

---

### 4.6 About Section

**Layout:** due colonne su desktop

- **Colonna sinistra (60%):**
  - Label + H2 + testo storia (invariato)
  - 3 pillole statistiche: `35+ anni` · `km zero` · `vista lago`
  - Stile pillole: badge inline con border, font serif italic

- **Colonna destra (40%):**
  - Embed Google Maps iframe (Lugano, Ticino) — `border-radius: 12px`, `height: 260px`
  - Info contatti sotto la mappa: indirizzo, telefono, orari
  - **Nota limitazione:** l'iframe Google Maps carica cookie di terze parti senza banner cookie. Accettabile per un sito demo/portfolio; non adatto a produzione reale senza CMP.

---

### 4.7 Footer

**Struttura (3 colonne su desktop, stack su mobile):**
```
[Brand + tagline]   [Link rapidi]   [Social + orari]
[copyright centrato]
```

- Background `--color-dark`, testo `--color-sand`
- Icone social SVG: Instagram, Facebook (placeholder link `#`)
- Separatore sottile `--color-stone` opacity 20% sopra copyright

---

## 5. Responsività

Breakpoints:
- Mobile: < 640px — tutto stack verticale, padding ridotto
- Tablet: 640–1024px — grid a 2 col dove applicabile
- Desktop: > 1024px — layout completo

La navbar su mobile: hamburger menu (icona ☰) con **dropdown** semplice (NO drawer). Il menu si espande verso il basso con `max-height: 0` → `max-height: 200px` + `overflow: hidden`, gestito via `useState(false)`. Nessun overlay, nessun scroll-lock — implementazione minimal sufficiente per portfolio demo.

**Gallery su tablet (640–1024px):** il mosaico asimmetrico collassa a **grid 2 colonne uniformi** (`grid-template-columns: 1fr 1fr`, senza span speciali). Ogni foto ha altezza fissa `240px` con `object-fit: cover`.

---

## 6. Struttura file risultante

```
frontend/src/
├── index.css                    (aggiornato: nuovi token, font scale)
├── App.jsx                      (aggiornato: Navbar estratta)
├── assets/
│   ├── hero.jpg                 (nuovo)
│   ├── gallery-risotto.jpg      (nuovo)
│   ├── gallery-lago.jpg         (nuovo)
│   ├── gallery-terrazza.jpg     (nuovo)
│   ├── gallery-dolce.jpg        (nuovo)
│   ├── gallery-ingredienti.jpg  (nuovo)
│   └── gallery-interno.jpg      (nuovo)
└── components/
    ├── Navbar.jsx               (nuovo — estratto da Hero)
    ├── Navbar.module.css        (nuovo)
    ├── Hero.jsx                 (aggiornato)
    ├── Hero.module.css          (aggiornato)
    ├── MenuSection.jsx          (aggiornato)
    ├── MenuSection.module.css   (aggiornato)
    ├── GallerySection.jsx       (aggiornato)
    ├── GallerySection.module.css(aggiornato)
    ├── BookingSection.jsx       (aggiornato)
    ├── BookingSection.module.css(aggiornato)
    ├── BookingWidget.jsx        (aggiornato)
    ├── BookingWidget.module.css (aggiornato)
    ├── StepDate.jsx             (aggiornato styling)
    ├── StepTime.jsx             (aggiornato styling)
    ├── StepGuests.jsx           (aggiornato styling)
    ├── StepConfirm.jsx          (aggiornato — checkmark animato)
    ├── StepForm.module.css      (aggiornato)
    ├── AboutSection.jsx         (aggiornato)
    ├── AboutSection.module.css  (aggiornato)
    ├── Footer.jsx               (aggiornato)
    └── Footer.module.css        (aggiornato)
```

---

## 7. Framer Motion — uso chirurgico

| Componente | Animazione | Trigger |
| --- | --- | --- |
| Hero | fadeIn + slideUp testo (stagger) | mount |
| MenuSection | stagger scroll-reveal card | whileInView |
| GallerySection | scale + fade foto | whileInView |
| BookingWidget | slide orizzontale tra step | AnimatePresence |
| StepConfirm | checkmark SVG pathLength draw | mount |

Tutto il resto: CSS transition puro.

---

## 8. Immagini — strategia download

Scaricate localmente in `frontend/src/assets/` via `curl`. Nessun URL esterno nel bundle finale.

**Termini di ricerca Unsplash per ogni asset:**

| File | Ricerca consigliata | Dimensione |
| --- | --- | --- |
| `hero.jpg` | "italian restaurant interior warm light rustic" | `w=1920&q=85` |
| `gallery-risotto.jpg` | "risotto mushroom truffle italian plating" | `w=900&q=80` |
| `gallery-lago.jpg` | "lugano lake switzerland hills" oppure "como lake view" | `w=900&q=80` (verticale preferita) |
| `gallery-terrazza.jpg` | "restaurant terrace candles evening table" | `w=900&q=80` |
| `gallery-dolce.jpg` | "italian dessert tiramisu plate elegant" | `w=900&q=80` |
| `gallery-ingredienti.jpg` | "fresh herbs tomatoes vegetables italian kitchen" | `w=900&q=80` |
| `gallery-interno.jpg` | "rustic italian osteria interior wood warm" | `w=1200&q=80` (panoramica) |

`gallery-lago.jpg` deve essere in formato **verticale** (portrait) per occupare la colonna `tall` del mosaico.

---

## 9. Criteri di completamento

- [ ] Navbar sticky con scroll effect funzionante
- [ ] Hero con foto reale e animazione mount
- [ ] Menu con contenuto arricchito, icone SVG, stagger reveal
- [ ] Gallery con 6 foto reali e mosaico CSS
- [ ] Booking widget con progress bar, slide transition, confirm animato
- [ ] About con Maps embed e pillole stat
- [ ] Footer strutturato a 3 colonne
- [ ] Responsivo mobile ≥ 375px
- [ ] `npm run build` senza errori
- [ ] Deploy automatico su Vercel al push main
