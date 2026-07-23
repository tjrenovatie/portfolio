"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/button";
import TextArea from "@/components/textArea";
import TextInput from "@/components/textInput";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const initialFormState: FormData = { name: "", email: "", message: "" };

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
  const t = useTranslations("contact");
  const contactPoints = t.raw("expectPoints") as string[];
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validateField = (name: keyof FormData, value: string): string => {
    if (!value.trim()) return t("form.requiredError");

    if (name === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      return t("form.invalidEmailError");
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
    [errors],
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
        setSuccessMessage(t("form.successMessage"));
      } else {
        setSuccessMessage(t("form.errorMessage"));
      }
    } catch (error) {
      setSuccessMessage(t("form.errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="w-full bg-white">
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pt-20">
        <motion.div
          className="mb-10 max-w-3xl select-text"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.p className="eyebrow mb-4" variants={revealUp}>
            {t("eyebrow")}
          </motion.p>
          <motion.h1
            className="mb-5 text-[--color-primary-title]"
            variants={revealUp}
          >
            {t("title")}
          </motion.h1>
          <motion.p
            className="max-w-2xl text-base leading-8 text-neutral-700 sm:text-lg"
            variants={revealUp}
          >
            {t("subtitle")}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid w-full grid-cols-1 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl md:grid-cols-[1fr_1fr] lg:grid-cols-[1.2fr_0.8fr]"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-10"
            noValidate
            variants={revealUp}
          >
            {successMessage && (
              <p className="rounded-md border border-[--color-primary]/25 bg-[--color-primary]/10 px-4 py-3 text-base font-semibold text-neutral-900">
                {successMessage}
              </p>
            )}

            <TextInput
              type="text"
              id="name"
              name="name"
              label={t("form.nameLabel")}
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              error={errors.name}
            />

            <TextInput
              type="email"
              id="email"
              name="email"
              label={t("form.emailLabel")}
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              error={errors.email}
            />

            <TextArea
              id="message"
              name="message"
              label={t("form.messageLabel")}
              rows={6}
              value={formData.message}
              onChange={handleChange}
              error={errors.message}
              helperText={t("form.messageHelperText")}
            />

            <Button
              type="submit"
              fullWidth
              icon={
                <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />
              }
              variant="dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("form.submitting") : t("form.submitButton")}
            </Button>
          </motion.form>

          <motion.aside
            className="relative min-h-[28rem] bg-neutral-950 text-white sm:min-h-full"
            variants={revealRight}
          >
            <Image
              src="/assets/img/badkamer-contact.avif"
              alt="Badkamer renovatie"
              fill
              sizes="(min-width: 1024px) 45vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
              <p className="eyebrow eyebrow-light mb-4">
                {t("expectEyebrow")}
              </p>
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
