"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCurrentPage } from "@/hooks/useCurrentPage";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isHome } = useCurrentPage();
  const router = useRouter();
  const pending = useRef<string | null>(null);

  const navigation = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "/about" },
    { name: "PROJECTS", href: "/projects" },
    { name: "CONTACT", href: "/contact" },
  ];

  const open = () => {
    setIsOpen(true);
  };

  const close = (href?: string) => {
    if (href) {
      pending.current = href;
    }
    setIsOpen(false);
  };

  const onExitComplete = () => {
    if (pending.current) {
      router.push(pending.current);
      pending.current = null;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 h-20 ${
        isHome
          ? "bg-transparent"
          : "bg-marble-dark bg-cover bg-center shadow-2xl"
      }`}
    >
      {!isHome && <div className="absolute inset-0 bg-black/50" />}

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        {!isHome && (
          <div className="flex lg:flex-1">
            <Link href="/" className="flex items-center group">
              <Image
                src="/assets/img/logo.avif"
                alt="TJ Renovatie Logo"
                width={64}
                height={64}
                className="h-8 w-auto md:h-10"
                draggable={false}
                priority
              />
            </Link>
          </div>
        )}

        <div className={`flex lg:hidden ${isHome ? "ml-auto" : ""}`}>
          <button
            type="button"
            onClick={() => {
              open();
            }}
            className="-m-2.5 inline-flex items-center justify-center rounded-full bg-white p-1 text-[var(--color-primary)] shadow-sm transition-colors "
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon
              aria-hidden="true"
              className="size-6 text-[var(--color-primary)]"
            />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-10 lg:flex-1 lg:justify-end">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-[--color-primary]"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      <AnimatePresence onExitComplete={onExitComplete}>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black"
              onClick={() => close()}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3, ease: "easeIn", type: "tween" }}
              className="fixed inset-y-0 right-0 w-full bg-gray-900 p-6 sm:w-80 flex flex-col justify-center"
            >
              <div className="absolute top-6 right-6">
                <button
                  title="close"
                  onClick={() => {
                    close();
                  }}
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="size-6" />
                </button>
              </div>

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
                  {navigation.map((item, i) => (
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
                        onClick={(e) => {
                          e.preventDefault();
                          close(item.href);
                        }}
                        className="block rounded-lg py-3 text-center text-lg font-semibold text-[var(--color-primary)] hover:bg-white/10 transition-colors"
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
