"use client";

import type { ReactNode } from "react";
import { useLayoutEffect } from "react";
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

  useLayoutEffect(() => {
    if (isDashboard) return;

    const root = document.documentElement;

    const syncViewportWidth = () => {
      root.style.setProperty("--app-viewport-width", `${window.innerWidth}px`);
    };

    syncViewportWidth();

    window.addEventListener("resize", syncViewportWidth);
    window.addEventListener("orientationchange", syncViewportWidth);
    window.visualViewport?.addEventListener("resize", syncViewportWidth);

    const frame = window.requestAnimationFrame(syncViewportWidth);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", syncViewportWidth);
      window.removeEventListener("orientationchange", syncViewportWidth);
      window.visualViewport?.removeEventListener("resize", syncViewportWidth);
    };
  }, [isDashboard, pathname]);

  useLayoutEffect(() => {
    if (isDashboard) return;

    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;

    html.style.scrollBehavior = "auto";
    window.scrollTo({ left: 0, top: 0, behavior: "auto" });

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ left: 0, top: 0, behavior: "auto" });
      html.style.scrollBehavior = previousScrollBehavior;
    });

    return () => {
      window.cancelAnimationFrame(frame);
      html.style.scrollBehavior = previousScrollBehavior;
    };
  }, [isDashboard, pathname]);

  if (isDashboard) {
    return children;
  }

  if (!isWebsiteEnabled) {
    return <main className="min-h-dvh bg-white" aria-hidden="true" />;
  }

  return (
    <main className="public-shell flex flex-col items-center bg-gray-50">
      {!isHome && <Header />}
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
