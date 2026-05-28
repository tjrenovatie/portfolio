import { usePathname } from "next/navigation";

export function useCurrentPage() {
  const pathname = usePathname();
  const currentPathname = pathname ?? "";

  return {
    pathname: currentPathname,
    isHome: currentPathname === "/",
    isAbout: currentPathname === "/about",
    isProjects: currentPathname === "/projects",
    isContact: currentPathname === "/contact",
  };
}
