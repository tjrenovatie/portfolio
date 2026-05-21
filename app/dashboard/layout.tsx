"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  ChartBarIcon,
  IdentificationIcon,
  FolderIcon,
  HomeIcon,
  MoonIcon,
  RectangleGroupIcon,
  PhotoIcon,
  SunIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { DashboardButton } from "@/components/dashboard";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: ChartBarIcon },
  { name: "About", href: "/dashboard/about", icon: IdentificationIcon },
  { name: "Projects", href: "/dashboard/projects", icon: FolderIcon },
  { name: "Images", href: "/dashboard/images", icon: PhotoIcon },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: WrenchScrewdriverIcon,
  },
];

function subscribeToColorScheme(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
  };
}

function getColorSchemeSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerColorSchemeSnapshot() {
  return false;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const systemPrefersDark = useSyncExternalStore(
    subscribeToColorScheme,
    getColorSchemeSnapshot,
    getServerColorSchemeSnapshot,
  );
  const [themeOverride, setThemeOverride] = useState<boolean | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const isDarkMode = themeOverride ?? systemPrefersDark;
  const themeClasses = isDarkMode
    ? "bg-neutral-950 text-neutral-100"
    : "bg-neutral-100 text-neutral-950";
  const panelClasses = isDarkMode
    ? "border-neutral-800 bg-neutral-900"
    : "border-neutral-200 bg-white";
  const navigationClasses = isDarkMode
    ? "text-neutral-300 hover:bg-neutral-800 hover:text-white"
    : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950";
  const iconButtonClasses = isDarkMode
    ? "border-neutral-700 bg-neutral-800 text-neutral-100 hover:border-neutral-600 hover:bg-neutral-700"
    : "border-neutral-300 bg-white text-neutral-800 hover:border-[--color-primary] hover:text-[--color-secondary]";
  const sidebarWidthClasses = isSidebarCollapsed ? "w-20" : "w-64";
  const contentOffsetClasses = isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, [isDarkMode]);

  return (
    <main
      className={`min-h-dvh transition-colors ${isDarkMode ? "dark" : ""} ${themeClasses}`}
    >
      <aside
        className={`fixed inset-y-0 left-0 hidden border-r transition-[width,background-color,border-color] lg:flex lg:flex-col ${sidebarWidthClasses} ${panelClasses}`}
      >
        <DashboardButton
          aria-label={
            isSidebarCollapsed ? "Expand side menu" : "Collapse side menu"
          }
          aria-expanded={!isSidebarCollapsed}
          onClick={() => setIsSidebarCollapsed((current) => !current)}
          className="absolute right-0 top-20 z-10 h-9 w-9 translate-x-1/2 rounded-full !gap-0 !p-0 shadow-sm"
          variant="secondary"
        >
          <RectangleGroupIcon className="h-5 w-5" aria-hidden="true" />
        </DashboardButton>

        <div
          className={`flex h-16 items-center justify-between border-b px-3 ${
            isDarkMode ? "border-neutral-800" : "border-neutral-200"
          }`}
        >
          <Link
            href="/dashboard"
            className={`min-w-0 text-sm font-bold tracking-wide ${
              isSidebarCollapsed ? "mx-auto" : "px-3"
            }`}
            aria-label="TJ Renovatie dashboard"
          >
            {isSidebarCollapsed ? "TJ" : "TJ Renovatie"}
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex min-h-11 items-center rounded-md px-3 text-sm font-semibold transition-colors ${
                  isSidebarCollapsed ? "justify-center" : "gap-3"
                } ${navigationClasses}`}
                aria-label={item.name}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div
          className={`border-t p-3 ${
            isDarkMode ? "border-neutral-800" : "border-neutral-200"
          }`}
        >
          <Link
            href="/"
            className={`flex min-h-11 items-center rounded-md px-3 text-sm font-semibold transition-colors ${
              isSidebarCollapsed ? "justify-center" : "gap-3"
            } ${navigationClasses}`}
            aria-label="Public site"
          >
            <HomeIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {!isSidebarCollapsed && <span>Public site</span>}
          </Link>
        </div>
      </aside>

      <section className={`transition-[padding] ${contentOffsetClasses}`}>
        <header
          className={`sticky top-0 z-30 flex min-h-16 items-center justify-between border-b px-4 backdrop-blur sm:px-6 lg:px-8 ${
            isDarkMode
              ? "border-neutral-800 bg-neutral-900/95"
              : "border-neutral-200 bg-white/95"
          }`}
        >
          <div>
            <p
              className={`text-xs font-semibold uppercase ${
                isDarkMode ? "text-neutral-400" : "text-neutral-500"
              }`}
            >
              Dashboard
            </p>
            <h1
              className={`text-base font-bold ${
                isDarkMode ? "text-white" : "text-neutral-950"
              }`}
            >
              Content management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              aria-pressed={isDarkMode}
              onClick={() => setThemeOverride(!isDarkMode)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-md border transition-colors ${iconButtonClasses}`}
            >
              {isDarkMode ? (
                <SunIcon
                  className="h-5 w-5 text-amber-300"
                  aria-hidden="true"
                />
              ) : (
                <MoonIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            <Link
              href="/"
              className={`inline-flex min-h-10 items-center justify-center rounded-md border px-4 text-sm font-semibold transition-colors lg:hidden ${
                isDarkMode
                  ? "border-neutral-700 text-neutral-100 hover:border-neutral-500 hover:text-white"
                  : "border-neutral-300 text-neutral-800 hover:border-[--color-primary] hover:text-[--color-secondary]"
              }`}
            >
              Public site
            </Link>
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>
    </main>
  );
}
