export const menuCategories = [
  {
    id: "antipasti",
    name: "Antipasti",
    items: [
      {
        name: "Bresaola della Valtellina",
        description: "Carpaccio di bresaola, rucola, scaglie di grana, olio al limone",
        price: "24",
        tags: ["senza glutine"],
      },
      {
        name: "Tartare di Manzo",
        description: "Manzo ticinese, tuorlo marinato, capperi di Torricella, crostini",
        price: "28",
        tags: [],
      },
      {
        name: "Risotto ai Funghi",
        description: "Risotto carnaroli, porcini e finferli, olio al tartufo nero",
        price: "26",
        tags: ["vegetariano"],
      },
    ],
  },
  {
    id: "primi",
    name: "Primi Piatti",
    items: [
      {
        name: "Pizzoccheri della Valtellina",
        description: "Buckwheat pasta, cavolo, patate, formaggio Bitto, salvia",
        price: "22",
        tags: ["vegetariano"],
      },
      {
        name: "Ravioli di Magro",
        description: "Ripieni di ricotta e spinaci, burro e salvia, pinoli tostati",
        price: "24",
        tags: ["vegetariano"],
      },
      {
        name: "Polenta Concia",
        description: "Polenta taragna, formaggio Fontina Valle d'Aosta, burro",
        price: "20",
        tags: ["vegetariano"],
      },
    ],
  },
  {
    id: "secondi",
    name: "Secondi Piatti",
    items: [
      {
        name: "Filletto di Manzo",
        description: "Taglio scelto 300g, riduzione al Barolo, patate arrosto",
        price: "48",
        tags: ["senza glutine"],
      },
      {
        name: "Cotoletta alla Milanese",
        description: "Lombata di vitello, pangrattato artigianale, contorno di rucola",
        price: "36",
        tags: [],
      },
      {
        name: "Branzino al Sale",
        description: "Intero cotto in crosta di sale, olio evo, limone",
        price: "42",
        tags: ["senza glutine", "pesce"],
      },
    ],
  },
  {
    id: "dolci",
    name: "Dolci",
    items: [
      {
        name: "Tiramisù della Casa",
        description: "Mascarpone, savoiardi, caffè, cacao amaro in polvere",
        price: "14",
        tags: ["classico"],
      },
      {
        name: "Panna Cotta ai Frutti di Bosco",
        description: "Vaniglia bourbon, coulis di frutti di bosco, menta fresca",
        price: "12",
        tags: ["vegetariano", "senza glutine"],
      },
      {
        name: "Torta di Nocciole",
        description: "Nocciole del Piemonte, cioccolato fondente, gelato alla nocciola",
        price: "16",
        tags: ["vegetariano"],
      },
    ],
  },
  {
    id: "vini",
    name: "Vini del Territorio",
    items: [
      {
        name: "Merlot del Ticino DOC",
        description: "Cantina Orsi, Sottoceneri - Intenso e strutturato",
        price: "48",
        tags: ["bottiglia"],
      },
      {
        name: "Chardonnay Ticino DOC",
        description: "Cantina Monti, Mendrisiotto - Fresco e minerale",
        price: "42",
        tags: ["bottiglia"],
      },
      {
        name: "Nebbiolo delle Alpi",
        description: "Riserva DOC, Valtellina - Elegante e longevo",
        price: "68",
        tags: ["bottiglia"],
      },
    ],
  },
];

export const experiences = [
  {
    id: "cena-tramonto",
    title: "Cena al Tramonto",
    description: "Un'esperienza romantica sulla nostra terrazza panoramica mentre il sole calda sul Lago di Lugano.",
    duration: "3 ore",
    price: "180 CHF a persona",
    includes: ["Aperitivo di benvenuto", "Menu degustazione 4 portate", "Abbinamento vini", "Dolce e caffè"],
    image: "/images/esperienza-tramonto.jpg",
  },
  {
    id: "degustazione-vini",
    title: "Degustazione Vini Ticinesi",
    description: "Viaggia attraverso i vigneti del Ticino con la guida del nostro sommelier.",
    duration: "2 ore",
    price: "95 CHF a persona",
    includes: ["6 vini ticinesi selezionati", "Tagliere di formaggi locali", "Spiegazione del territorio", "Attestato"],
    image: "/images/esperienza-vini.jpg",
  },
  {
    id: "evento-privato",
    title: "Evento Privato",
    description: "Celebra momenti speciali nel nostro salone privato con vista lago.",
    duration: "Personalizzabile",
    price: "Su richiesta",
    includes: ["Salone esclusivo", "Menu personalizzato", "Servizio dedicato", "Pianoforte su richiesta"],
    image: "/images/esperienza-privato.jpg",
  },
];

export const galleryImages = [
  { id: 1, src: "/images/gallery-1.jpg", alt: "Terrazza panoramica sul lago", category: "ambiente" },
  { id: 2, src: "/images/gallery-2.jpg", alt: "Risotto ai funghi porcini", category: "piatti" },
  { id: 3, src: "/images/gallery-3.jpg", alt: "Sala interna elegante", category: "ambiente" },
  { id: 4, src: "/images/gallery-4.jpg", alt: "Tramonto sul Lago di Lugano", category: "lago" },
  { id: 5, src: "/images/gallery-5.jpg", alt: "Tagliere di formaggi locali", category: "piatti" },
  { id: 6, src: "/images/gallery-6.jpg", alt: "Giardino esterno", category: "ambiente" },
  { id: 7, src: "/images/gallery-7.jpg", alt: "Branzino al sale", category: "piatti" },
  { id: 8, src: "/images/gallery-8.jpg", alt: "Dettaglio tavola apparecchiata", category: "ambiente" },
];

export const restaurantInfo = {
  name: "Osteria Bellavista",
  founded: 1987,
  address: "Via Pessina 12, 6900 Lugano",
  phone: "+41 91 123 45 67",
  email: "info@osteriabellavista.ch",
  hours: {
    lunch: "12:00 - 14:30",
    dinner: "19:00 - 22:30",
    closed: "Domenica sera e Lunedì",
  },
  social: {
    instagram: "@osteriabellavista",
    facebook: "OsteriaBellavistaLugano",
  },
};
