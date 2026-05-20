"use server";

import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import {
  createProjectRecord,
  createProjectThumbnailRecord,
  deleteProjectRecord,
  projectSlugExists,
} from "@/lib/db-projects";

const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export type CreateProjectState = {
  fieldErrors?: {
    description?: string;
    name?: string;
    thumbnail?: string;
  };
  message?: string;
  status: "idle" | "error" | "success";
};

export const initialCreateProjectState: CreateProjectState = {
  status: "idle",
};

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getFileField(formData: FormData, key: string) {
  const value = formData.get(key);

  return value instanceof File ? value : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function createUniqueSlug(name: string) {
  const baseSlug = slugify(name) || "project";
  let slug = baseSlug;
  let suffix = 2;

  while (await projectSlugExists(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function validateProjectInput({
  description,
  name,
  thumbnail,
}: {
  description: string;
  name: string;
  thumbnail: File | null;
}) {
  const fieldErrors: CreateProjectState["fieldErrors"] = {};

  if (!name) {
    fieldErrors.name = "Project name is required.";
  } else if (name.length > 120) {
    fieldErrors.name = "Project name must be 120 characters or fewer.";
  }

  if (!description) {
    fieldErrors.description = "Description is required.";
  } else if (description.length > 2000) {
    fieldErrors.description = "Description must be 2000 characters or fewer.";
  }

  if (!thumbnail || thumbnail.size === 0) {
    fieldErrors.thumbnail = "Thumbnail image is required.";
  } else if (!ALLOWED_IMAGE_TYPES.has(thumbnail.type)) {
    fieldErrors.thumbnail = "Use an AVIF, JPG, PNG, or WebP image.";
  } else if (thumbnail.size > MAX_THUMBNAIL_SIZE) {
    fieldErrors.thumbnail = "Thumbnail must be 10 MB or smaller.";
  }

  return fieldErrors;
}

export async function createProjectAction(
  _previousState: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  const name = getStringField(formData, "name");
  const description = getStringField(formData, "description");
  const thumbnail = getFileField(formData, "thumbnail");
  const fieldErrors = validateProjectInput({ description, name, thumbnail });

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Check the project details and try again.",
      status: "error",
    };
  }

  if (!thumbnail) {
    return {
      fieldErrors: { thumbnail: "Thumbnail image is required." },
      message: "Check the project details and try again.",
      status: "error",
    };
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    return {
      message: "BLOB_READ_WRITE_TOKEN is not configured.",
      status: "error",
    };
  }

  let blobPathname: string | null = null;
  let projectId: string | null = null;

  try {
    const inputBuffer = Buffer.from(await thumbnail.arrayBuffer());
    const { data: avifBuffer, info } = await sharp(inputBuffer)
      .rotate()
      .avif({ quality: 72 })
      .toBuffer({ resolveWithObject: true });

    const slug = await createUniqueSlug(name);
    const project = await createProjectRecord({ description, name, slug });
    projectId = project.id;
    blobPathname = `projects/${project.id}/thumbnail.avif`;

    const blob = await put(blobPathname, avifBuffer, {
      access: "public",
      allowOverwrite: true,
      contentType: "image/avif",
      token,
    });

    await createProjectThumbnailRecord({
      altText: name,
      blobContentType: blob.contentType ?? "image/avif",
      blobDownloadUrl: blob.downloadUrl ?? null,
      blobPathname: blob.pathname,
      blobSize: avifBuffer.byteLength,
      blobUrl: blob.url,
      height: info.height ?? null,
      projectId: project.id,
      width: info.width ?? null,
    });

    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");

    return {
      message: "Project created.",
      status: "success",
    };
  } catch (error) {
    if (blobPathname) {
      try {
        await del(blobPathname, { token });
      } catch (cleanupError) {
        console.error("Failed to clean up thumbnail blob:", cleanupError);
      }
    }

    if (projectId) {
      try {
        await deleteProjectRecord(projectId);
      } catch (cleanupError) {
        console.error("Failed to clean up project row:", cleanupError);
      }
    }

    console.error("Create project error:", error);

    return {
      message: "Could not create the project. Try again later.",
      status: "error",
    };
  }
}
