"use server";

import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import {
  DASHBOARD_UNAUTHORIZED_MESSAGE,
  isDashboardAuthenticated,
} from "@/lib/auth";
import {
  createGalleryImageRecords,
  getDashboardProject,
  getNextGalleryImageSortOrder,
  reorderGalleryImage,
} from "@/lib/db-projects";
import {
  convertImageFileToAvif,
  MAX_GALLERY_IMAGE_SIZE,
  normalizeImageFileName,
  validateUploadImage,
  type ConvertedAvifImage,
} from "@/lib/image-processing";
import { getProjectGalleryBlobPath } from "@/lib/blob-paths";

const MAX_GALLERY_FILES = 20;

export type ConvertGalleryImagesState = {
  convertedImages?: Array<
    Omit<ConvertedAvifImage, "buffer"> & {
      bufferBytes: number;
      blobUrl?: string;
    }
  >;
  fieldErrors?: {
    images?: string;
  };
  fileErrors?: Array<{
    errors: string[];
    name: string;
  }>;
  message?: string;
  status: "idle" | "error" | "success";
};

export type ReorderGalleryImageState = {
  message?: string;
  status: "error" | "success";
};

function getImageFiles(formData: FormData) {
  return formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function buildGalleryImagePathname({
  file,
  index,
  projectId,
}: {
  file: File;
  index: number;
  projectId: string;
}) {
  const normalizedName = normalizeImageFileName(file.name);

  return getProjectGalleryBlobPath({
    fileName: normalizedName,
    index,
    projectId,
  });
}

export async function convertGalleryImagesAction(
  projectId: string,
  _previousState: ConvertGalleryImagesState,
  formData: FormData,
): Promise<ConvertGalleryImagesState> {
  if (!(await isDashboardAuthenticated())) {
    return {
      message: DASHBOARD_UNAUTHORIZED_MESSAGE,
      status: "error",
    };
  }

  const project = await getDashboardProject(projectId);

  if (!project) {
    return {
      message: "Project not found.",
      status: "error",
    };
  }

  const files = getImageFiles(formData);

  if (files.length === 0) {
    return {
      fieldErrors: {
        images: "Select at least one image.",
      },
      message: "Select images and try again.",
      status: "error",
    };
  }

  if (files.length > MAX_GALLERY_FILES) {
    return {
      fieldErrors: {
        images: `Select ${MAX_GALLERY_FILES} images or fewer.`,
      },
      message: "Too many images selected.",
      status: "error",
    };
  }

  const fileErrors = files
    .map((file) => ({
      errors: [
        validateUploadImage(file, {
          maxSize: MAX_GALLERY_IMAGE_SIZE,
          requiredMessage: "Image file is required.",
        }),
      ].filter((error): error is string => Boolean(error)),
      name: file.name,
    }))
    .filter((fileError) => fileError.errors.length > 0);

  if (fileErrors.length > 0) {
    return {
      fileErrors,
      message: "Fix invalid files and try again.",
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

  try {
    const nextSortOrder = await getNextGalleryImageSortOrder(projectId);
    const convertedImages = await Promise.all(
      files.map((file, index) =>
        convertImageFileToAvif(
          file,
          buildGalleryImagePathname({ file, index, projectId }),
        ),
      ),
    );
    const uploadedPathnames: string[] = [];

    try {
      const uploadedImages = [];

      for (let index = 0; index < convertedImages.length; index += 1) {
        const convertedImage = convertedImages[index];
        const blob = await put(convertedImage.pathname, convertedImage.buffer, {
          access: "public",
          allowOverwrite: true,
          contentType: convertedImage.contentType,
          token,
        });

        uploadedPathnames.push(blob.pathname);
        uploadedImages.push({
          altText: convertedImage.originalName,
          blobContentType: blob.contentType ?? "image/avif",
          blobDownloadUrl: blob.downloadUrl ?? null,
          blobPathname: blob.pathname,
          blobSize: convertedImage.outputSize,
          blobUrl: blob.url,
          height: convertedImage.height,
          sortOrder: nextSortOrder + index,
          width: convertedImage.width,
        });
      }

      const createdImages = await createGalleryImageRecords({
        images: uploadedImages,
        projectId,
      });

      revalidatePath("/dashboard/projects");
      revalidatePath(`/dashboard/projects/${projectId}/images`);
      revalidatePath("/projects");
      revalidatePath("/api/projects");

      return {
        convertedImages: convertedImages.map((convertedImage, index) => ({
          contentType: convertedImage.contentType,
          height: convertedImage.height,
          originalName: convertedImage.originalName,
          outputSize: convertedImage.outputSize,
          pathname: convertedImage.pathname,
          width: convertedImage.width,
          bufferBytes: convertedImage.buffer.byteLength,
          blobUrl: createdImages[index]?.blobUrl,
        })),
        message: `${createdImages.length} image${
          createdImages.length === 1 ? "" : "s"
        } converted, uploaded, and saved.`,
        status: "success",
      };
    } catch (error) {
      await Promise.allSettled(
        uploadedPathnames.map((pathname) => del(pathname, { token })),
      );

      throw error;
    }
  } catch (error) {
    console.error("Gallery image upload error:", error);

    return {
      message: "Could not upload the selected images.",
      status: "error",
    };
  }
}

export async function reorderGalleryImageAction(
  projectId: string,
  imageId: string,
  direction: "down" | "up",
): Promise<ReorderGalleryImageState> {
  if (!(await isDashboardAuthenticated())) {
    return {
      message: DASHBOARD_UNAUTHORIZED_MESSAGE,
      status: "error",
    };
  }

  const project = await getDashboardProject(projectId);

  if (!project) {
    return {
      message: "Project not found.",
      status: "error",
    };
  }

  try {
    const didReorder = await reorderGalleryImage({
      direction,
      imageId,
      projectId,
    });

    if (!didReorder) {
      return {
        message: "Image could not be moved.",
        status: "error",
      };
    }

    revalidatePath(`/dashboard/projects/${projectId}/images`);
    revalidatePath("/projects");
    revalidatePath("/api/projects");

    return {
      message: "Image order updated.",
      status: "success",
    };
  } catch (error) {
    console.error("Reorder gallery image error:", error);

    return {
      message: "Could not update the image order. Try again later.",
      status: "error",
    };
  }
}
