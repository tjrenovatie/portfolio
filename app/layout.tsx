"use client";

import "./globals.css";

import Header from "../components/header";
import Footer from "../components/footer";
import React from "react";
import { siteMetadata } from "./site-metadata";
import { useCurrentPage } from "@/hooks/useCurrentPage";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isHome } = useCurrentPage();
  const sectionSpacing = isHome ? "mt-0" : "mt-20";

  return (
    <html lang="en" className="!scroll-smooth">
      <head>{siteMetadata}</head>
      <body className={`bg-black`}>
        <main className="flex flex-col items-center bg-gray-50">
          <Header />
          <section className={`w-full ${sectionSpacing}`}>{children}</section>
          {!isHome && <Footer />}
        </main>
      </body>
    </html>
  );
}
