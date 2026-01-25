import { list } from "@vercel/blob";

export async function getFirstBlobUrl(
  prefix: string,
  fallback?: string
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.warn("BLOB_READ_WRITE_TOKEN missing");
    return fallback ?? "/fallback.png";
  }

  const { blobs } = await list({ prefix, token, limit: 10 });
  const file = blobs.find((b) => !b.pathname.endsWith("/"));
  return file?.url ?? fallback ?? "/fallback.png";
}

export async function getAllBlobUrls(prefix: string): Promise<string[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return [];
  }

  let { blobs } = await list({ prefix, token });
  return blobs.filter((b) => !b.pathname.endsWith("/")).map((b) => b.url);
}
