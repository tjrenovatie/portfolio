"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "../components/icon";
import { Socials } from "../lib/data";
import { motion } from "framer-motion";

const Home = () => {
  var [hasAnimated, setHasAnimated] = useState(false);

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
