// hooks/useProjectImages.ts
"use client";

import { useState, useEffect } from "react";

interface ProjectImageCache {
  data: Record<string, string[]>;
}

export function useProjectImages(prefix: string | null) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prefix) {
      setImages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch("/api/project-images/all", { next: { revalidate: 86400 } })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        return res.json();
      })
      .then(({ data }: { data: ProjectImageCache["data"] }) => {
        setImages(data[prefix] || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [prefix]);

  return { images, loading, error };
}
