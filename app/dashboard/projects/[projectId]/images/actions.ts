"use server";

import { getDashboardProject } from "@/lib/db-projects";
import {
  convertImageFileToAvif,
  MAX_GALLERY_IMAGE_SIZE,
  normalizeImageFileName,
  validateUploadImage,
  type ConvertedAvifImage,
} from "@/lib/image-processing";

const MAX_GALLERY_FILES = 20;

export type ConvertGalleryImagesState = {
  convertedImages?: Array<
    Omit<ConvertedAvifImage, "buffer"> & {
      bufferBytes: number;
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

export const initialConvertGalleryImagesState: ConvertGalleryImagesState = {
  status: "idle",
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
  const paddedIndex = String(index + 1).padStart(2, "0");

  return `projects/${projectId}/images/${paddedIndex}-${normalizedName}.avif`;
}

export async function convertGalleryImagesAction(
  projectId: string,
  _previousState: ConvertGalleryImagesState,
  formData: FormData,
): Promise<ConvertGalleryImagesState> {
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

  try {
    const convertedImages = await Promise.all(
      files.map(async (file, index) => {
        const convertedImage = await convertImageFileToAvif(
          file,
          buildGalleryImagePathname({ file, index, projectId }),
        );

        return {
          contentType: convertedImage.contentType,
          height: convertedImage.height,
          originalName: convertedImage.originalName,
          outputSize: convertedImage.outputSize,
          pathname: convertedImage.pathname,
          width: convertedImage.width,
          bufferBytes: convertedImage.buffer.byteLength,
        };
      }),
    );

    return {
      convertedImages,
      message: `${convertedImages.length} image${
        convertedImages.length === 1 ? "" : "s"
      } converted to AVIF. Blob upload and database storage are next.`,
      status: "success",
    };
  } catch (error) {
    console.error("Gallery image conversion error:", error);

    return {
      message: "Could not convert the selected images.",
      status: "error",
    };
  }
}
