"use client";

import { motion } from "framer-motion";
import { restaurantInfo } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { MagneticButton } from "@/components/magnetic-button";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUp,
  Camera,
  Globe,
} from "lucide-react";

export function Footer() {
  const { t } = useI18n();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#c9a961]/5 rounded-full blur-3xl" />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <h3 className="font-heading text-2xl sm:text-3xl mb-2">
              Osteria Bellavista
            </h3>
            <p className="text-[#c9a961] text-xs tracking-[0.3em] uppercase mb-4">
              Lugano · Dal 1987
            </p>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              {(t("footer.tagline") as string)}
            </p>
            
            {/* Social Buttons */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-wider text-[#c9a961] font-semibold">
                {(t("footer.followUs") as string)}
              </p>
              <div className="flex gap-3">
                {/* Instagram */}
                <MagneticButton strength={0.15}>
                  <a
                    href={`https://instagram.com/${restaurantInfo.social.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-primary-foreground/10 hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 flex items-center justify-center transition-all duration-300 group border border-primary-foreground/10 hover:border-transparent"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </MagneticButton>
                
                {/* Facebook */}
                <MagneticButton strength={0.15}>
                  <a
                    href={`https://facebook.com/${restaurantInfo.social.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-primary-foreground/10 hover:bg-[#1877F2] flex items-center justify-center transition-all duration-300 group border border-primary-foreground/10 hover:border-transparent"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </MagneticButton>
                
                {/* TripAdvisor */}
                <MagneticButton strength={0.15}>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-primary-foreground/10 hover:bg-[#00af87] flex items-center justify-center transition-all duration-300 group border border-primary-foreground/10 hover:border-transparent"
                    aria-label="TripAdvisor"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.469 16.483l-.015-.034c-.246.292-.55.528-.895.693-.346.166-.725.252-1.11.252h-.004c-.772 0-1.476-.357-1.936-.91-.46.553-1.165.91-1.936.91h-.004c-.772 0-1.476-.357-1.936-.91-.46.553-1.165.91-1.936.91-.387 0-.766-.086-1.11-.252-.347-.165-.65-.401-.895-.693l-.015.034c-.642-.62-.98-1.47-.916-2.357.063-.887.512-1.67 1.232-2.183l-.01-.025c.38-.654.987-1.16 1.72-1.424.317-.11.649-.167.986-.167h.003c.772 0 1.477.357 1.937.91.46-.553 1.164-.91 1.936-.91h.003c.772 0 1.477.357 1.937.91.46-.553 1.164-.91 1.936-.91.338 0 .67.057.987.167.733.264 1.34.77 1.72 1.424l-.01.025c.72.513 1.169 1.296 1.232 2.183.064.887-.274 1.737-.916 2.357z"/>
                    </svg>
                  </a>
                </MagneticButton>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-lg mb-6">{(t("footer.contacts") as string)}</h4>
            <ul className="space-y-4">
              <li>
                <motion.a
                  href={`https://maps.google.com/?q=${restaurantInfo.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors group"
                  whileHover={{ x: 4 }}
                >
                  <MapPin className="w-5 h-5 mt-0.5 text-[#c9a961] group-hover:text-accent transition-colors shrink-0" />
                  <span className="text-sm">{restaurantInfo.address}</span>
                </motion.a>
              </li>
              <li>
                <motion.a
                  href={`tel:${restaurantInfo.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors group"
                  whileHover={{ x: 4 }}
                >
                  <Phone className="w-5 h-5 text-[#c9a961] group-hover:text-accent transition-colors shrink-0" />
                  <span className="text-sm">{restaurantInfo.phone}</span>
                </motion.a>
              </li>
              <li>
                <motion.a
                  href={`mailto:${restaurantInfo.email}`}
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors group"
                  whileHover={{ x: 4 }}
                >
                  <Mail className="w-5 h-5 text-[#c9a961] group-hover:text-accent transition-colors shrink-0" />
                  <span className="text-sm">{restaurantInfo.email}</span>
                </motion.a>
              </li>
            </ul>
          </motion.div>

          {/* Hours */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-lg mb-6">{(t("footer.hours") as string)}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-0.5 text-[#c9a961] shrink-0" />
                <div className="text-sm">
                  <p className="text-primary-foreground/70">
                    <span className="text-primary-foreground">{(t("footer.lunch") as string)}:</span>{" "}
                    {restaurantInfo.hours.lunch}
                  </p>
                  <p className="text-primary-foreground/70 mt-1">
                    <span className="text-primary-foreground">{(t("footer.dinner") as string)}:</span>{" "}
                    {restaurantInfo.hours.dinner}
                  </p>
                  <p className="text-accent mt-2 text-xs">
                    {(t("footer.closed") as string)}: {restaurantInfo.hours.closed}
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-heading text-lg mb-6">{(t("footer.quickLinks") as string)}</h4>
            <ul className="space-y-3">
              {[
                { name: t("nav.menu") as string, href: "#menu" },
                { name: t("nav.experiences") as string, href: "#esperienze" },
                { name: t("nav.gallery") as string, href: "#galleria" },
                { name: t("nav.book") as string, href: "#prenota" },
                { name: "Privacy Policy", href: "#" },
                { name: "Cookie Policy", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm inline-block"
                    whileHover={{ x: 4 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-xs sm:text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Osteria Bellavista. Tutti i diritti riservati.
            </p>
            <MagneticButton strength={0.15}>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-primary-foreground/50 hover:text-primary-foreground transition-colors text-xs sm:text-sm group"
              >
                <span>{(t("footer.backToTop") as string)}</span>
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </button>
            </MagneticButton>
          </div>
        </div>
      </div>
    </footer>
  );
}
