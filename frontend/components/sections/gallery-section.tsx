"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OptimizedImage } from "@/components/optimized-image";
import { MaskReveal } from "@/components/text-reveal";
import { useI18n } from "@/lib/i18n";
import { X, ZoomIn } from "lucide-react";

const categories = [
  { id: "all", name: "All" },
  { id: "dishes", name: "Dishes" },
  { id: "ambience", name: "Ambience" },
  { id: "lake", name: "Lake" },
];

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    alt: "Sala ristorante elegante",
    category: "ambience",
    span: "col-span-2 row-span-2",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    alt: "Filetto di manzo",
    category: "dishes",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    alt: "Vista lago e montagne",
    category: "lake",
    span: "col-span-1 row-span-2",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80",
    alt: "Pasta fatta in casa",
    category: "dishes",
    span: "col-span-1 row-span-1",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80",
    alt: "Atmosfera rustica",
    category: "ambience",
    span: "col-span-1 row-span-1",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
    alt: "Tramonto sul lago",
    category: "lake",
    span: "col-span-2 row-span-1",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
    alt: "Risotto ai funghi",
    category: "dishes",
    span: "col-span-1 row-span-1",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    alt: "Tavola apparecchiata",
    category: "ambience",
    span: "col-span-1 row-span-1",
  },
];

export function GallerySection() {
  const { t, locale } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  const filteredImages =
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <section id="galleria" className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent text-xs sm:text-sm tracking-[0.3em] uppercase font-medium block"
          >
            {(t("gallery.badge") as string)}
          </motion.span>
          <MaskReveal delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
              {(t("gallery.title") as string)}
            </h2>
          </MaskReveal>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {(t("gallery.subtitle") as string)}
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center gap-2 sm:gap-4 mb-12 flex-wrap"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 sm:px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card text-foreground hover:bg-muted border border-border"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {(t(`gallery.filters.${category.id}`) as string)}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid - Bento Style */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl ${image.span}`}
                onClick={() => setSelectedImage(image)}
              >
                <OptimizedImage
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="transition-transform duration-700 group-hover:scale-110"
                  containerClassName="absolute inset-0"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-heading text-lg">{image.alt}</p>
                    <p className="text-white/70 text-sm capitalize">{image.category}</p>
                  </div>
                </div>

                {/* Zoom Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1 rounded-full capitalize">
                    {image.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl bg-black/95 border-none p-0 overflow-hidden">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          {selectedImage && (
            <div className="relative aspect-video">
              <OptimizedImage
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                className="object-contain"
                containerClassName="absolute inset-0"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white font-heading text-xl">{selectedImage.alt}</p>
                <p className="text-white/70 capitalize">{selectedImage.category}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
