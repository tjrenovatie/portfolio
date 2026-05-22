"use client";

import { PhotoIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import {
  DashboardButton,
  DashboardFileInput,
  DashboardStatusMessage,
} from "@/components/dashboard";
import {
  convertGalleryImagesAction,
  type ConvertGalleryImagesState,
} from "./actions";

const initialConvertGalleryImagesState: ConvertGalleryImagesState = {
  status: "idle",
};

const MAX_GALLERY_FILES = 20;
const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type SelectedImage = {
  errors: string[];
  file: File;
};

type SelectedImageStatus = "invalid" | "ready" | "uploaded" | "uploading";

function formatBytes(bytes: number) {
  const megabytes = bytes / 1024 / 1024;

  return `${megabytes.toFixed(1)} MB`;
}

function validateImage(file: File) {
  const errors: string[] = [];

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    errors.push("Unsupported file type.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    errors.push("File must be 15 MB or smaller.");
  }

  return errors;
}

export default function ImageUploadForm({ projectId }: { projectId: string }) {
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    convertGalleryImagesAction.bind(null, projectId),
    initialConvertGalleryImagesState,
  );
  const invalidCount = useMemo(
    () => selectedImages.filter((image) => image.errors.length > 0).length,
    [selectedImages],
  );
  const uploadedImageNames = useMemo(
    () =>
      new Set(
        (state.status === "success" ? state.convertedImages ?? [] : []).map(
          (image) => image.originalName,
        ),
      ),
    [state.convertedImages, state.status],
  );
  const hasImages = selectedImages.length > 0;
  const hasTooManyImages = selectedImages.length > MAX_GALLERY_FILES;
  const hasErrors = invalidCount > 0 || hasTooManyImages;
  const hasUploadedSelection =
    state.status === "success" &&
    hasImages &&
    selectedImages.every((image) => uploadedImageNames.has(image.file.name));

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    router.refresh();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [router, state.status]);

  function getSelectedImageStatus(image: SelectedImage): SelectedImageStatus {
    if (image.errors.length > 0 || hasTooManyImages) {
      return "invalid";
    }

    if (isPending) {
      return "uploading";
    }

    if (uploadedImageNames.has(image.file.name)) {
      return "uploaded";
    }

    return "ready";
  }

  function getStatusClasses(status: SelectedImageStatus) {
    if (status === "invalid") {
      return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200";
    }

    if (status === "uploaded") {
      return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200";
    }

    if (status === "uploading") {
      return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200";
    }

    return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-200";
  }

  function getStatusLabel(status: SelectedImageStatus) {
    if (status === "invalid") {
      return "Invalid";
    }

    if (status === "uploaded") {
      return "Uploaded";
    }

    if (status === "uploading") {
      return "Uploading";
    }

    return "Ready";
  }

  return (
    <form action={formAction} className="space-y-6">
      <DashboardFileInput
        ref={fileInputRef}
        id="project-gallery-images"
        name="images"
        accept="image/avif,image/jpeg,image/png,image/webp"
        helperText="Select one or more JPG, PNG, WebP, or AVIF images. Each file must be 15 MB or smaller."
        icon={
          <PhotoIcon
            className="h-10 w-10 text-neutral-400 dark:text-neutral-500"
            aria-hidden="true"
          />
        }
        label="Gallery images"
        multiple
        error={state.fieldErrors?.images}
        title="Select project images"
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? []);

          setSelectedImages(
            files.map((file) => ({
              errors: validateImage(file),
              file,
            })),
          );
        }}
      />

      {isPending && (
        <section
          className="rounded-md border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-amber-800 dark:text-amber-200">
              Uploading {selectedImages.length} image
              {selectedImages.length === 1 ? "" : "s"}
            </p>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
              Converting to AVIF
            </p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-amber-100 dark:bg-amber-900">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-amber-500" />
          </div>
        </section>
      )}

      {hasImages && (
        <section className="rounded-md border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <h3 className="text-base font-bold text-neutral-950 dark:text-white">
              Selected images
            </h3>
            <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
              {selectedImages.length} selected
            </span>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {selectedImages.map((image) => {
              const status = getSelectedImageStatus(image);
              const isValid = image.errors.length === 0 && !hasTooManyImages;

              return (
                <div
                  key={`${image.file.name}-${image.file.lastModified}`}
                  className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-950 dark:text-white">
                      {image.file.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                      {image.file.type || "Unknown type"} ·{" "}
                      {formatBytes(image.file.size)}
                    </p>
                    {!isValid && (
                      <ul className="mt-2 space-y-1">
                        {[
                          ...image.errors,
                          ...(hasTooManyImages
                            ? [
                                `Select ${MAX_GALLERY_FILES} images or fewer.`,
                              ]
                            : []),
                        ].map((error) => (
                          <li
                            key={error}
                            className="text-sm font-semibold text-red-600 dark:text-red-400"
                          >
                            {error}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <span
                    className={`w-fit rounded-md px-3 py-1 text-sm font-semibold ${getStatusClasses(
                      status,
                    )}`}
                  >
                    {getStatusLabel(status)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {state.message && (
        <DashboardStatusMessage
          className="px-5 py-4"
          status={state.status === "success" ? "success" : "error"}
        >
          {state.message}
        </DashboardStatusMessage>
      )}

      {state.fileErrors && state.fileErrors.length > 0 && (
        <section className="rounded-md border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950">
          <h3 className="text-sm font-bold text-red-800 dark:text-red-200">
            File validation errors
          </h3>
          <div className="mt-3 space-y-3">
            {state.fileErrors.map((fileError) => (
              <div key={fileError.name}>
                <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                  {fileError.name}
                </p>
                <ul className="mt-1 space-y-1">
                  {fileError.errors.map((error) => (
                    <li
                      key={error}
                      className="text-sm text-red-700 dark:text-red-300"
                    >
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {state.convertedImages && state.convertedImages.length > 0 && (
        <section className="rounded-md border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
            <h3 className="text-base font-bold text-neutral-950 dark:text-white">
              Uploaded images
            </h3>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {state.convertedImages.map((image) => (
              <div key={image.pathname} className="px-5 py-4">
                <p className="text-sm font-semibold text-neutral-950 dark:text-white">
                  {image.originalName}
                </p>
                <p className="mt-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {image.pathname}
                </p>
                {image.blobUrl && (
                  <p className="mt-1 break-all text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    {image.blobUrl}
                  </p>
                )}
                <p className="mt-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {image.width ?? "Unknown"} x {image.height ?? "Unknown"} ·{" "}
                  {formatBytes(image.outputSize)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="rounded-md border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <DashboardButton
          type="submit"
          disabled={!hasImages || hasErrors || hasUploadedSelection || isPending}
          className="min-h-11 w-full px-5 sm:w-auto"
          variant={
            !hasImages || hasErrors || hasUploadedSelection || isPending
              ? "disabled"
              : "primary"
          }
        >
          {isPending
            ? "Uploading..."
            : hasUploadedSelection
              ? "Select new images"
              : "Upload images"}
        </DashboardButton>
        <p className="mt-3 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          Images are converted to AVIF, uploaded to Vercel Blob, and saved in
          Neon Postgres.
        </p>
        {hasErrors && (
          <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">
            {hasTooManyImages
              ? `Select ${MAX_GALLERY_FILES} images or fewer before uploading.`
              : `Fix ${invalidCount} invalid file${
                  invalidCount === 1 ? "" : "s"
                } before uploading.`}
          </p>
        )}
      </div>
    </form>
  );
}
