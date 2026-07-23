import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const routes = [
  { path: "", changeFrequency: "yearly" as const, priority: 1 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/diensten", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/projects", changeFrequency: "weekly" as const, priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routing.locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `https://tj-renovatie.nl/${locale}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
  );
}
