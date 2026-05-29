"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

export type PhotoGalleryItem = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type PhotoGalleryProject = {
  id: string;
  title: string;
  images: PhotoGalleryItem[];
};

type PhotoGalleryProps = {
  projects: PhotoGalleryProject[];
};

type GalleryLayout = {
  columnCount: number;
  gapRatio: number;
};

type GalleryColumnItem = {
  displayAspectRatio: number;
  index: number;
  project: PhotoGalleryProject;
};

function getDisplayAspectRatio(index: number) {
  const variedAspect = 0.68 + (((index * 37) % 83) / 100);

  return Number(variedAspect.toFixed(2));
}

function getColumnCount(width: number) {
  if (width >= 1536) return 5;
  if (width >= 1280) return 4;
  if (width >= 768) return 3;

  return 2;
}

export default function PhotoGallery({ projects }: PhotoGalleryProps) {
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(
    null,
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [layout, setLayout] = useState<GalleryLayout>({
    columnCount: 2,
    gapRatio: 0,
  });
  const [direction, setDirection] = useState(0);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchStartRef = useRef<number | null>(null);

  const visibleProjects = useMemo(
    () => projects.filter((project) => project.images.length > 0),
    [projects],
  );
  const activeProject =
    activeProjectIndex === null ? null : visibleProjects[activeProjectIndex];
  const activeImages = activeProject?.images ?? [];
  const activeImage = activeImages[activeImageIndex] ?? null;

  const columns = useMemo(() => {
    const nextColumns = Array.from({ length: layout.columnCount }, () => ({
      height: 0,
      items: [] as GalleryColumnItem[],
    }));

    visibleProjects.forEach((project, index) => {
      const displayAspectRatio = getDisplayAspectRatio(index);
      const shortestColumn = nextColumns.reduce(
        (shortest, column, columnIndex) =>
          column.height < nextColumns[shortest].height ? columnIndex : shortest,
        0,
      );

      nextColumns[shortestColumn].items.push({
        displayAspectRatio,
        index,
        project,
      });
      nextColumns[shortestColumn].height +=
        1 / displayAspectRatio +
        (nextColumns[shortestColumn].items.length > 1 ? layout.gapRatio : 0);
    });

    const targetHeight = Math.max(0, ...nextColumns.map((column) => column.height));

    return nextColumns.map((column) => {
      if (column.items.length === 0 || column.height === targetHeight) {
        return column.items;
      }

      const items = [...column.items];
      const lastItem = items[items.length - 1];
      const lastHeight = 1 / lastItem.displayAspectRatio;
      const adjustedHeight = lastHeight + targetHeight - column.height;

      items[items.length - 1] = {
        ...lastItem,
        displayAspectRatio: Number((1 / adjustedHeight).toFixed(4)),
      };

      return items;
    });
  }, [layout.columnCount, layout.gapRatio, visibleProjects]);

  useEffect(() => {
    const updateLayout = () => {
      const columnCount = getColumnCount(window.innerWidth);
      const gallery = galleryRef.current;

      if (!gallery) {
        setLayout({ columnCount, gapRatio: 0 });
        return;
      }

      const styles = window.getComputedStyle(gallery);
      const columnGap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
      const columnWidth =
        (gallery.clientWidth - columnGap * (columnCount - 1)) / columnCount;

      setLayout({
        columnCount,
        gapRatio: columnWidth > 0 ? columnGap / columnWidth : 0,
      });
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);

    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const closeLightbox = useCallback(() => {
    const trigger =
      activeProjectIndex === null
        ? null
        : triggerRefs.current[activeProjectIndex];

    setActiveProjectIndex(null);
    setActiveImageIndex(0);
    window.setTimeout(() => trigger?.focus(), 0);
  }, [activeProjectIndex]);

  const showPrevious = useCallback(() => {
    if (activeImages.length < 2) return;

    setDirection(-1);
    setActiveImageIndex((index) =>
      index === 0 ? activeImages.length - 1 : index - 1,
    );
  }, [activeImages.length]);

  const showNext = useCallback(() => {
    if (activeImages.length < 2) return;

    setDirection(1);
    setActiveImageIndex((index) =>
      index === activeImages.length - 1 ? 0 : index + 1,
    );
  }, [activeImages.length]);

  useEffect(() => {
    if (!activeProject || !activeImage) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImage, activeProject, closeLightbox, showNext, showPrevious]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartRef.current === null) return;

    const distance = touchStartRef.current - event.changedTouches[0].clientX;
    touchStartRef.current = null;

    if (Math.abs(distance) < 48) return;

    if (distance > 0) {
      showNext();
    } else {
      showPrevious();
    }
  };

  if (visibleProjects.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-base font-semibold text-neutral-700">
          Er zijn nog geen portfoliofoto&apos;s beschikbaar.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={galleryRef}
        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      >
        {columns.map((column, columnIndex) => (
          <div
            key={columnIndex}
            className="flex h-full flex-col gap-3 sm:gap-4"
          >
            {column.map(({ displayAspectRatio, index, project }) => {
              const coverImage = project.images[0];

              return (
                <motion.figure
                  key={project.id}
                  initial={{ opacity: 0, y: 22 }}
                  transition={{
                    delay: (index % 8) * 0.035,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ amount: 0.2, once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="break-inside-avoid"
                >
                  <button
                    ref={(node) => {
                      triggerRefs.current[index] = node;
                    }}
                    type="button"
                    onClick={() => {
                      setDirection(0);
                      setActiveImageIndex(0);
                      setActiveProjectIndex(index);
                    }}
                    className="group relative block w-full overflow-hidden rounded-[1.25rem] border border-white/70 bg-neutral-200 text-left shadow-[0_18px_45px_rgba(28,25,23,0.12)] outline-none ring-1 ring-black/[0.03] transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(28,25,23,0.22)] focus-visible:ring-2 focus-visible:ring-[--color-primary] focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-50"
                    aria-label={`Open project ${project.title}`}
                  >
                    <span
                      className="relative block w-full overflow-hidden"
                      style={{ aspectRatio: `${displayAspectRatio} / 1` }}
                    >
                      <Image
                        src={coverImage.src}
                        alt={coverImage.alt}
                        fill
                        sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 23vw, (min-width: 768px) 31vw, 48vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.055]"
                        loading="lazy"
                      />
                    </span>
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-white/10 opacity-75 transition duration-500 group-hover:opacity-90" />
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/25 to-transparent opacity-60 transition duration-500 group-hover:opacity-80" />
                    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5 sm:p-4">
                      <div className="rounded-xl border border-white/20 bg-black/45 px-2.5 py-2 text-white shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-md transition duration-500 group-hover:bg-black/55 sm:rounded-2xl sm:px-4 sm:py-2.5">
                        <span className="block max-w-full break-words text-[clamp(0.72rem,2.8vw,0.95rem)] font-semibold leading-snug tracking-[0.01em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
                          {project.title}
                        </span>
                      </div>
                    </figcaption>
                  </button>
                </motion.figure>
              );
            })}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeProject && activeImage ? (
          <motion.div
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-neutral-950 px-4 py-6 sm:px-8"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeLightbox();
              }
            }}
            onTouchEnd={handleTouchEnd}
            onTouchStart={handleTouchStart}
            role="dialog"
          >
            <div className="pointer-events-none absolute inset-0">
              <Image
                src={activeImage.src}
                alt=""
                fill
                aria-hidden="true"
                sizes="100vw"
                className="scale-110 object-cover opacity-25 blur-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_48%)]" />
            </div>

            <div className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white/80 shadow-lg backdrop-blur sm:left-6 sm:top-6">
              {activeImageIndex + 1} / {activeImages.length}
            </div>

            <div className="absolute left-1/2 top-4 z-20 max-w-[min(58vw,640px)] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/45 px-4 py-2 text-center shadow-lg backdrop-blur-md sm:top-6">
              <p className="break-words text-sm font-semibold leading-snug text-white sm:text-base">
                {activeProject.title}
              </p>
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-white/10 p-3 text-white shadow-lg backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
              aria-label="Sluit galerij"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {activeImages.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white shadow-lg backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6"
                  aria-label="Vorige foto"
                >
                  <ChevronLeftIcon className="h-7 w-7" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white shadow-lg backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6"
                  aria-label="Volgende foto"
                >
                  <ChevronRightIcon className="h-7 w-7" aria-hidden="true" />
                </button>
              </>
            ) : null}

            <motion.div
              key={activeImage.id}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              className="relative h-[70vh] w-full max-w-7xl sm:h-[76vh] lg:h-[82vh]"
              initial={{
                opacity: 0,
                scale: 0.985,
                x: direction > 0 ? 42 : direction < 0 ? -42 : 0,
              }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                priority
                sizes="100vw"
                className="object-contain drop-shadow-[0_30px_90px_rgba(0,0,0,0.62)]"
              />
            </motion.div>

            <div className="absolute bottom-5 left-1/2 z-20 w-[calc(100vw-2rem)] max-w-4xl -translate-x-1/2 rounded-2xl border border-white/10 bg-black/45 p-2 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md">
              <div className="flex gap-2 overflow-x-auto p-1">
                {activeImages.map((projectImage, projectImageIndex) => {
                  const isActive = projectImageIndex === activeImageIndex;

                  return (
                    <button
                      key={projectImage.id}
                      type="button"
                      onClick={() => {
                        setDirection(projectImageIndex > activeImageIndex ? 1 : -1);
                        setActiveImageIndex(projectImageIndex);
                      }}
                      className={`relative h-14 w-20 flex-none overflow-hidden rounded-xl border transition sm:h-16 sm:w-24 ${
                        isActive
                          ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)]"
                          : "border-white/15 opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`Bekijk foto ${projectImageIndex + 1} van ${activeProject.title}`}
                    >
                      <Image
                        src={projectImage.src}
                        alt={projectImage.alt}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
