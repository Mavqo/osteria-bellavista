"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { experiences } from "@/lib/data";
import { MaskReveal } from "@/components/text-reveal";
import { ArtisticPlaceholder } from "@/components/artistic-placeholder";
import { MagneticButton } from "@/components/magnetic-button";
import { useI18n } from "@/lib/i18n";
import { Clock, Check, Sun, Wine, Users } from "lucide-react";

export function ExperiencesSection() {
  const { t } = useI18n();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="esperienze" className="py-24 sm:py-32 bg-primary dark:bg-[#0f2318] relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          animate={{
            backgroundPosition: ["0px 0px", "60px 60px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Gradient orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px]"
        animate={{
          x: ["-10%", "10%", "-10%"],
          y: ["-10%", "10%", "-10%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "10%", left: "-10%" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#c9a961] text-xs sm:text-sm tracking-[0.3em] uppercase font-medium block"
          >
            {(t("experiences.badge") as string)}
          </motion.span>
          <MaskReveal delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl text-white mt-4 mb-6">
              {(t("experiences.title") as string)}
            </h2>
          </MaskReveal>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {(t("experiences.subtitle") as string)}
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredCard(exp.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="bg-white/95 dark:bg-card/80 backdrop-blur-sm border-0 rounded-3xl overflow-hidden h-full hover:shadow-2xl transition-all duration-500 group relative">
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Image Placeholder */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <ArtisticPlaceholder
                    className="w-full h-full"
                    gradient={index === 0 ? "terracotta" : index === 1 ? "gold" : "olive"}
                    icon={index === 0 ? <Sun className="w-12 h-12" /> : index === 1 ? <Wine className="w-12 h-12" /> : <Users className="w-12 h-12" />}
                    label=""
                    animate={hoveredCard === exp.id}
                  />
                  
                  {/* Price badge */}
                  <div className="absolute top-4 right-4">
                    <motion.span
                      className="bg-[#c9a961] text-[#1a3a2a] text-xs font-semibold px-3 py-1 rounded-full block"
                      animate={{
                        scale: hoveredCard === exp.id ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {exp.price}
                    </motion.span>
                  </div>
                </div>

                <CardContent className="p-6 sm:p-8 relative">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{exp.duration}</span>
                  </div>

                  <h3 className="font-heading text-xl sm:text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    {(t(`experiences.items.${exp.id}.title`) as string)}
                  </h3>

                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                    {(t(`experiences.items.${exp.id}.description`) as string)}
                  </p>

                  <div className="space-y-3 mb-6">
                    <p className="text-xs uppercase tracking-wider text-foreground font-semibold">
                      {(t("experiences.includes") as string)}:
                    </p>
                    <ul className="space-y-2">
                      {(() => {
                        const includes = t(`experiences.items.${exp.id}.includes`) as unknown as string[];
                        return includes?.map((item: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>

                  <MagneticButton strength={0.1} className="w-full">
                    <a
                      href="#prenota"
                      className="inline-flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3 px-4 text-sm font-medium transition-all duration-300 hover:shadow-lg"
                    >
                      {(t("experiences.price") as string)}
                    </a>
                  </MagneticButton>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
