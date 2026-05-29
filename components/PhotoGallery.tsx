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
  description?: string;
  title?: string;
};

type PhotoGalleryProps = {
  images: PhotoGalleryItem[];
};

type GalleryLayout = {
  columnCount: number;
  gapRatio: number;
};

type GalleryColumnItem = {
  displayAspectRatio: number;
  image: PhotoGalleryItem;
  index: number;
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

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [layout, setLayout] = useState<GalleryLayout>({
    columnCount: 2,
    gapRatio: 0,
  });
  const [direction, setDirection] = useState(0);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchStartRef = useRef<number | null>(null);
  const activeImage = activeIndex === null ? null : images[activeIndex];

  const columns = useMemo(() => {
    const nextColumns = Array.from({ length: layout.columnCount }, () => ({
      height: 0,
      items: [] as GalleryColumnItem[],
    }));

    images.forEach((image, index) => {
      const displayAspectRatio = getDisplayAspectRatio(index);
      const shortestColumn = nextColumns.reduce(
        (shortest, column, columnIndex) =>
          column.height < nextColumns[shortest].height ? columnIndex : shortest,
        0,
      );

      nextColumns[shortestColumn].items.push({
        displayAspectRatio,
        image,
        index,
      });
      nextColumns[shortestColumn].height +=
        1 / displayAspectRatio +
        (nextColumns[shortestColumn].items.length > 1 ? layout.gapRatio : 0);
    });

    const targetHeight = Math.max(...nextColumns.map((column) => column.height));

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
  }, [images, layout.columnCount, layout.gapRatio]);

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
    const trigger = activeIndex === null ? null : triggerRefs.current[activeIndex];
    setActiveIndex(null);
    window.setTimeout(() => trigger?.focus(), 0);
  }, [activeIndex]);

  const showPrevious = useCallback(() => {
    if (images.length < 2) return;
    setDirection(-1);
    setActiveIndex((index) => {
      const current = index ?? 0;

      return current === 0 ? images.length - 1 : current - 1;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    if (images.length < 2) return;
    setDirection(1);
    setActiveIndex((index) => {
      const current = index ?? 0;

      return current === images.length - 1 ? 0 : current + 1;
    });
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

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
  }, [activeIndex, closeLightbox, showNext, showPrevious]);

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

  if (images.length === 0) {
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
            {column.map(({ displayAspectRatio, image, index }) => (
            <motion.figure
              key={image.id}
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
                  setActiveIndex(index);
                }}
                className="group relative block w-full overflow-hidden rounded-[1.25rem] border border-white/70 bg-neutral-200 text-left shadow-[0_18px_45px_rgba(28,25,23,0.12)] outline-none ring-1 ring-black/[0.03] transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(28,25,23,0.22)] focus-visible:ring-2 focus-visible:ring-[--color-primary] focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-50"
                aria-label={`Open foto ${index + 1}: ${image.alt}`}
              >
                <span
                  className="relative block w-full overflow-hidden"
                  style={{ aspectRatio: `${displayAspectRatio} / 1` }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 23vw, (min-width: 768px) 31vw, 48vw"
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.055]"
                    loading="lazy"
                  />
                </span>
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-white/10 opacity-75 transition duration-500 group-hover:opacity-90" />
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/25 to-transparent opacity-60 transition duration-500 group-hover:opacity-80" />
                {image.title ? (
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5 sm:p-4">
                    <div className="rounded-xl border border-white/20 bg-black/45 px-2.5 py-2 text-white shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-md transition duration-500 group-hover:bg-black/55 sm:rounded-2xl sm:px-4 sm:py-2.5">
                      <span className="block max-w-full break-words text-[clamp(0.72rem,2.8vw,0.95rem)] font-semibold leading-snug tracking-[0.01em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
                        {image.title}
                      </span>
                    </div>
                  </figcaption>
                ) : null}
              </button>
            </motion.figure>
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeImage && activeIndex !== null ? (
          <motion.div
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/96 px-4 py-6 backdrop-blur-md sm:px-8"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeLightbox();
              }
            }}
            onTouchEnd={handleTouchEnd}
            onTouchStart={handleTouchStart}
            role="dialog"
          >
            <div className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white/80 shadow-lg backdrop-blur sm:left-6 sm:top-6">
              {activeIndex + 1} / {images.length}
            </div>

            <button
              type="button"
              onClick={closeLightbox}
              className="absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-white/10 p-3 text-white shadow-lg backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
              aria-label="Sluit galerij"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            {images.length > 1 ? (
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

            <AnimatePresence custom={direction} initial={false} mode="wait">
              <motion.div
                key={activeImage.id}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                className="relative h-[82vh] w-full max-w-7xl"
                custom={direction}
                exit={{
                  opacity: 0,
                  scale: 0.985,
                  x: direction < 0 ? 42 : direction > 0 ? -42 : 0,
                }}
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
            </AnimatePresence>

            {activeImage.title ? (
              <div className="absolute bottom-5 left-1/2 z-20 w-[calc(100vw-2rem)] max-w-[760px] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-center text-white/90 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-md sm:w-auto sm:min-w-72 sm:bg-white/10 sm:px-5">
                <p className="break-words text-[clamp(0.875rem,3vw,1rem)] font-semibold leading-snug text-white">
                  {activeImage.title}
                </p>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
