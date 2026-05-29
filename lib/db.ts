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

const rawDatabaseUrl =
  process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim();

const databaseUrl = rawDatabaseUrl ? normalizeDatabaseUrl(rawDatabaseUrl) : "";

function throwMissingDatabaseUrl(): never {
  throw new Error("DATABASE_URL or POSTGRES_URL must be set.");
}

function createMissingDatabaseClient() {
  return new Proxy(() => throwMissingDatabaseUrl(), {
    apply() {
      return throwMissingDatabaseUrl();
    },
    get(_target, property) {
      if (property === "query") {
        return () => throwMissingDatabaseUrl();
      }

      return undefined;
    },
  }) as unknown as ReturnType<typeof neon>;
}

export const sql = databaseUrl ? neon(databaseUrl) : createMissingDatabaseClient();

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
