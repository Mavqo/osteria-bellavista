"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "@/components/magnetic-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n";

const navLinks = [
  { key: "menu", href: "#menu" },
  { key: "experiences", href: "#esperienze" },
  { key: "gallery", href: "#galleria" },
  { key: "book", href: "#prenota" },
];

export function Navbar() {
  const { t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = navLinks.map((link) => link.href.replace("#", ""));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a 
              href="#" 
              className="flex flex-col items-start"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className={`font-heading text-xl sm:text-2xl font-semibold tracking-tight transition-colors duration-300 ${
                  isScrolled
                    ? "text-foreground"
                    : "text-white"
                }`}
              >
                Osteria Bellavista
              </span>
              <span
                className={`text-[10px] sm:text-xs tracking-[0.3em] uppercase transition-colors duration-300 ${
                  isScrolled
                    ? "text-muted-foreground"
                    : "text-white/70"
                }`}
              >
                Lugano · Dal 1987
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.a
                  key={link.key}
                  href={link.href}
                  className={`relative text-sm tracking-wide transition-colors duration-300 ${
                    isScrolled
                      ? "text-foreground"
                      : "text-white/90"
                  } hover:text-accent`}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {t(`nav.${link.key}`) as string}
                  {activeSection === link.href.replace("#", "") && (
                    <motion.span
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.a>
              ))}
              
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              <MagneticButton strength={0.15}>
                <a
                  href="#prenota"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 hover:shadow-lg"
                >
                  {t("nav.bookTable") as string}
                </a>
              </MagneticButton>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 transition-colors ${
                isScrolled ? "text-foreground" : "text-white"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.key}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-heading text-3xl text-foreground hover:text-accent transition-colors"
                >
                  {t(`nav.${link.key}`) as string}
                </motion.a>
              ))}
              
              {/* Mobile Language & Theme */}
              <div className="flex items-center gap-4 mt-4">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              
              <motion.a
                href="#prenota"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-full py-4 text-lg font-medium text-center transition-colors"
              >
                {t("nav.bookTable") as string}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
