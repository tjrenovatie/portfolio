import type { Metadata } from "next";

export const DASHBOARD_ROBOTS_HEADER =
  "noindex, nofollow, noarchive, nosnippet";

export const dashboardNoIndexMetadata: Metadata = {
  robots: {
    follow: false,
    index: false,
    nocache: true,
    googleBot: {
      follow: false,
      index: false,
      noimageindex: true,
    },
  },
};
