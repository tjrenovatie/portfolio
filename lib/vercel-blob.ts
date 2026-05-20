import { list } from "@vercel/blob";

function isMissingBlobStoreError(error: unknown): boolean {
  return error instanceof Error && error.message.includes("store does not exist");
}

export async function getFirstBlobUrl(
  prefix: string,
  fallback?: string
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.warn("BLOB_READ_WRITE_TOKEN missing");
    return fallback ?? "/fallback.avif";
  }

  try {
    const { blobs } = await list({ prefix, token, limit: 10 });
    const file = blobs.find((b) => !b.pathname.endsWith("/"));
    return file?.url ?? fallback ?? "/fallback.avif";
  } catch (error) {
    if (isMissingBlobStoreError(error)) {
      return fallback ?? "/fallback.avif";
    }

    console.warn(`Blob list error for prefix "${prefix}":`, error);
    return fallback ?? "/fallback.avif";
  }
}

export async function getAllBlobUrls(prefix: string): Promise<string[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return [];
  }

  try {
    const { blobs } = await list({ prefix, token });
    return blobs.filter((b) => !b.pathname.endsWith("/")).map((b) => b.url);
  } catch (error) {
    if (isMissingBlobStoreError(error)) {
      return [];
    }

    console.warn(`Blob list error for prefix "${prefix}":`, error);
    return [];
  }
}
