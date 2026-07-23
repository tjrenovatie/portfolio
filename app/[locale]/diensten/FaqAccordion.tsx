"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations("diensten");
  const faqItems = t.raw("faq") as FaqItem[];

  return (
    <div className="space-y-4">
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div
            key={item.question}
            className="border border-[--color-border-subtle] bg-[--color-surface-anthracite]"
          >
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[--color-surface-card] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--color-primary] sm:px-8 sm:py-6"
            >
              <span className="pr-4 text-base font-semibold text-[--color-broken-white] sm:text-lg">
                {item.question}
              </span>
              <ChevronDownIcon
                aria-hidden="true"
                className={`h-5 w-5 flex-shrink-0 text-[--color-primary] transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-base leading-7 text-[--color-text-muted] sm:px-8">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
