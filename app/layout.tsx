import "./globals.css";

import React from "react";
import type { Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { siteMetadata } from "./site-metadata";
import PublicShell from "./PublicShell";
import { getWebsiteDisplayEnabled } from "@/lib/site-settings";

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
  const isWebsiteEnabled = await getWebsiteDisplayEnabled();

  return (
    <html lang="en" className="!scroll-smooth">
      <head>{siteMetadata}</head>
      <body className={`bg-black`}>
        <PublicShell isWebsiteEnabled={isWebsiteEnabled}>{children}</PublicShell>
        <Analytics />
      </body>
    </html>
  );
}
