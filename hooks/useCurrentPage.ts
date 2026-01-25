import { usePathname } from "next/navigation";

export function useCurrentPage() {
  const pathname = usePathname();
  return {
    pathname,
    isHome: pathname === "/",
    isAbout: pathname === "/about",
    isProjects: pathname === "/projects",
    isContact: pathname === "/contact",
  };
}
