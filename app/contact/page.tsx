"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/button";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const initialFormState: FormData = { name: "", email: "", message: "" };

const contactPoints = [
  "Persoonlijk advies voor uw ruimte",
  "Duidelijke afspraken over planning",
  "Reactie met een praktische volgende stap",
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const revealRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.15,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Contact component for a contact form.
 * @returns
 */
export default function Contact() {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateField = (name: keyof FormData, value: string): string => {
    if (!value.trim()) return "Dit veld is verplicht.";

    if (name === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      return "Vul een geldig e-mailadres in.";
    }

    return "";
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    let isValid = true;

    (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Optionally validate on change
      if (errors[name as keyof FormData]) {
        const updatedError = validateField(name as keyof FormData, value);
        setErrors((prev) => ({ ...prev, [name]: updatedError }));
      }
    },
    [errors]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setSuccessMessage("");

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData(initialFormState);
        setErrors({});
        setSuccessMessage("Uw bericht is verzonden. Ik neem contact met u op.");
      } else {
        setSuccessMessage("Er ging iets mis. Probeer het later opnieuw.");
      }
    } catch (error) {
      setSuccessMessage("Er ging iets mis. Probeer het later opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="bg-white">
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-28 lg:px-8">
        <motion.div
          className="mb-10 max-w-3xl select-text"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.p className="eyebrow mb-4" variants={revealUp}>
            Contact
          </motion.p>
          <motion.h1
            className="mb-5 text-[--color-primary-title]"
            variants={revealUp}
          >
            Met wat kan ik je helpen?
          </motion.h1>
          <motion.p
            className="max-w-2xl text-base leading-8 text-neutral-700 sm:text-lg"
            variants={revealUp}
          >
            Vertel kort wat u wilt aanpakken. Ik reageer persoonlijk en denk
            mee over de ruimte, de planning en de beste volgende stap.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl lg:grid-cols-[1fr_0.9fr]"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-8 lg:p-10"
            noValidate
            variants={revealUp}
          >
            {successMessage && (
              <p className="rounded-md border border-[--color-primary]/25 bg-[--color-primary]/10 px-4 py-3 text-base font-semibold text-neutral-900">
                {successMessage}
              </p>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-neutral-900"
              >
                Naam
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={`mt-2 min-h-12 w-full rounded-md border bg-white px-4 text-neutral-900 outline-none transition focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20 ${
                  errors.name ? "border-red-500" : "border-neutral-300"
                }`}
              />
              {errors.name && (
                <p id="name-error" className="mt-2 text-sm text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-neutral-900"
              >
                E-mailadres
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`mt-2 min-h-12 w-full rounded-md border bg-white px-4 text-neutral-900 outline-none transition focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20 ${
                  errors.email ? "border-red-500" : "border-neutral-300"
                }`}
              />
              {errors.email && (
                <p id="email-error" className="mt-2 text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-neutral-900"
              >
                Bericht
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? "message-error" : "message-help"
                }
                className={`mt-2 w-full resize-y rounded-md border bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20 ${
                  errors.message ? "border-red-500" : "border-neutral-300"
                }`}
              />
              <p id="message-help" className="mt-2 text-sm text-neutral-500">
                Bijvoorbeeld: type ruimte, gewenste werkzaamheden en gewenste
                periode.
              </p>
              {errors.message && (
                <p id="message-error" className="mt-2 text-sm text-red-600">
                  {errors.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              icon={<PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />}
              variant="dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Versturen..." : "Verstuur bericht"}
            </Button>
          </motion.form>

          <motion.aside
            className="relative min-h-[28rem] bg-neutral-950 text-white"
            variants={revealRight}
          >
            <Image
              src="/assets/img/badkamer-contact.avif"
              alt="Badkamer renovatie"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="eyebrow eyebrow-light mb-4">Wat u kunt verwachten</p>
              <div className="grid gap-3">
                {contactPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-md border border-white/15 bg-black/25 px-4 py-3 backdrop-blur-sm"
                  >
                    <p className="text-base font-semibold text-white">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </motion.div>
      </section>
    </article>
  );
}
