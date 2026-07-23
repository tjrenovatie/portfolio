"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "Hoe lang duurt een gemiddelde badkamerrenovatie?",
    answer:
      "Een complete badkamerrenovatie duurt gemiddeld 2 tot 3 weken, afhankelijk van de complexiteit en de gekozen materialen.",
  },
  {
    question: "Kan ik tijdens de renovatie in mijn woning blijven wonen?",
    answer:
      "Ja, dat kan meestal wel. We zorgen ervoor dat de overlast tot een minimum wordt beperkt en houden de werkplek elke dag schoon.",
  },
  {
    question: "Zorgen jullie ook voor de afvoer van bouwafval?",
    answer:
      "Absoluut. Wij regelen de containers en de volledige afvoer van puin en oud sanitair, zodat u nergens omkijken naar heeft.",
  },
  {
    question: "Moet ik zelf materialen inkopen?",
    answer:
      "Dat mag, maar het hoeft niet. Wij hebben goede contacten met leveranciers en kunnen alles voor u regelen tegen gunstige tarieven.",
  },
  {
    question: "Werken jullie met vaste prijzen?",
    answer:
      "Wij werken op basis van een gespecificeerde offerte. Zo weet u vooraf exact waar u aan toe bent en zijn er geen verrassingen achteraf.",
  },
  {
    question: "Zit er garantie op de uitgevoerde werkzaamheden?",
    answer:
      "Ja, wij bieden standaard garantie op al ons vakmanschap. De specifieke termijnen hangen af van het type werk en de gebruikte materialen.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
