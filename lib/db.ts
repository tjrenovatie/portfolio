import { neon } from "@neondatabase/serverless";

function normalizeDatabaseUrl(rawDatabaseUrl: string) {
  const databaseUrl = rawDatabaseUrl
    .replace(/^(DATABASE_URL|POSTGRES_URL)=/, "")
    .replace(/^["']|["']$/g, "")
    .trim();

  let parsedDatabaseUrl: URL;

  try {
    parsedDatabaseUrl = new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL or POSTGRES_URL must be a valid URL.");
  }

  if (!["postgres:", "postgresql:"].includes(parsedDatabaseUrl.protocol)) {
    throw new Error("DATABASE_URL or POSTGRES_URL must be a Postgres URL.");
  }

  return databaseUrl;
}

function getDatabaseUrl(): string {
  const rawDatabaseUrl =
    process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim();

  if (!rawDatabaseUrl) {
    throw new Error("DATABASE_URL or POSTGRES_URL must be set.");
  }

  return normalizeDatabaseUrl(rawDatabaseUrl);
}

let cachedSql: ReturnType<typeof neon> | undefined;

function getSql(): ReturnType<typeof neon> {
  if (!cachedSql) {
    cachedSql = neon(getDatabaseUrl());
  }

  return cachedSql;
}

// Deferred so importing this module (e.g. during Next.js's build-time page
// data collection) never needs a real DATABASE_URL/POSTGRES_URL — Vercel's
// sensitive env vars are only decrypted at request runtime, not for `vercel
// build` running outside Vercel's own build infrastructure.
export const sql: ReturnType<typeof neon> = new Proxy(
  (() => {}) as unknown as ReturnType<typeof neon>,
  {
    apply(_target, _thisArg, args) {
      return Reflect.apply(getSql(), undefined, args);
    },
    get(_target, property, receiver) {
      return Reflect.get(getSql(), property, receiver);
    },
  },
);

export type ProjectRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnailImageId: string | null;
  thumbnailUrl: string | null;
  thumbnailPathname: string | null;
  sortOrder: number;
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

export type SiteImageRecord = {
  key: string;
  blobUrl: string;
  blobDownloadUrl: string | null;
  blobPathname: string;
  blobContentType: string;
  blobSize: number | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicProjectImage = Pick<
  ProjectImageRecord,
  | "id"
  | "role"
  | "blobUrl"
  | "blobDownloadUrl"
  | "blobPathname"
  | "blobContentType"
  | "blobSize"
  | "width"
  | "height"
  | "altText"
  | "sortOrder"
  | "createdAt"
>;

export type PublicProject = ProjectRecord & {
  images: PublicProjectImage[];
  imageUrls: string[];
  thumbnail: PublicProjectImage | null;
};
