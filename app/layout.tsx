"use client";

import "./globals.css";

import Header from "../components/header";
import Footer from "../components/footer";
import React from "react";
import { siteMetadata } from "./site-metadata";
import { useCurrentPage } from "@/hooks/useCurrentPage";
import { AnimatePresence, motion } from "framer-motion";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isHome, pathname } = useCurrentPage();
  const isDashboard = pathname.startsWith("/dashboard");
  const sectionSpacing = isHome ? "mt-0" : "mt-20";

  return (
    <html lang="en" className="!scroll-smooth">
      <head>{siteMetadata}</head>
      <body className={`bg-black`}>
        {isDashboard ? (
          children
        ) : (
          <main className="flex flex-col items-center bg-gray-50">
            <Header />
            <AnimatePresence mode="wait" initial={false}>
              <motion.section
                key={pathname}
                className={`w-full ${sectionSpacing}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {children}
              </motion.section>
            </AnimatePresence>
            {!isHome && <Footer />}
          </main>
        )}
      </body>
    </html>
  );
}
