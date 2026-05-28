// hooks/useProjectImages.ts
"use client";

import { useState, useEffect } from "react";

type ProjectsApiProject = {
  id: string;
  imageUrls?: string[];
};

export function useProjectImages(prefix: string | null) {
  const [imageCache, setImageCache] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<{
    message: string;
    prefix: string;
  } | null>(null);

  useEffect(() => {
    if (!prefix) {
      return;
    }

    let ignore = false;

    fetch("/api/projects", { next: { revalidate: 3600 } })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        return res.json();
      })
      .then(({ data }: { data: ProjectsApiProject[] }) => {
        if (ignore) return;

        const databaseProject = data.find((project) => project.id === prefix);

        if (databaseProject) {
          setImageCache((currentCache) => ({
            ...currentCache,
            [prefix]: databaseProject.imageUrls ?? [],
          }));
          return;
        }

        setImageCache((currentCache) => ({
          ...currentCache,
          [prefix]: [],
        }));
      })
      .catch((err) => {
        if (ignore) return;

        setImageCache((currentCache) => ({
          ...currentCache,
          [prefix]: [],
        }));

        setError({ message: err.message, prefix });
      });

    return () => {
      ignore = true;
    };
  }, [prefix]);

  const hasCachedImages = Boolean(prefix && prefix in imageCache);
  const currentError = error?.prefix === prefix ? error.message : null;

  return {
    images: prefix ? imageCache[prefix] ?? [] : [],
    loading: Boolean(prefix && !hasCachedImages && !currentError),
    error: currentError,
  };
}
