import type { ProjectImageRecord } from "@/lib/db";
import ReorderGalleryImageButtons from "./ReorderGalleryImageButtons";

type GalleryImageListProps = {
  images: ProjectImageRecord[];
  projectId: string;
};

function formatBytes(bytes: number | null) {
  if (bytes === null) {
    return "Unknown size";
  }

  const megabytes = bytes / 1024 / 1024;

  return `${megabytes.toFixed(1)} MB`;
}

export default function GalleryImageList({
  images,
  projectId,
}: GalleryImageListProps) {
  return (
    <section className="rounded-md border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
        <h3 className="text-base font-bold text-neutral-950 dark:text-white">
          Uploaded gallery
        </h3>
        <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
          {images.length} total
        </span>
      </div>

      {images.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm font-semibold text-neutral-950 dark:text-white">
            No gallery images yet
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Uploaded images will appear here and can be reordered for the
            public project gallery.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {images.map((image, index) => {
            const imageName = image.altText || image.blobPathname;

            return (
              <div
                key={image.id}
                className="grid gap-4 px-5 py-4 md:grid-cols-[5rem_1fr_auto] md:items-center"
              >
                <div className="h-20 w-20 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
                  {/* Blob URLs are stored outside Next image config. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.blobUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-neutral-950 dark:text-white">
                    {image.altText || "Gallery image"}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    Position {index + 1} · {image.width ?? "Unknown"} x{" "}
                    {image.height ?? "Unknown"} · {formatBytes(image.blobSize)}
                  </p>
                  <p className="mt-1 truncate text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    {image.blobPathname}
                  </p>
                </div>

                <div className="flex items-center gap-2 md:justify-end">
                  <ReorderGalleryImageButtons
                    imageId={image.id}
                    imageName={imageName}
                    isFirst={index === 0}
                    isLast={index === images.length - 1}
                    projectId={projectId}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
