function normalizePathSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-/_]+/g, "-")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/{2,}/g, "/");
}

export function getBlobEnvironmentPrefix() {
  const explicitPrefix = process.env.BLOB_ENV_PREFIX;

  if (explicitPrefix) {
    return normalizePathSegment(explicitPrefix);
  }

  const vercelEnvironment = process.env.VERCEL_ENV;

  if (vercelEnvironment === "production") {
    return "production";
  }

  if (vercelEnvironment === "preview") {
    return "preview";
  }

  return process.env.NODE_ENV === "production" ? "production" : "local";
}

export function getProjectBlobBasePath(projectId: string) {
  return `${getBlobEnvironmentPrefix()}/projects/${projectId}`;
}

export function getProjectThumbnailBlobPath(projectId: string) {
  return `${getProjectBlobBasePath(projectId)}/thumbnail.avif`;
}

export function getProjectGalleryBlobPath({
  fileName,
  index,
  projectId,
}: {
  fileName: string;
  index: number;
  projectId: string;
}) {
  const paddedIndex = String(index + 1).padStart(2, "0");

  return `${getProjectBlobBasePath(projectId)}/images/${paddedIndex}-${fileName}.avif`;
}

export function getProfileImageBlobPath() {
  return `${getBlobEnvironmentPrefix()}/profile/profile-image.avif`;
}
