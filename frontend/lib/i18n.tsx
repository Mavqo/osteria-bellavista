"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type Locale = "it" | "de" | "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string | string[] | Record<string, string>;
}

const translations: Record<Locale, Record<string, any>> = {
  it: {
    nav: {
      menu: "Menu",
      experiences: "Esperienze",
      gallery: "Galleria",
      book: "Prenota",
      bookTable: "Prenota Tavolo",
    },
    hero: {
      badge: "Dal 1987 · Lugano, Ticino",
      title1: "Una cucina che",
      title2: "racconta",
      title3: "il territorio",
      subtitle: "Tradizione ticinese, ingredienti locali, vista lago. Un'esperienza gastronomica autentica dal 1987.",
      cta1: "Prenota un Tavolo",
      cta2: "Scopri il Menu",
      scroll: "Scorri",
    },
    menu: {
      badge: "La Nostra Cucina",
      title: "Menu",
      subtitle: "Piatti che raccontano la tradizione ticinese, preparati con ingredienti locali e stagionali selezionati.",
      disclaimer: "I prezzi sono indicativi e possono variare in base alla disponibilità stagionale degli ingredienti.",
      categories: {
        antipasti: "Antipasti",
        primi: "Primi Piatti",
        secondi: "Secondi Piatti",
        dolci: "Dolci",
        vini: "Vini del Territorio",
      },
      items: {
        antipasti: [
          { name: "Bresaola della Valtellina", description: "Carpaccio di bresaola, rucola, scaglie di grana, olio al limone" },
          { name: "Tartare di Manzo", description: "Manzo ticinese, tuorlo marinato, capperi di Torricella, crostini" },
          { name: "Risotto ai Funghi", description: "Risotto carnaroli, porcini e finferli, olio al tartufo nero" },
        ],
        primi: [
          { name: "Pizzoccheri della Valtellina", description: "Pasta di grano saraceno, cavolo, patate, formaggio Bitto, salvia" },
          { name: "Ravioli di Magro", description: "Ripieni di ricotta e spinaci, burro e salvia, pinoli tostati" },
          { name: "Polenta Concia", description: "Polenta taragna, formaggio Fontina Valle d'Aosta, burro" },
        ],
        secondi: [
          { name: "Filetto di Manzo", description: "Taglio scelto 300g, riduzione al Barolo, patate arrosto" },
          { name: "Cotoletta alla Milanese", description: "Lombata di vitello, pangrattato artigianale, contorno di rucola" },
          { name: "Branzino al Sale", description: "Intero cotto in crosta di sale, olio evo, limone" },
        ],
        dolci: [
          { name: "Tiramisù della Casa", description: "Mascarpone, savoiardi, caffè, cacao amaro in polvere" },
          { name: "Panna Cotta ai Frutti di Bosco", description: "Vaniglia bourbon, coulis di frutti di bosco, menta fresca" },
          { name: "Torta di Nocciole", description: "Nocciole del Piemonte, cioccolato fondente, gelato alla nocciola" },
        ],
        vini: [
          { name: "Merlot del Ticino DOC", description: "Cantina Orsi, Sottoceneri - Intenso e strutturato" },
          { name: "Chardonnay Ticino DOC", description: "Cantina Monti, Mendrisiotto - Fresco e minerale" },
          { name: "Nebbiolo delle Alpi", description: "Riserva DOC, Valtellina - Elegante e longevo" },
        ],
      },
    },
    booking: {
      badge: "Prenotazioni",
      title: "Prenota il tuo Tavolo",
      subtitle: "Disponibilità in tempo reale. Conferma immediata per una serata indimenticabile con vista sul Lago di Lugano.",
      step1: "Dettagli",
      step2: "Conferma",
      date: "Data",
      time: "Ora",
      guests: "Ospiti",
      guestsNote: "9+ contattaci",
      tablePreference: "Preferenza tavolo",
      tablePreferences: {
        terrazza: { name: "Terrazza", description: "Vista lago" },
        interno: { name: "Sala Interna", description: "Atmosfera intima" },
        giardino: { name: "Giardino", description: "All'aperto" },
        nessuna: { name: "Nessuna preferenza", description: "Al meglio disponibile" },
      },
      guestsLabel: "persone",
      summary: "Riepilogo",
      form: {
        name: "Nome e cognome",
        email: "Email",
        phone: "Telefono",
        notes: "Note speciali",
        info: "Inserisci i tuoi dati",
      },
      actions: {
        continue: "Continua",
        back: "Indietro",
        confirm: "Conferma",
        new: "Nuova prenotazione",
      },
      success: {
        title: "Prenotazione confermata!",
        message: "Ti aspettiamo all'Osteria Bellavista!",
      },
      hours: "Orari",
    },
    experiences: {
      badge: "Momenti Speciali",
      title: "Esperienze",
      subtitle: "Trasforma la tua cena in un'esperienza indimenticabile con le nostre proposte esclusive.",
      duration: "Durata",
      price: "Richiedi Info",
      includes: "Include",
      items: {
        "cena-tramonto": {
          title: "Cena al Tramonto",
          description: "Un'esperienza romantica sulla nostra terrazza panoramica mentre il sole calda sul Lago di Lugano.",
          includes: ["Aperitivo di benvenuto", "Menu degustazione 4 portate", "Abbinamento vini", "Dolce e caffè"],
        },
        "degustazione-vini": {
          title: "Degustazione Vini Ticinesi",
          description: "Viaggia attraverso i vigneti del Ticino con la guida del nostro sommelier.",
          includes: ["6 vini ticinesi selezionati", "Tagliere di formaggi locali", "Spiegazione del territorio", "Attestato"],
        },
        "evento-privato": {
          title: "Evento Privato",
          description: "Celebra momenti speciali nel nostro salone privato con vista lago.",
          includes: ["Salone esclusivo", "Menu personalizzato", "Servizio dedicato", "Pianoforte su richiesta"],
        },
      },
    },
    gallery: {
      badge: "Atmosfera",
      title: "Galleria",
      subtitle: "Scopri l'eleganza dei nostri spazi e la bellezza dei nostri piatti.",
      filters: {
        all: "Tutti",
        dishes: "Piatti",
        ambience: "Ambiente",
        lake: "Lago",
      },
    },
    footer: {
      tagline: "Tradizione ticinese, ingredienti locali, vista lago. Un'esperienza gastronomica autentica nel cuore del Ticino.",
      contacts: "Contatti",
      hours: "Orari",
      lunch: "Pranzo",
      dinner: "Cena",
      closed: "Chiuso",
      quickLinks: "Link Rapidi",
      backToTop: "Torna su",
      followUs: "Seguici",
    },
    cookie: {
      title: "Utilizziamo i cookie",
      description: "Questo sito utilizza cookie per migliorare la tua esperienza. Cliccando su \"Accetta\", consenti all'uso di tutti i cookie.",
      accept: "Accetta",
      decline: "Rifiuta",
    },
  },
  de: {
    nav: {
      menu: "Menü",
      experiences: "Erlebnisse",
      gallery: "Galerie",
      book: "Reservieren",
      bookTable: "Tisch reservieren",
    },
    hero: {
      badge: "Seit 1987 · Lugano, Tessin",
      title1: "Eine Küche, die",
      title2: "erzählt",
      title3: "von der Region",
      subtitle: "Tessiner Tradition, lokale Zutaten, Seeblick. Ein authentisches kulinarisches Erlebnis seit 1987.",
      cta1: "Tisch reservieren",
      cta2: "Menü entdecken",
      scroll: "Scrollen",
    },
    menu: {
      badge: "Unsere Küche",
      title: "Menü",
      subtitle: "Gerichte, die von der Tessiner Tradition erzählen, zubereitet mit sorgfältig ausgewählten lokalen und saisonalen Zutaten.",
      disclaimer: "Die Preise sind Richtwerte und können je nach saisonaler Verfügbarkeit der Zutaten variieren.",
      categories: {
        antipasti: "Vorspeisen",
        primi: "Erste Gänge",
        secondi: "Hauptgerichte",
        dolci: "Desserts",
        vini: "Weine der Region",
      },
      items: {
        antipasti: [
          { name: "Bresaola aus Veltlin", description: "Bresaola-Carpaccio, Rucola, Grana-Späne, Zitronenöl" },
          { name: "Rindertatar", description: "Tessiner Rind, mariniertes Dotter, Torricella-Kapern, Crostini" },
          { name: "Pilzrisotto", description: "Carnaroli-Reis, Steinpilze und Pfifferlinge, Trüffelöl" },
        ],
        primi: [
          { name: "Pizzoccheri aus Veltlin", description: "Buchweizennudeln, Kohl, Kartoffeln, Bitto-Käse, Salbei" },
          { name: "Ravioli di Magro", description: "Gefüllt mit Ricotta und Spinat, Butter und Salbei, geröstete Pinienkerne" },
          { name: "Polenta Concia", description: "Taragna-Polenta, Fontina-Käse, Butter" },
        ],
        secondi: [
          { name: "Rinderfilet", description: "Ausgewählter Schnitt 300g, Barolo-Reduktion, Röstkartoffeln" },
          { name: "Mailänder Schnitzel", description: "Kalbslende, handgemachte Paniermehl, Rucola-Beilage" },
          { name: "Wolfsbarsch in Salzkruste", description: "Ganz in Salzkruste gebacken, Olivenöl, Zitrone" },
        ],
        dolci: [
          { name: "Haus-Tiramisù", description: "Mascarpone, Löffelbiskuits, Kaffee, Kakaopulver" },
          { name: "Panna Cotta mit Beeren", description: "Bourbon-Vanille, Beeren-Coulis, frische Minze" },
          { name: "Haselnusskuchen", description: "Piemonteser Haselnüsse, Zartbitterschokolade, Haselnusseis" },
        ],
        vini: [
          { name: "Merlot del Ticino DOC", description: "Kellerei Orsi, Sottoceneri - Intensiv und strukturiert" },
          { name: "Chardonnay Ticino DOC", description: "Kellerei Monti, Mendrisiotto - Frisch und mineralisch" },
          { name: "Nebbiolo delle Alpi", description: "Riserva DOC, Veltlin - Elegant und langlebig" },
        ],
      },
    },
    booking: {
      badge: "Reservierungen",
      title: "Reservieren Sie Ihren Tisch",
      subtitle: "Verfügbarkeit in Echtzeit. Sofortige Bestätigung für einen unvergesslichen Abend mit Blick auf den Luganersee.",
      step1: "Details",
      step2: "Bestätigung",
      date: "Datum",
      time: "Uhrzeit",
      guests: "Gäste",
      guestsNote: "9+ kontaktieren Sie uns",
      tablePreference: "Tischpräferenz",
      tablePreferences: {
        terrazza: { name: "Terrasse", description: "Seeblick" },
        interno: { name: "Innensaal", description: "Intime Atmosphäre" },
        giardino: { name: "Garten", description: "Im Freien" },
        nessuna: { name: "Keine Präferenz", description: "Bestmöglich verfügbar" },
      },
      guestsLabel: "Personen",
      summary: "Zusammenfassung",
      form: {
        name: "Name",
        email: "E-Mail",
        phone: "Telefon",
        notes: "Besondere Wünsche",
        info: "Geben Sie Ihre Daten ein",
      },
      actions: {
        continue: "Weiter",
        back: "Zurück",
        confirm: "Bestätigen",
        new: "Neue Reservierung",
      },
      success: {
        title: "Reservierung bestätigt!",
        message: "Wir freuen uns auf Sie!",
      },
      hours: "Öffnungszeiten",
    },
    experiences: {
      badge: "Besondere Momente",
      title: "Erlebnisse",
      subtitle: "Verwandeln Sie Ihr Abendessen in ein unvergessliches Erlebnis mit unseren exklusiven Angeboten.",
      duration: "Dauer",
      price: "Info anfordern",
      includes: "Enthält",
      items: {
        "cena-tramonto": {
          title: "Sonnenuntergang-Dinner",
          description: "Ein romantisches Erlebnis auf unserer Panoramaterrasse, während die Sonne über dem Luganersee untergeht.",
          includes: ["Willkommensaperitif", "4-Gänge-Verkostungsmenü", "Weinbegleitung", "Dessert und Kaffee"],
        },
        "degustazione-vini": {
          title: "Tessiner Weinverkostung",
          description: "Reisen Sie durch die Weinberge des Tessins mit der Führung unseres Sommeliers.",
          includes: ["6 ausgewählte Tessiner Weine", "Käseplatte mit lokalen Sorten", "Erklärung der Region", "Zertifikat"],
        },
        "evento-privato": {
          title: "Private Veranstaltung",
          description: "Feiern Sie besondere Momente in unserem privaten Salon mit Seeblick.",
          includes: ["Exklusiver Salon", "Personalisiertes Menü", "Dedizierter Service", "Klavier auf Anfrage"],
        },
      },
    },
    gallery: {
      badge: "Ambiente",
      title: "Galerie",
      subtitle: "Entdecken Sie die Eleganz unserer Räume und die Schönheit unserer Gerichte.",
      filters: {
        all: "Alle",
        dishes: "Gerichte",
        ambience: "Ambiente",
        lake: "See",
      },
    },
    footer: {
      tagline: "Tessiner Tradition, lokale Zutaten, Seeblick. Ein authentisches kulinarisches Erlebnis im Herzen des Tessins.",
      contacts: "Kontakte",
      hours: "Öffnungszeiten",
      lunch: "Mittagessen",
      dinner: "Abendessen",
      closed: "Geschlossen",
      quickLinks: "Schnelllinks",
      backToTop: "Nach oben",
      followUs: "Folgen Sie uns",
    },
    cookie: {
      title: "Wir verwenden Cookies",
      description: "Diese Website verwendet Cookies, um Ihre Erfahrung zu verbessern. Durch Klicken auf \"Akzeptieren\" stimmen Sie der Verwendung aller Cookies zu.",
      accept: "Akzeptieren",
      decline: "Ablehnen",
    },
  },
  en: {
    nav: {
      menu: "Menu",
      experiences: "Experiences",
      gallery: "Gallery",
      book: "Book",
      bookTable: "Book a Table",
    },
    hero: {
      badge: "Since 1987 · Lugano, Ticino",
      title1: "A cuisine that",
      title2: "tells the story",
      title3: "of the territory",
      subtitle: "Ticino tradition, local ingredients, lake view. An authentic culinary experience since 1987.",
      cta1: "Book a Table",
      cta2: "Discover the Menu",
      scroll: "Scroll",
    },
    menu: {
      badge: "Our Cuisine",
      title: "Menu",
      subtitle: "Dishes that tell the story of Ticino tradition, prepared with carefully selected local and seasonal ingredients.",
      disclaimer: "Prices are indicative and may vary based on seasonal ingredient availability.",
      categories: {
        antipasti: "Starters",
        primi: "First Courses",
        secondi: "Main Courses",
        dolci: "Desserts",
        vini: "Regional Wines",
      },
      items: {
        antipasti: [
          { name: "Valtellina Bresaola", description: "Bresaola carpaccio, arugula, Grana shavings, lemon oil" },
          { name: "Beef Tartare", description: "Ticino beef, marinated yolk, Torricella capers, crostini" },
          { name: "Mushroom Risotto", description: "Carnaroli rice, porcini and chanterelles, black truffle oil" },
        ],
        primi: [
          { name: "Valtellina Pizzoccheri", description: "Buckwheat pasta, cabbage, potatoes, Bitto cheese, sage" },
          { name: "Ravioli di Magro", description: "Filled with ricotta and spinach, butter and sage, toasted pine nuts" },
          { name: "Polenta Concia", description: "Taragna polenta, Fontina cheese, butter" },
        ],
        secondi: [
          { name: "Beef Fillet", description: "Premium cut 300g, Barolo reduction, roast potatoes" },
          { name: "Milanese Cutlet", description: "Veal loin, artisan breadcrumbs, arugula side" },
          { name: "Sea Bass in Salt", description: "Whole baked in salt crust, olive oil, lemon" },
        ],
        dolci: [
          { name: "House Tiramisu", description: "Mascarpone, ladyfingers, coffee, cocoa powder" },
          { name: "Panna Cotta with Berries", description: "Bourbon vanilla, berry coulis, fresh mint" },
          { name: "Hazelnut Cake", description: "Piedmont hazelnuts, dark chocolate, hazelnut gelato" },
        ],
        vini: [
          { name: "Merlot del Ticino DOC", description: "Cantina Orsi, Sottoceneri - Intense and structured" },
          { name: "Chardonnay Ticino DOC", description: "Cantina Monti, Mendrisiotto - Fresh and mineral" },
          { name: "Nebbiolo delle Alpi", description: "Riserva DOC, Valtellina - Elegant and long-lived" },
        ],
      },
    },
    booking: {
      badge: "Reservations",
      title: "Book Your Table",
      subtitle: "Real-time availability. Instant confirmation for an unforgettable evening with a view of Lake Lugano.",
      step1: "Details",
      step2: "Confirmation",
      date: "Date",
      time: "Time",
      guests: "Guests",
      guestsNote: "9+ contact us",
      tablePreference: "Table preference",
      tablePreferences: {
        terrazza: { name: "Terrace", description: "Lake view" },
        interno: { name: "Indoor", description: "Intimate atmosphere" },
        giardino: { name: "Garden", description: "Outdoor" },
        nessuna: { name: "No preference", description: "Best available" },
      },
      guestsLabel: "guests",
      summary: "Summary",
      form: {
        name: "Full name",
        email: "Email",
        phone: "Phone",
        notes: "Special requests",
        info: "Enter your details",
      },
      actions: {
        continue: "Continue",
        back: "Back",
        confirm: "Confirm",
        new: "New booking",
      },
      success: {
        title: "Booking confirmed!",
        message: "We look forward to seeing you!",
      },
      hours: "Hours",
    },
    experiences: {
      badge: "Special Moments",
      title: "Experiences",
      subtitle: "Transform your dinner into an unforgettable experience with our exclusive offerings.",
      duration: "Duration",
      price: "Request Info",
      includes: "Includes",
      items: {
        "cena-tramonto": {
          title: "Sunset Dinner",
          description: "A romantic experience on our panoramic terrace as the sun sets over Lake Lugano.",
          includes: ["Welcome aperitif", "4-course tasting menu", "Wine pairing", "Dessert and coffee"],
        },
        "degustazione-vini": {
          title: "Ticino Wine Tasting",
          description: "Journey through the vineyards of Ticino with guidance from our sommelier.",
          includes: ["6 selected Ticino wines", "Local cheese board", "Territory explanation", "Certificate"],
        },
        "evento-privato": {
          title: "Private Event",
          description: "Celebrate special moments in our private lounge with lake view.",
          includes: ["Exclusive lounge", "Customized menu", "Dedicated service", "Piano on request"],
        },
      },
    },
    gallery: {
      badge: "Atmosphere",
      title: "Gallery",
      subtitle: "Discover the elegance of our spaces and the beauty of our dishes.",
      filters: {
        all: "All",
        dishes: "Dishes",
        ambience: "Ambience",
        lake: "Lake",
      },
    },
    footer: {
      tagline: "Ticino tradition, local ingredients, lake view. An authentic culinary experience in the heart of Ticino.",
      contacts: "Contacts",
      hours: "Hours",
      lunch: "Lunch",
      dinner: "Dinner",
      closed: "Closed",
      quickLinks: "Quick Links",
      backToTop: "Back to top",
      followUs: "Follow us",
    },
    cookie: {
      title: "We use cookies",
      description: "This website uses cookies to improve your experience. By clicking \"Accept\", you consent to the use of all cookies.",
      accept: "Accept",
      decline: "Decline",
    },
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("it");

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.documentElement.lang = newLocale;
    localStorage.setItem("locale", newLocale);
  }, []);

  const t = useCallback(
    (key: string): string | string[] | Record<string, string> => {
      const keys = key.split(".");
      let value: any = translations[locale];
      
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          return key;
        }
      }
      
      return value;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
