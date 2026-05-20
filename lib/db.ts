import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL or POSTGRES_URL must be set.");
}

export const sql = neon(databaseUrl);

export type ProjectRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnailImageId: string | null;
  thumbnailUrl: string | null;
  thumbnailPathname: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectImageRecord = {
  id: string;
  projectId: string;
  role: "thumbnail" | "gallery";
  blobUrl: string;
  blobDownloadUrl: string | null;
  blobPathname: string;
  blobContentType: string;
  blobSize: number | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  sortOrder: number;
  createdAt: Date;
};
