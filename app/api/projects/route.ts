import { NextResponse } from "next/server";
import { getPublicProjects } from "@/lib/db-projects";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const projects = await getPublicProjects();
    const response = NextResponse.json({ data: projects });

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, max-age=300, stale-while-revalidate=3600",
    );

    return response;
  } catch (error) {
    console.error("Projects API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
