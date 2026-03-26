"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { menuCategories } from "@/lib/data";
import { MaskReveal } from "@/components/text-reveal";
import { useI18n } from "@/lib/i18n";
import { Leaf, WheatOff, Fish, Wine, UtensilsCrossed } from "lucide-react";

const tagIcons: Record<string, React.ReactNode> = {
  vegetariano: <Leaf className="w-3 h-3" />,
  "senza glutine": <WheatOff className="w-3 h-3" />,
  pesce: <Fish className="w-3 h-3" />,
  bottiglia: <Wine className="w-3 h-3" />,
  classico: <UtensilsCrossed className="w-3 h-3" />,
};

const tagColors: Record<string, string> = {
  vegetariano: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  "senza glutine": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  pesce: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  bottiglia: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  classico: "bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700",
};

export function MenuSection() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("antipasti");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <section id="menu" className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent text-xs sm:text-sm tracking-[0.3em] uppercase font-medium block"
          >
            {(t("menu.badge") as string)}
          </motion.span>
          <MaskReveal delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
              {(t("menu.title") as string)}
            </h2>
          </MaskReveal>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {(t("menu.subtitle") as string)}
          </motion.p>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="antipasti"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {/* Tab List */}
          <div className="relative mb-12">
            <TabsList className="w-full flex flex-wrap justify-center gap-2 sm:gap-3 bg-transparent h-auto p-0">
              {menuCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TabsTrigger
                    value={category.id}
                    className="relative px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-card data-[state=inactive]:text-foreground data-[state=inactive]:hover:bg-primary/10 border-2 data-[state=active]:border-primary data-[state=inactive]:border-border min-w-[100px] sm:min-w-[120px]"
                  >
                    {(t(`menu.categories.${category.id}`) as string)}
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>
          </div>

          {/* Tab Content */}
          {menuCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <AnimatePresence mode="wait">
                {activeTab === category.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-6"
                  >
                    {category.items.map((item, index) => (
                      <motion.div
                        key={(t(`menu.items.${category.id}.${index}.name`) as string)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="group relative bg-card rounded-2xl p-6 sm:p-8 border border-border hover:border-primary/20 hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden"
                      >
                        {/* Hover background effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{ x: hoveredItem === item.name ? "0%" : "-100%" }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />

                        <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="font-heading text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors">
                                {item.name}
                              </h3>
                              {item.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className={`${tagColors[tag]} text-[10px] uppercase tracking-wider font-medium flex items-center gap-1`}
                                >
                                  {tagIcons[tag]}
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-muted-foreground mt-2 text-sm sm:text-base leading-relaxed">
                              {(t(`menu.items.${category.id}.${index}.description`) as string)}
                            </p>
                          </div>
                          <div className="text-right">
                            <motion.span
                              className="font-heading text-2xl sm:text-3xl text-accent"
                              animate={{
                                scale: hoveredItem === item.name ? 1.1 : 1,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.price}
                            </motion.span>
                            <span className="text-muted-foreground text-sm ml-1">
                              CHF
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-muted-foreground text-sm mt-12"
        >
          {(t("menu.disclaimer") as string)}
        </motion.p>
      </div>
    </section>
  );
}
