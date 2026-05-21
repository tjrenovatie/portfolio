"use server";

import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import {
  createProjectRecord,
  createProjectThumbnailRecord,
  deleteProjectRecord,
  getDashboardProject,
  getProjectImages,
  projectSlugExists,
} from "@/lib/db-projects";
import {
  convertImageFileToAvif,
  MAX_THUMBNAIL_IMAGE_SIZE,
  validateUploadImage,
} from "@/lib/image-processing";
import { getProjectThumbnailBlobPath } from "@/lib/blob-paths";

export type CreateProjectState = {
  fieldErrors?: {
    description?: string;
    name?: string;
    thumbnail?: string;
  };
  message?: string;
  status: "idle" | "error" | "success";
};

export type DeleteProjectState = {
  message?: string;
  status: "idle" | "error" | "success";
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

  const thumbnailError = validateUploadImage(thumbnail, {
    maxSize: MAX_THUMBNAIL_IMAGE_SIZE,
    requiredMessage: "Thumbnail image is required.",
  });

  if (thumbnailError) {
    fieldErrors.thumbnail = thumbnailError;
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
    const slug = await createUniqueSlug(name);
    const project = await createProjectRecord({ description, name, slug });
    projectId = project.id;
    blobPathname = getProjectThumbnailBlobPath(project.id);
    const thumbnailImage = await convertImageFileToAvif(
      thumbnail,
      blobPathname,
    );

    const blob = await put(blobPathname, thumbnailImage.buffer, {
      access: "public",
      allowOverwrite: true,
      contentType: thumbnailImage.contentType,
      token,
    });

    await createProjectThumbnailRecord({
      altText: name,
      blobContentType: blob.contentType ?? "image/avif",
      blobDownloadUrl: blob.downloadUrl ?? null,
      blobPathname: blob.pathname,
      blobSize: thumbnailImage.outputSize,
      blobUrl: blob.url,
      height: thumbnailImage.height,
      projectId: project.id,
      width: thumbnailImage.width,
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

export async function deleteProjectAction(
  projectId: string,
  _previousState: DeleteProjectState,
): Promise<DeleteProjectState> {
  const project = await getDashboardProject(projectId);

  if (!project) {
    return {
      message: "Project not found.",
      status: "error",
    };
  }

  const images = await getProjectImages(projectId);
  const blobPathnames = images.map((image) => image.blobPathname);
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (blobPathnames.length > 0 && !token) {
    return {
      message: "BLOB_READ_WRITE_TOKEN is not configured.",
      status: "error",
    };
  }

  try {
    if (token) {
      await Promise.all(
        blobPathnames.map((pathname) => del(pathname, { token })),
      );
    }

    await deleteProjectRecord(projectId);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    revalidatePath("/api/projects");

    return {
      message: "Project deleted.",
      status: "success",
    };
  } catch (error) {
    console.error("Delete project error:", error);

    return {
      message: "Could not delete the project. Try again later.",
      status: "error",
    };
  }
}
