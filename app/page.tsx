"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Icon from "../components/icon";
import { Socials } from "../lib/data";
import { AnimatePresence, motion } from "framer-motion";

const Home = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAnimationComplete = () => {
    setHasAnimated(true);
  };

  let navigationLinks = [
    { name: "ABOUT", url: "/about" },
    { name: "PROJECTS", url: "/projects" },
    { name: "CONTACT", url: "/contact" },
  ];

  return (
    <motion.article
      className="fixed inset-0 flex h-dvh w-dvw items-center justify-center overflow-hidden bg-marble-dark bg-cover bg-center"
      initial={!hasAnimated ? { opacity: 0 } : false}
      animate={!hasAnimated ? { opacity: 1 } : false}
      transition={{ duration: 0.2, delay: 0.2 }}
      onAnimationComplete={() => handleAnimationComplete()}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/55"
        role="img"
        aria-label="Decorative background overlay for styling purposes"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      <button
        type="button"
        aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
        aria-expanded={isMenuOpen}
        aria-controls="home-mobile-navigation"
        onClick={() => setIsMenuOpen((current) => !current)}
        className="absolute right-4 top-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/25 text-[--color-primary] shadow-lg shadow-black/20 backdrop-blur-md transition hover:border-white/40 hover:bg-black/35 hover:text-[--color-secondary] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 lg:hidden"
      >
        {isMenuOpen ? (
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      <AnimatePresence>
        {isMenuOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-20 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.nav
              id="home-mobile-navigation"
              className="fixed inset-y-0 right-0 z-20 flex w-full flex-col justify-center bg-gray-950 px-6 shadow-2xl sm:w-80 lg:hidden"
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.28, ease: "easeOut", type: "tween" }}
              aria-label="Mobile navigation"
            >
              <ul className="flex flex-col items-center gap-8">
                {navigationLinks.map((page) => (
                  <li key={page.name} className="w-full max-w-xs">
                    <Link
                      href={page.url}
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-lg py-3 text-center text-lg font-semibold text-white transition hover:bg-white/10 hover:text-[--color-primary]"
                    >
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>

      {/* Logo Section */}

      <motion.header
        className="content relative grid w-full gap-8 font-lato text-white text-[1.2rem] p-4 justify-center"
        initial={!hasAnimated ? { y: 100 } : false}
        animate={!hasAnimated ? { y: 0 } : false}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="relative flex justify-center w-full">
          <div className="w-[15rem] h-[10rem] sm:w-[20rem] sm:h-[15rem] md:w-[25rem] md:h-[15rem] lg:w-[30rem] lg:h-[20rem] relative">
            <Image
              src="/assets/img/logo.avif"
              alt="TJ Renovatie Logo"
              layout="fill"
              objectFit="contain"
              priority={false}
            />
          </div>
        </div>
        <div className="landing-description flex justify-center">
          <h1 className="text-center text-xl font-light text-white sm:text-2xl">
            Voor ontwerp, advies, verbouwing en renovatie.
            <br />
            Komt goed!
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex flex-col items-center gap-6 md:flex-row md:justify-center ">
          {navigationLinks.map((page) => (
            <Link
              key={page.name}
              href={`${page.url}`}
              className="text-center text-[--color-primary]"
            >
              {page.name}
            </Link>
          ))}
        </div>
      </motion.header>

      {/* Social Links */}
      <motion.footer
        className="absolute bottom-0 flex h-[4rem] w-full items-end justify-center pb-20 text-center text-white lg:pb-10"
        initial={!hasAnimated ? { y: 100 } : false}
        animate={!hasAnimated ? { y: 0 } : false}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {Array.isArray(Socials) && Socials.length > 0 ? (
          <ul className="flex justify-center gap-8">
            {Socials.map((social) => (
              <li
                key={social.key}
                className="bg-white rounded-full  w-[2.5rem] h-[2.5rem] flex items-center justify-center hover:bg-[--color-primary]"
              >
                <Link
                  href={social.url}
                  target="_blank"
                  className="text-[--color-primary] pt-1 hover:text-white"
                >
                  <Icon name={social.key} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p>No social links available.</p>
            <Link
              href="/contact"
              className="text-[--color-primary] underline hover:text-white"
            >
              Contact us for more information
            </Link>
          </div>
        )}
      </motion.footer>
    </motion.article>
  );
};

export default Home;
