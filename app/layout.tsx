import "./globals.css";

import React from "react";
import type { Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { siteMetadata } from "./site-metadata";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="!scroll-smooth">
      <head>{siteMetadata}</head>
      <body className={`bg-black`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
