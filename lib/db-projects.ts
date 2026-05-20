import {
  sql,
  type ProjectImageRecord,
  type ProjectRecord,
  type PublicProject,
} from "@/lib/db";

type ProjectRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail_image_id: string | null;
  thumbnail_url: string | null;
  thumbnail_pathname: string | null;
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
  blob_size: number | string | null;
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
    thumbnailUrl: row.thumbnail_url,
    thumbnailPathname: row.thumbnail_pathname,
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
    blobSize: row.blob_size === null ? null : Number(row.blob_size),
    width: row.width,
    height: row.height,
    altText: row.alt_text,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

type ProjectWithImagesRow = ProjectRow & {
  image_alt_text: string | null;
  image_blob_content_type: string | null;
  image_blob_download_url: string | null;
  image_blob_pathname: string | null;
  image_blob_size: number | string | null;
  image_blob_url: string | null;
  image_created_at: Date | null;
  image_height: number | null;
  image_id: string | null;
  image_role: ProjectImageRecord["role"] | null;
  image_sort_order: number | null;
  image_width: number | null;
};

function mapPublicProjectImage(
  row: ProjectWithImagesRow,
): PublicProject["images"][number] | null {
  if (!row.image_id || !row.image_blob_url || !row.image_blob_pathname) {
    return null;
  }

  return {
    id: row.image_id,
    role: row.image_role ?? "gallery",
    blobUrl: row.image_blob_url,
    blobDownloadUrl: row.image_blob_download_url,
    blobPathname: row.image_blob_pathname,
    blobContentType: row.image_blob_content_type ?? "image/avif",
    blobSize:
      row.image_blob_size === null ? null : Number(row.image_blob_size),
    width: row.image_width,
    height: row.image_height,
    altText: row.image_alt_text,
    sortOrder: row.image_sort_order ?? 0,
    createdAt: row.image_created_at ?? new Date(),
  };
}

export async function getDashboardProjects() {
  const rows = (await sql`
    SELECT
      projects.id,
      projects.name,
      projects.slug,
      projects.description,
      projects.thumbnail_image_id,
      project_images.blob_url AS thumbnail_url,
      project_images.blob_pathname AS thumbnail_pathname,
      projects.created_at,
      projects.updated_at
    FROM projects
    LEFT JOIN project_images
      ON project_images.id = projects.thumbnail_image_id
    ORDER BY projects.created_at DESC
  `) as ProjectRow[];

  return rows.map(mapProject);
}

export async function getDashboardProject(projectId: string) {
  const rows = (await sql`
    SELECT
      projects.id,
      projects.name,
      projects.slug,
      projects.description,
      projects.thumbnail_image_id,
      project_images.blob_url AS thumbnail_url,
      project_images.blob_pathname AS thumbnail_pathname,
      projects.created_at,
      projects.updated_at
    FROM projects
    LEFT JOIN project_images
      ON project_images.id = projects.thumbnail_image_id
    WHERE projects.id = ${projectId}
    LIMIT 1
  `) as ProjectRow[];

  return rows[0] ? mapProject(rows[0]) : null;
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

export async function getPublicProjects() {
  const rows = (await sql`
    SELECT
      projects.id,
      projects.name,
      projects.slug,
      projects.description,
      projects.thumbnail_image_id,
      thumbnail.blob_url AS thumbnail_url,
      thumbnail.blob_pathname AS thumbnail_pathname,
      projects.created_at,
      projects.updated_at,
      project_images.id AS image_id,
      project_images.role AS image_role,
      project_images.blob_url AS image_blob_url,
      project_images.blob_download_url AS image_blob_download_url,
      project_images.blob_pathname AS image_blob_pathname,
      project_images.blob_content_type AS image_blob_content_type,
      project_images.blob_size AS image_blob_size,
      project_images.width AS image_width,
      project_images.height AS image_height,
      project_images.alt_text AS image_alt_text,
      project_images.sort_order AS image_sort_order,
      project_images.created_at AS image_created_at
    FROM projects
    LEFT JOIN project_images AS thumbnail
      ON thumbnail.id = projects.thumbnail_image_id
    LEFT JOIN project_images
      ON project_images.project_id = projects.id
    ORDER BY projects.created_at DESC, project_images.sort_order ASC, project_images.created_at ASC
  `) as ProjectWithImagesRow[];

  const projectsById = new Map<string, PublicProject>();

  rows.forEach((row) => {
    const existingProject = projectsById.get(row.id);
    const project =
      existingProject ??
      ({
        ...mapProject(row),
        images: [],
        imageUrls: [],
        thumbnail: null,
      } satisfies PublicProject);

    const image = mapPublicProjectImage(row);

    if (image) {
      project.images.push(image);
      project.imageUrls.push(image.blobUrl);

      if (image.id === project.thumbnailImageId) {
        project.thumbnail = image;
      }
    }

    projectsById.set(project.id, project);
  });

  return Array.from(projectsById.values());
}

export async function projectSlugExists(slug: string) {
  const rows = (await sql`
    SELECT 1
    FROM projects
    WHERE slug = ${slug}
    LIMIT 1
  `) as { "?column?": number }[];

  return rows.length > 0;
}

export async function createProjectRecord({
  description,
  name,
  slug,
}: {
  description: string;
  name: string;
  slug: string;
}) {
  const rows = (await sql`
    INSERT INTO projects (name, slug, description)
    VALUES (${name}, ${slug}, ${description})
    RETURNING
      id,
      name,
      slug,
      description,
      thumbnail_image_id,
      NULL AS thumbnail_url,
      NULL AS thumbnail_pathname,
      created_at,
      updated_at
  `) as ProjectRow[];

  return mapProject(rows[0]);
}

export async function deleteProjectRecord(projectId: string) {
  await sql`
    DELETE FROM projects
    WHERE id = ${projectId}
  `;
}

export async function createProjectThumbnailRecord({
  altText,
  blobContentType,
  blobDownloadUrl,
  blobPathname,
  blobSize,
  blobUrl,
  height,
  projectId,
  width,
}: {
  altText: string;
  blobContentType: string;
  blobDownloadUrl: string | null;
  blobPathname: string;
  blobSize: number;
  blobUrl: string;
  height: number | null;
  projectId: string;
  width: number | null;
}) {
  const rows = (await sql`
    INSERT INTO project_images (
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
      sort_order
    )
    VALUES (
      ${projectId},
      'thumbnail',
      ${blobUrl},
      ${blobDownloadUrl},
      ${blobPathname},
      ${blobContentType},
      ${blobSize},
      ${width},
      ${height},
      ${altText},
      0
    )
    RETURNING
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
  `) as ProjectImageRow[];

  const image = mapProjectImage(rows[0]);

  await sql`
    UPDATE projects
    SET thumbnail_image_id = ${image.id}
    WHERE id = ${projectId}
  `;

  return image;
}
