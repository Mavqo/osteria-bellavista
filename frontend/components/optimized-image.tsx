"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  objectFit?: "cover" | "contain" | "fill" | "none";
  placeholderColor?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  priority = false,
  fill = false,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  objectFit = "cover",
  placeholderColor = "#e8e2d9",
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        fill && "absolute inset-0",
        containerClassName
      )}
      style={{
        backgroundColor: placeholderColor,
        ...(width && !fill ? { width } : {}),
        ...(height && !fill ? { height } : {}),
      }}
    >
      {/* Skeleton/Placeholder */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundSize: "200% 100%",
          animation: !isLoaded ? "shimmer 1.5s infinite" : "none",
        }}
      />

      {/* Actual Image */}
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            "transition-all duration-500",
            objectFit === "cover" && "object-cover",
            objectFit === "contain" && "object-contain",
            objectFit === "fill" && "object-fill",
            objectFit === "none" && "object-none",
            fill && "w-full h-full",
            !isLoaded && "opacity-0 scale-105",
            isLoaded && "opacity-100 scale-100",
            className
          )}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-4xl">🖼️</span>
        </div>
      )}

      {/* Blur-up effect overlay */}
      <motion.div
        className="absolute inset-0 backdrop-blur-sm pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 0.3 }}
        transition={{ duration: 0.5 }}
      />

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
