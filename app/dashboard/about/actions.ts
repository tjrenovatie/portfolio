"use server";

import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import {
  DASHBOARD_UNAUTHORIZED_MESSAGE,
  isDashboardAuthenticated,
} from "@/lib/auth";
import { getProfileImageBlobPath } from "@/lib/blob-paths";
import {
  convertImageFileToAvif,
  MAX_THUMBNAIL_IMAGE_SIZE,
  validateUploadImage,
} from "@/lib/image-processing";
import { upsertProfileImage } from "@/lib/site-images";

export type UploadProfileImageState = {
  fieldErrors?: {
    image?: string;
  };
  imageUrl?: string;
  message?: string;
  status: "idle" | "error" | "success";
};

function getImageFile(formData: FormData) {
  const value = formData.get("image");

  return value instanceof File ? value : null;
}

export async function uploadProfileImageAction(
  _previousState: UploadProfileImageState,
  formData: FormData,
): Promise<UploadProfileImageState> {
  if (!(await isDashboardAuthenticated())) {
    return {
      message: DASHBOARD_UNAUTHORIZED_MESSAGE,
      status: "error",
    };
  }

  const image = getImageFile(formData);
  const imageError = validateUploadImage(image, {
    maxSize: MAX_THUMBNAIL_IMAGE_SIZE,
    requiredMessage: "Profile image is required.",
  });

  if (imageError) {
    return {
      fieldErrors: {
        image: imageError,
      },
      message: "Select a valid profile image.",
      status: "error",
    };
  }

  if (!image) {
    return {
      fieldErrors: {
        image: "Profile image is required.",
      },
      message: "Select a valid profile image.",
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

  const blobPathname = getProfileImageBlobPath();

  try {
    const profileImage = await convertImageFileToAvif(image, blobPathname);
    const blob = await put(blobPathname, profileImage.buffer, {
      access: "public",
      allowOverwrite: true,
      contentType: profileImage.contentType,
      token,
    });
    const savedImage = await upsertProfileImage({
      altText: image.name,
      blobContentType: blob.contentType ?? "image/avif",
      blobDownloadUrl: blob.downloadUrl ?? null,
      blobPathname: blob.pathname,
      blobSize: profileImage.outputSize,
      blobUrl: blob.url,
      height: profileImage.height,
      width: profileImage.width,
    });

    revalidatePath("/about");
    revalidatePath("/dashboard/about");

    return {
      imageUrl: savedImage.blobUrl,
      message: "Profile image uploaded.",
      status: "success",
    };
  } catch (error) {
    try {
      await del(blobPathname, { token });
    } catch (cleanupError) {
      console.error("Failed to clean up profile image blob:", cleanupError);
    }

    console.error("Profile image upload error:", error);

    return {
      message: "Could not upload the profile image.",
      status: "error",
    };
  }
}
