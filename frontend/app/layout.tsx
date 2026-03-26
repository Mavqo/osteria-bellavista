import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { CustomCursor } from "@/components/cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { CookieBanner } from "@/components/cookie-banner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Osteria Bellavista | Cucina Ticinese dal 1987",
  description: "Tradizione ticinese, ingredienti locali, vista lago. L'Osteria Bellavista a Lugano dal 1987 offre un'esperienza gastronomica autentica con vista sul Lago di Lugano.",
  keywords: ["ristorante lugano", "osteria ticino", "cucina ticinese", "vista lago", "prenotazione ristorante"],
  authors: [{ name: "Osteria Bellavista" }],
  creator: "Osteria Bellavista",
  publisher: "Osteria Bellavista",
  robots: "index, follow",
  alternates: {
    canonical: "https://osteriabellavista.ch",
    languages: {
      "it-IT": "https://osteriabellavista.ch",
      "de-DE": "https://osteriabellavista.ch/de",
      "en-US": "https://osteriabellavista.ch/en",
    },
  },
  openGraph: {
    title: "Osteria Bellavista | Cucina Ticinese dal 1987",
    description: "Tradizione ticinese, ingredienti locali, vista lago.",
    type: "website",
    locale: "it_IT",
    url: "https://osteriabellavista.ch",
    siteName: "Osteria Bellavista",
    images: [
      {
        url: "https://osteriabellavista.ch/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Osteria Bellavista - Vista Lago",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Osteria Bellavista | Cucina Ticinese dal 1987",
    description: "Tradizione ticinese, ingredienti locali, vista lago.",
    images: ["https://osteriabellavista.ch/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "restaurant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange={false}
          >
            <CustomCursor />
            <ScrollProgress />
            {children}
            <CookieBanner />
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
