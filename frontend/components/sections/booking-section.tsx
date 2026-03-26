"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { restaurantInfo } from "@/lib/data";
import { MaskReveal } from "@/components/text-reveal";
import { MagneticButton } from "@/components/magnetic-button";
import { useI18n } from "@/lib/i18n";
import { CalendarIcon, Clock, Users, Sparkles, MapPin, Check, ArrowRight, Sun, Wine, Trees, Sparkles as SparklesIcon } from "lucide-react";

const timeSlots = [
  "12:00", "12:30", "13:00", "13:30", "14:00",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
];

const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

const tablePreferenceIcons: Record<string, React.ReactNode> = {
  terrazza: <Sun className="w-6 h-6" />,
  interno: <Wine className="w-6 h-6" />,
  giardino: <Trees className="w-6 h-6" />,
  nessuna: <SparklesIcon className="w-6 h-6" />,
};

export function BookingSection() {
  const { t } = useI18n();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [guests, setGuests] = useState<number>(2);
  const [preference, setPreference] = useState<string>("nessuna");
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const canProceed = date && time && guests;

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <section id="prenota" className="py-24 sm:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent text-xs sm:text-sm tracking-[0.3em] uppercase font-medium block"
          >
            {(t("booking.badge") as string)}
          </motion.span>
          <MaskReveal delay={0.2}>
            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl text-foreground mt-4 mb-6">
              {(t("booking.title") as string)}
            </h2>
          </MaskReveal>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            {(t("booking.subtitle") as string)}
          </motion.p>
        </div>

        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card rounded-3xl border-border shadow-xl overflow-hidden">
              <CardContent className="p-6 sm:p-10">
                <div className="flex items-center justify-center gap-4 mb-10">
                  <div className={`flex items-center gap-2 ${step === 1 ? "text-foreground" : "text-muted-foreground"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step === 1 ? "bg-primary text-primary-foreground" : "bg-primary/10"
                    }`}>
                      1
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{(t("booking.step1") as string)}</span>
                  </div>
                  <div className="w-12 h-px bg-border" />
                  <div className={`flex items-center gap-2 ${step === 2 ? "text-foreground" : "text-muted-foreground"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step === 2 ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      2
                    </div>
                    <span className="text-sm font-medium hidden sm:block">{(t("booking.step2") as string)}</span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-foreground font-medium mb-4 flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-accent" />
                            {(t("booking.date") as string)}
                          </h3>
                          <div className="border border-border rounded-2xl p-4 inline-block">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              disabled={(date) => date < new Date()}
                              className="rounded-lg"
                            />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-foreground font-medium mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-accent" />
                            {(t("booking.time") as string)}
                          </h3>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {timeSlots.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => setTime(slot)}
                                className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                                  time === slot
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-foreground hover:bg-primary/10"
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>

                          <div className="mt-8">
                            <h3 className="text-foreground font-medium mb-4 flex items-center gap-2">
                              <Users className="w-4 h-4 text-accent" />
                              {(t("booking.guests") as string)}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {guestOptions.map((num) => (
                                <button
                                  key={num}
                                  onClick={() => setGuests(num)}
                                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                                    guests === num
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-foreground hover:bg-primary/10"
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                              <span className="flex items-center px-3 text-sm text-muted-foreground">
                                {(t("booking.guestsNote") as string)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-foreground font-medium mb-4 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-accent" />
                          {(t("booking.tablePreference") as string)}
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {["terrazza", "interno", "giardino", "nessuna"].map((prefId) => {
                            const prefName = t(`booking.tablePreferences.${prefId}.name`) as string;
                            const prefDesc = t(`booking.tablePreferences.${prefId}.description`) as string;
                            return (
                              <button
                                key={prefId}
                                onClick={() => setPreference(prefId)}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                  preference === prefId
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/30"
                                }`}
                              >
                                <span className="text-primary mb-2 block">{tablePreferenceIcons[prefId]}</span>
                                <p className="font-medium text-foreground">{prefName}</p>
                                <p className="text-xs text-muted-foreground">{prefDesc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          onClick={() => setStep(2)}
                          disabled={!canProceed}
                          className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-full px-8 py-4 text-base disabled:cursor-not-allowed transition-all"
                        >
                          {(t("booking.actions.continue") as string)}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-md mx-auto space-y-6"
                    >
                      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
                        <h3 className="font-heading text-xl mb-4">{(t("booking.summary") as string)}</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between border-b border-primary-foreground/10 pb-2">
                            <span className="text-primary-foreground/70">{(t("booking.date") as string)}</span>
                            <span className="font-medium">
                              {date?.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-primary-foreground/10 pb-2">
                            <span className="text-primary-foreground/70">{(t("booking.time") as string)}</span>
                            <span className="font-medium">{time}</span>
                          </div>
                          <div className="flex justify-between border-b border-primary-foreground/10 pb-2">
                            <span className="text-primary-foreground/70">{(t("booking.guests") as string)}</span>
                            <span className="font-medium">{guests} {(t("booking.guestsLabel") as string)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-primary-foreground/70">{(t("booking.tablePreference") as string)}</span>
                            <span className="font-medium">
                              {(t(`booking.tablePreferences.${preference}.name`) as string)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground text-center">
                          {(t("booking.form.info") as string)}
                        </p>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder={t("booking.form.name") as string}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
                          />
                          <input
                            type="email"
                            placeholder={t("booking.form.email") as string}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
                          />
                          <input
                            type="tel"
                            placeholder={t("booking.form.phone") as string}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
                          />
                          <textarea
                            placeholder={t("booking.form.notes") as string}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep(1)}
                          className="flex-1 border border-border hover:border-primary text-foreground rounded-full py-4 font-medium transition-colors"
                        >
                          {(t("booking.actions.back") as string)}
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-4 font-medium transition-colors"
                        >
                          {(t("booking.actions.confirm") as string)}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="max-w-md mx-auto text-center"
          >
            <Card className="bg-card rounded-3xl border-border p-10 shadow-xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-green-600" />
              </motion.div>
              <h3 className="font-heading text-2xl text-foreground mb-3">
                {(t("booking.success.title") as string)}
              </h3>
              <p className="text-muted-foreground mb-6">
                {(t("booking.success.message") as string)}
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setStep(1);
                  setDate(undefined);
                  setTime(undefined);
                }}
                className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-8 py-3 font-medium transition-colors"
              >
                {(t("booking.actions.new") as string)}
              </button>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
}
