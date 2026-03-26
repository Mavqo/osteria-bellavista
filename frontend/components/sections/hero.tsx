"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HeroBackground } from "@/components/artistic-placeholder";
import { MaskReveal } from "@/components/text-reveal";
import { MagneticButton } from "@/components/magnetic-button";
import { useI18n } from "@/lib/i18n";

export function Hero() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background with Parallax */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <HeroBackground />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col justify-end pb-20 sm:pb-32 px-6 sm:px-12 lg:px-20"
      >
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block text-[#c9a961] text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 sm:mb-6">
              {(t("hero.badge") as string)}
            </span>
          </motion.div>

          {/* Title with Mask Reveal */}
          <MaskReveal delay={0.4}>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.1] mb-4 sm:mb-6">
              {(t("hero.title1") as string)}
              <br />
              <span className="text-[#c9a961]">{(t("hero.title2") as string)}</span> {(t("hero.title3") as string)}
            </h1>
          </MaskReveal>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base sm:text-lg lg:text-xl text-white/80 max-w-xl mb-8 sm:mb-10 leading-relaxed"
          >
            {(t("hero.subtitle") as string)}
          </motion.p>

          {/* CTA Buttons with Magnetic Effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <MagneticButton strength={0.2}>
              <a
                href="#prenota"
                className="inline-flex items-center justify-center bg-[#1a3a2a] hover:bg-[#2d5a3f] text-white rounded-full px-8 sm:px-10 py-4 text-sm sm:text-base font-medium tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-[#1a3a2a]/20"
              >
                {(t("hero.cta1") as string)}
              </a>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <a
                href="#menu"
                className="inline-flex items-center justify-center border border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-8 sm:px-10 py-4 text-sm sm:text-base font-medium tracking-wide bg-transparent transition-all duration-300"
              >
                {(t("hero.cta2") as string)}
              </a>
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.a
          href="#menu"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase">{(t("hero.scroll") as string)}</span>
          <ChevronDown size={20} />
        </motion.a>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-20 right-20 w-64 h-64 rounded-full border border-white/20 hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-40 right-40 w-32 h-32 rounded-full border border-[#c9a961]/30 hidden lg:block"
      />
    </section>
  );
}
