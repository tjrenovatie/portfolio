// hooks/useProjectImages.ts
"use client";

import { useState, useEffect } from "react";

interface ProjectImageCache {
  data: Record<string, string[]>;
}

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

    fetch("/api/project-images/all", { next: { revalidate: 86400 } })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        return res.json();
      })
      .then(({ data }: { data: ProjectImageCache["data"] }) => {
        if (ignore) return;

        setImageCache((currentCache) => ({
          ...currentCache,
          [prefix]: data[prefix] || [],
        }));
      })
      .catch((err) => {
        if (ignore) return;

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
