"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Bars3Icon,
  ChartBarIcon,
  EnvelopeIcon,
  IdentificationIcon,
  FolderIcon,
  HomeIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import {
  DashboardButton,
  DashboardDrawer,
  DashboardLogoutButton,
} from "@/components/dashboard";
import { DASHBOARD_LOGIN_PATH } from "@/lib/dashboard-auth-routes";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: ChartBarIcon },
  { name: "About", href: "/dashboard/about", icon: IdentificationIcon },
  { name: "Projects", href: "/dashboard/projects", icon: FolderIcon },
  { name: "Email template", href: "/dashboard/messages", icon: EnvelopeIcon },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: WrenchScrewdriverIcon,
  },
];

function isNavigationItemActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentPathname = pathname ?? "";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const themeClasses = "bg-neutral-950 text-neutral-100";
  const panelClasses = "border-neutral-800 bg-neutral-900";
  const navigationClasses =
    "text-neutral-300 hover:bg-neutral-800 hover:text-white";
  const activeNavigationClasses = "bg-neutral-800 text-white";
  const sidebarWidthClasses = isSidebarCollapsed ? "w-20" : "w-64";
  const contentOffsetClasses = isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64";

  useEffect(() => {
    document.documentElement.classList.add("dark");

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  if (currentPathname === DASHBOARD_LOGIN_PATH) {
    return children;
  }

  return (
    <main className={`dark min-h-dvh transition-colors ${themeClasses}`}>
      <aside
        className={`fixed inset-y-0 left-0 hidden border-r transition-[width,background-color,border-color] lg:flex lg:flex-col ${sidebarWidthClasses} ${panelClasses}`}
      >
        <DashboardButton
          aria-label={
            isSidebarCollapsed ? "Expand side menu" : "Collapse side menu"
          }
          aria-expanded={!isSidebarCollapsed}
          onClick={() => setIsSidebarCollapsed((current) => !current)}
          className="absolute right-0 top-20 z-10 h-9 !min-h-9 w-9 translate-x-1/2 rounded-full !gap-0 !p-0 shadow-sm"
          variant="secondary"
        >
          {isSidebarCollapsed ? (
            <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </DashboardButton>

        <div className="flex h-16 items-center justify-between border-b border-neutral-800 px-3">
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
            const isActive = isNavigationItemActive(currentPathname, item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex min-h-11 items-center rounded-md px-3 text-sm font-semibold transition-colors ${
                  isSidebarCollapsed ? "justify-center" : "gap-3"
                } ${isActive ? activeNavigationClasses : navigationClasses}`}
                aria-label={item.name}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-neutral-800 p-3">
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
          <DashboardLogoutButton isCompact={isSidebarCollapsed} />
        </div>
      </aside>

      <section className={`transition-[padding] ${contentOffsetClasses}`}>
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <DashboardButton
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              className="h-10 w-10 shrink-0 !gap-0 !p-0 lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              variant="secondary"
            >
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            </DashboardButton>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-neutral-400">
                Dashboard
              </p>
              <h1 className="truncate text-base font-bold text-white">
                Content management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DashboardLogoutButton isCompact />
          </div>
        </header>

        <DashboardDrawer
          open={isMobileMenuOpen}
          onClose={setIsMobileMenuOpen}
          title="TJ Renovatie"
        >
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isNavigationItemActive(
                currentPathname,
                item.href,
              );

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition-colors ${
                    isActive ? activeNavigationClasses : navigationClasses
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="space-y-2 border-t border-neutral-800 p-3">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition-colors ${navigationClasses}`}
            >
              <HomeIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>Public site</span>
            </Link>
            <DashboardLogoutButton />
          </div>
        </DashboardDrawer>

        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>
    </main>
  );
}
