"use client";

import "./globals.css";

import Header from "../components/header";
import Footer from "../components/footer";
import React, { useEffect, useState } from "react";
import { siteMetadata } from "./site-metadata";
import { useCurrentPage } from "@/hooks/useCurrentPage";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isHome } = useCurrentPage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showHeader = !isHome || isMobile;

  const sectionSpacing = showHeader && !isHome ? "mt-20" : "mt-0";

  return (
    <html lang="en" className="!scroll-smooth">
      <head>{siteMetadata}</head>
      <body className={`bg-black`}>
        <main className="flex flex-col items-center bg-gray-50">
          {showHeader && <Header />}
          <section className={`w-full ${sectionSpacing}`}>{children}</section>
          {!isHome && <Footer />}
        </main>
      </body>
    </html>
  );
}
