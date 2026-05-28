"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { useCurrentPage } from "@/hooks/useCurrentPage";

type PublicShellProps = {
  children: ReactNode;
  isWebsiteEnabled: boolean;
};

export default function PublicShell({
  children,
  isWebsiteEnabled,
}: PublicShellProps) {
  const { isHome, pathname } = useCurrentPage();
  const isDashboard = pathname.startsWith("/dashboard");
  const sectionSpacing = isHome ? "mt-0" : "mt-20";

  if (isDashboard) {
    return children;
  }

  if (!isWebsiteEnabled) {
    return <main className="min-h-dvh bg-white" aria-hidden="true" />;
  }

  return (
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
  );
}
