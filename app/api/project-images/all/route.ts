// app/api/project-images/all/route.ts
import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { projects } from "@/lib/projects";

export const dynamic = "force-static";
export const revalidate = 86_400;

export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 500 });
  }

  try {
    let { blobs, hasMore, cursor } = await list({ token, limit: 1000 });

    let allBlobs = blobs;
    let currentCursor = cursor;
    while (hasMore && currentCursor) {
      const {
        blobs: nextBlobs,
        hasMore: nextHasMore,
        cursor: nextCursor,
      } = await list({
        token,
        cursor: currentCursor,
        limit: 1000,
      });
      allBlobs = allBlobs.concat(nextBlobs);
      currentCursor = nextCursor;
      hasMore = nextHasMore;
    }

    // Group by project prefix in memory
    const result: Record<string, string[]> = {};

    projects.forEach((project) => {
      result[project.blobPrefix] = [];
    });

    allBlobs.forEach((blob) => {
      for (const project of projects) {
        if (
          blob.pathname.startsWith(project.blobPrefix) &&
          !blob.pathname.endsWith("/")
        ) {
          result[project.blobPrefix].push(blob.url);
          break;
        }
      }
    });

    const response = NextResponse.json({ data: result });
    // response.headers.set(
    //   "Cache-Control",
    //   "public, s-maxage=86400, max-age=3600, stale-while-revalidate=3600"
    // );
    return response;
  } catch (error) {
    console.error("Blob list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
