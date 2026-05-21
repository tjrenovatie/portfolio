"use client";

import { PhotoIcon } from "@heroicons/react/24/outline";
import { useActionState, useMemo, useState } from "react";
import {
  DashboardButton,
  DashboardFileInput,
} from "@/components/dashboard";
import {
  convertGalleryImagesAction,
  type ConvertGalleryImagesState,
} from "./actions";

const initialConvertGalleryImagesState: ConvertGalleryImagesState = {
  status: "idle",
};

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
  const [state, formAction, isPending] = useActionState(
    convertGalleryImagesAction.bind(null, projectId),
    initialConvertGalleryImagesState,
  );
  const invalidCount = useMemo(
    () => selectedImages.filter((image) => image.errors.length > 0).length,
    [selectedImages],
  );
  const hasImages = selectedImages.length > 0;
  const hasErrors = invalidCount > 0;

  return (
    <form action={formAction} className="space-y-6">
      <DashboardFileInput
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
              const isValid = image.errors.length === 0;

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
                        {image.errors.map((error) => (
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
                    className={`w-fit rounded-md px-3 py-1 text-sm font-semibold ${
                      isValid
                        ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-200"
                        : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200"
                    }`}
                  >
                    {isValid ? "Ready" : "Invalid"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {state.message && (
        <section
          className={`rounded-md border px-5 py-4 text-sm font-semibold ${
            state.status === "success"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {state.message}
        </section>
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
          disabled={!hasImages || hasErrors || isPending}
          className="min-h-11 w-full px-5 sm:w-auto"
          variant={!hasImages || hasErrors || isPending ? "disabled" : "primary"}
        >
          {isPending ? "Uploading..." : "Upload images"}
        </DashboardButton>
        <p className="mt-3 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          Images are converted to AVIF, uploaded to Vercel Blob, and saved in
          Neon Postgres.
        </p>
        {hasErrors && (
          <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">
            Fix {invalidCount} invalid file{invalidCount === 1 ? "" : "s"}{" "}
            before uploading.
          </p>
        )}
      </div>
    </form>
  );
}
