"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/button";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const navigation = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "/about" },
    { name: "PROJECTS", href: "/projects" },
    { name: "CONTACT", href: "/contact" },
  ];

  const close = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed left-0 top-0 z-50 h-20 w-full ${
        isHome ? "lg:hidden" : "bg-marble-dark bg-cover bg-center shadow-2xl"
      }`}
    >
      {!isHome && <div className="absolute inset-0 bg-black/55" />}

      <nav className="relative mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {!isHome && (
          <div className="flex lg:flex-1">
            <Link href="/" className="flex items-center">
              <Image
                src="/assets/img/logo.avif"
                alt="TJ Renovatie Logo"
                width={64}
                height={64}
                className="h-10 w-auto md:h-12"
                draggable={false}
                priority
              />
            </Link>
          </div>
        )}

        <div className={`flex ${isHome ? "ml-auto" : "lg:hidden"}`}>
          {isOpen ? (
            <Button
              type="button"
              variant="dark"
              aria-label="Close main menu"
              aria-expanded="true"
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen(false)}
              className="fixed right-4 top-4 z-[70] !h-12 !w-12 rotate-90 !gap-0 !rounded-full border border-white/25 !bg-black/25 !p-0 !text-[var(--color-primary)] shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:!bg-black/35 hover:!text-[var(--color-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6"
            >
              <span
                aria-hidden="true"
                className="absolute h-0.5 w-6 translate-y-0 rotate-45 rounded-full bg-current transition-transform duration-300 ease-out"
              />
              <span
                aria-hidden="true"
                className="absolute h-0.5 w-6 scale-x-0 rounded-full bg-current opacity-0 transition-all duration-200 ease-out"
              />
              <span
                aria-hidden="true"
                className="absolute h-0.5 w-6 translate-y-0 -rotate-45 rounded-full bg-current transition-transform duration-300 ease-out"
              />
            </Button>
          ) : (
            <Button
              type="button"
              variant="dark"
              aria-label="Open main menu"
              aria-expanded="false"
              onClick={() => setIsOpen(true)}
              className="relative !h-12 !w-12 !gap-0 !rounded-full border border-white/25 !bg-black/25 !p-0 !text-[var(--color-primary)] shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:!bg-black/35 hover:!text-[var(--color-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span
                aria-hidden="true"
                className="absolute h-0.5 w-6 -translate-y-2 rounded-full bg-current transition-transform duration-300 ease-out"
              />
              <span
                aria-hidden="true"
                className="absolute h-0.5 w-6 scale-x-75 rounded-full bg-current opacity-100 transition-all duration-200 ease-out"
              />
              <span
                aria-hidden="true"
                className="absolute h-0.5 w-6 translate-y-2 rounded-full bg-current transition-transform duration-300 ease-out"
              />
            </Button>
          )}
        </div>

        {!isHome && (
          <div className="hidden lg:flex lg:gap-x-10 lg:flex-1 lg:justify-end">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname === item.href
                    ? "text-white"
                    : "text-[--color-primary] hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`fixed inset-0 bg-black ${isHome ? "" : "lg:hidden"}`}
              onClick={close}
            />
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.28, ease: "easeOut", type: "tween" }}
              className={`fixed inset-y-0 right-0 flex w-full flex-col justify-center bg-gray-950 p-6 shadow-2xl sm:w-80 ${
                isHome ? "" : "lg:hidden"
              }`}
            >
              <nav className="flex flex-col items-center space-y-8">
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.12,
                        delayChildren: 0.4,
                      },
                    },
                    exit: {
                      opacity: 0,
                      transition: {
                        staggerChildren: 0.08,
                        staggerDirection: -1,
                      },
                    },
                  }}
                  className="flex w-full flex-col items-center space-y-8"
                >
                  {navigation.map((item) => (
                    <motion.li
                      key={item.name}
                      variants={{
                        hidden: { opacity: 0, x: -60 },
                        visible: {
                          opacity: 1,
                          x: 0,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          },
                        },
                        exit: { opacity: 0, x: 60 },
                      }}
                      className="w-full max-w-xs"
                    >
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={
                          pathname === item.href ? "page" : undefined
                        }
                        className={`relative block rounded-lg py-3 text-center text-lg font-semibold transition-colors hover:bg-white/10 ${
                          pathname === item.href
                            ? "bg-white/10 text-[var(--color-primary)]"
                            : "text-white hover:text-[var(--color-primary)]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
