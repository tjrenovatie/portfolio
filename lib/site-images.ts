import { sql, type SiteImageRecord } from "@/lib/db";

export const PROFILE_IMAGE_KEY = "profile_image";

type SiteImageRow = {
  key: string;
  blob_url: string;
  blob_download_url: string | null;
  blob_pathname: string;
  blob_content_type: string;
  blob_size: number | string | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  created_at: Date;
  updated_at: Date;
};

function mapSiteImage(row: SiteImageRow): SiteImageRecord {
  return {
    key: row.key,
    blobUrl: row.blob_url,
    blobDownloadUrl: row.blob_download_url,
    blobPathname: row.blob_pathname,
    blobContentType: row.blob_content_type,
    blobSize: row.blob_size === null ? null : Number(row.blob_size),
    width: row.width,
    height: row.height,
    altText: row.alt_text,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getSiteImage(key: string) {
  const rows = (await sql`
    SELECT
      key,
      blob_url,
      blob_download_url,
      blob_pathname,
      blob_content_type,
      blob_size,
      width,
      height,
      alt_text,
      created_at,
      updated_at
    FROM site_images
    WHERE key = ${key}
    LIMIT 1
  `) as SiteImageRow[];

  return rows[0] ? mapSiteImage(rows[0]) : null;
}

export function getProfileImage() {
  return getSiteImage(PROFILE_IMAGE_KEY);
}

export async function upsertSiteImage({
  altText,
  blobContentType,
  blobDownloadUrl,
  blobPathname,
  blobSize,
  blobUrl,
  height,
  key,
  width,
}: {
  altText: string;
  blobContentType: string;
  blobDownloadUrl: string | null;
  blobPathname: string;
  blobSize: number;
  blobUrl: string;
  height: number | null;
  key: string;
  width: number | null;
}) {
  const rows = (await sql`
    INSERT INTO site_images (
      key,
      blob_url,
      blob_download_url,
      blob_pathname,
      blob_content_type,
      blob_size,
      width,
      height,
      alt_text
    )
    VALUES (
      ${key},
      ${blobUrl},
      ${blobDownloadUrl},
      ${blobPathname},
      ${blobContentType},
      ${blobSize},
      ${width},
      ${height},
      ${altText}
    )
    ON CONFLICT (key) DO UPDATE
      SET blob_url = EXCLUDED.blob_url,
          blob_download_url = EXCLUDED.blob_download_url,
          blob_pathname = EXCLUDED.blob_pathname,
          blob_content_type = EXCLUDED.blob_content_type,
          blob_size = EXCLUDED.blob_size,
          width = EXCLUDED.width,
          height = EXCLUDED.height,
          alt_text = EXCLUDED.alt_text,
          updated_at = now()
    RETURNING
      key,
      blob_url,
      blob_download_url,
      blob_pathname,
      blob_content_type,
      blob_size,
      width,
      height,
      alt_text,
      created_at,
      updated_at
  `) as SiteImageRow[];

  return mapSiteImage(rows[0]);
}

export function upsertProfileImage(
  image: Omit<Parameters<typeof upsertSiteImage>[0], "key">,
) {
  return upsertSiteImage({
    ...image,
    key: PROFILE_IMAGE_KEY,
  });
}
