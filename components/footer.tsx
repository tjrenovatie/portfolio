import React from "react";
import { useTranslations } from "next-intl";
import { Routes, Socials } from "../lib/data";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import Icon from "./icon";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="w-full relative bg-marble-dark bg-no-repeat bg-cover text-white py-20">
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Logo Section */}
        <div className="flex justify-center mb-10">
          <Image
            src="/assets/img/logo.avif"
            alt="TJ Renovatie Logo"
            width={128}
            height={128}
            className="h-24 w-auto md:h-32"
            priority
          />
        </div>

        {/* Navigation Links */}
        <nav
          className="flex justify-center mb-10"
          aria-label="Footer Navigation"
        >
          <ul className="flex gap-6">
            {Routes.filter((link) => link.key !== "home").map((page) => {
              const label = t(`nav.${page.key}`);

              return (
                <li key={page.key}>
                  <Link
                    href={page.url}
                    className="text-[--color-primary] font-semibold uppercase"
                    aria-label={label}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Social Media Links */}
        <div className="flex justify-center mb-10">
          <ul className="flex gap-6">
            {Socials.map((social) => (
              <li
                key={social.key}
                className="bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[--color-primary]"
              >
                <Link
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.key}
                  className="text-[--color-primary] flex items-center justify-center hover:text-white"
                >
                  <Icon name={social.key} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Copyright Section */}
        <div className="text-center pt-10 align-bottom">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
