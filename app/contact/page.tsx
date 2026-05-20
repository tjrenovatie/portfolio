"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const initialFormState: FormData = { name: "", email: "", message: "" };

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
    if (!value.trim()) return "This field is required.";

    if (name === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      return "Please enter a valid email address.";
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
        setSuccessMessage("✅ Your message has been sent!");
      } else {
        setSuccessMessage("❌ Something went wrong. Please try again.");
      }
    } catch (error) {
      setSuccessMessage("❌ An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="max-w-6xl mx-auto px-4 py-32">
      <h1 className="text-3xl text-center text-[--color-primary-title] font-semibold mb-10">
        Met wat kan ik je helpen?
      </h1>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-2xl shadow-md"
          noValidate
        >
          {successMessage && (
            <p className="text-green-600 font-medium">{successMessage}</p>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              aria-hidden="true"
            />
            {errors.name && (
              <p id="name-error" className="text-red-600 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              aria-hidden="true"
            />
            {errors.email && (
              <p id="email-error" className="text-red-600 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>

            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring ${
                errors.message ? "border-red-500" : "border-gray-300"
              }`}
              aria-hidden="true"
            />
            {errors.message && (
              <p id="message-error" className="text-red-600 text-sm mt-1">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Image */}
        <div className="w-full h-full relative">
          <Image
            src="/assets/img/badkamer-contact.avif"
            alt="Contact"
            width={800}
            height={600}
            className="rounded-2xl object-cover w-full h-full"
            priority
          />
        </div>
      </div>
    </article>
  );
}
