"use client";

import { motion } from "framer-motion";
import React from "react";

interface ArtisticPlaceholderProps {
  className?: string;
  icon?: React.ReactNode;
  label?: string;
  gradient?: "olive" | "terracotta" | "gold" | "mixed" | "dark";
  animate?: boolean;
}

const gradients = {
  olive: "from-[#1a3a2a] via-[#2d5a3f] to-[#1a3a2a]",
  terracotta: "from-[#c45c3e] via-[#d97b5e] to-[#c45c3e]",
  gold: "from-[#c9a961] via-[#e8d5b0] to-[#c9a961]",
  mixed: "from-[#1a3a2a] via-[#c45c3e] to-[#c9a961]",
  dark: "from-[#0f1f17] via-[#1a3a2a] to-[#0f1f17]",
};

export function ArtisticPlaceholder({
  className = "",
  icon,
  label = "",
  gradient = "olive",
  animate = true,
}: ArtisticPlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
    >
      {/* Animated gradient background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradients[gradient]} ${
          animate ? "animate-gradient-shift" : ""
        }`}
        style={{
          backgroundSize: "200% 200%",
        }}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "linear",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white/80">
        <motion.div
          className="text-white/80 mb-4"
          animate={animate ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {icon}
        </motion.div>
        {label && (
          <span className="font-heading text-lg sm:text-xl text-center px-4">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

// Hero specific version
export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a3a2a] via-[#2d5a3f] to-[#1a3a2a]" />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full bg-[#c45c3e]/20 blur-[120px]"
        animate={{
          x: ["-20%", "10%", "-20%"],
          y: ["-10%", "20%", "-10%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "-20%", left: "-10%" }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-[#c9a961]/15 blur-[100px]"
        animate={{
          x: ["10%", "-20%", "10%"],
          y: ["20%", "-10%", "20%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "-10%", right: "-5%" }}
      />
      
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
    </div>
  );
}
