import "./globals.css";

import React from "react";
import { siteMetadata } from "./site-metadata";
import PublicShell from "./PublicShell";
import { getWebsiteDisplayEnabled } from "@/lib/site-settings";

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
      </body>
    </html>
  );
}
