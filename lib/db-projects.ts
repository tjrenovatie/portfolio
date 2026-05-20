import { sql, type ProjectImageRecord, type ProjectRecord } from "@/lib/db";

type ProjectRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail_image_id: string | null;
  created_at: Date;
  updated_at: Date;
};

type ProjectImageRow = {
  id: string;
  project_id: string;
  role: ProjectImageRecord["role"];
  blob_url: string;
  blob_download_url: string | null;
  blob_pathname: string;
  blob_content_type: string;
  blob_size: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  sort_order: number;
  created_at: Date;
};

function mapProject(row: ProjectRow): ProjectRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    thumbnailImageId: row.thumbnail_image_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProjectImage(row: ProjectImageRow): ProjectImageRecord {
  return {
    id: row.id,
    projectId: row.project_id,
    role: row.role,
    blobUrl: row.blob_url,
    blobDownloadUrl: row.blob_download_url,
    blobPathname: row.blob_pathname,
    blobContentType: row.blob_content_type,
    blobSize: row.blob_size,
    width: row.width,
    height: row.height,
    altText: row.alt_text,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export async function getDashboardProjects() {
  const rows = (await sql`
    SELECT
      id,
      name,
      slug,
      description,
      thumbnail_image_id,
      created_at,
      updated_at
    FROM projects
    ORDER BY created_at DESC
  `) as ProjectRow[];

  return rows.map(mapProject);
}

export async function getProjectImages(projectId: string) {
  const rows = (await sql`
    SELECT
      id,
      project_id,
      role,
      blob_url,
      blob_download_url,
      blob_pathname,
      blob_content_type,
      blob_size,
      width,
      height,
      alt_text,
      sort_order,
      created_at
    FROM project_images
    WHERE project_id = ${projectId}
    ORDER BY sort_order ASC, created_at ASC
  `) as ProjectImageRow[];

  return rows.map(mapProjectImage);
}
