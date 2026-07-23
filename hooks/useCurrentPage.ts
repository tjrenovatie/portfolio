import { usePathname } from "@/i18n/navigation";

export function useCurrentPage() {
  const pathname = usePathname();
  const currentPathname = pathname ?? "";

  return {
    pathname: currentPathname,
    isHome: currentPathname === "/",
    isAbout: currentPathname === "/about",
    isDiensten: currentPathname === "/diensten",
    isProjects: currentPathname === "/projects",
    isContact: currentPathname === "/contact",
  };
}
