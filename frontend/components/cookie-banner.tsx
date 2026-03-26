"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function CookieBanner() {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[420px] z-50"
        >
          <div className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg mb-2">
                  {t("cookie.title") as string}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t("cookie.description") as string}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2.5 px-4 rounded-full transition-colors"
                  >
                    {t("cookie.accept") as string}
                  </button>
                  <button
                    onClick={handleDecline}
                    className="flex-1 border border-border hover:border-primary text-foreground text-sm font-medium py-2.5 px-4 rounded-full transition-colors"
                  >
                    {t("cookie.decline") as string}
                  </button>
                </div>
              </div>
              <button
                onClick={handleDecline}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
