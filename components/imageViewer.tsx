// components/ImageViewer.tsx
"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  TouchEvent,
} from "react";
import Image from "next/image";
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Project } from "@/lib/projects";
import { useProjectImages } from "@/hooks/useProjectImages";
import { motion, AnimatePresence } from "framer-motion";

interface ImageViewerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageViewer({
  project,
  isOpen,
  onClose,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState(0);
  const directImages = useMemo(
    () => (project?.imageUrls ?? []).filter((src) => src.trim().length > 0),
    [project?.imageUrls],
  );
  const shouldFetchBlobImages = directImages.length === 0;
  const { images: fetchedImages, loading } = useProjectImages(
    shouldFetchBlobImages ? project?.blobPrefix ?? null : null,
  );
  const images = useMemo(
    () =>
      (directImages.length > 0 ? directImages : fetchedImages).filter(
        (src) => src.trim().length > 0,
      ),
    [directImages, fetchedImages],
  );
  const activeIndex =
    images.length === 0 ? 0 : Math.min(currentIndex, images.length - 1);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (images.length === 0) return;
    const next = new window.Image();
    next.src = images[(activeIndex + 1) % images.length];
    const prev = new window.Image();
    prev.src = images[(activeIndex - 1 + images.length) % images.length];
  }, [activeIndex, images]);

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      window.history.pushState({ modal: true }, "");
    }
  }, [isOpen]);

  useEffect(() => {
    const handlePop = (e: PopStateEvent) => {
      if (wasOpenRef.current && isOpen) {
        e.preventDefault();
        onClose();
        return;
      }
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [isOpen, onClose]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((index) => {
      const safeIndex = Math.min(index, images.length - 1);

      return safeIndex > 0 ? safeIndex - 1 : images.length - 1;
    });
  }, [images.length]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((index) => {
      const safeIndex = Math.min(index, images.length - 1);

      return safeIndex < images.length - 1 ? safeIndex + 1 : 0;
    });
  }, [images.length]);

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > currentIndex ? 1 : -1);
      setCurrentIndex(idx);
    },
    [currentIndex]
  );

  const visibleCount = isMobile ? 5 : 10;
  const half = Math.floor(visibleCount / 2);
  const visibleStart = Math.max(0, activeIndex - half);
  const visibleEnd = Math.min(images.length, visibleStart + visibleCount);
  const visibleImages = images.slice(visibleStart, visibleEnd);

  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip || images.length === 0) return;
    const visibleIndex = activeIndex - visibleStart;
    const activeBtn = strip.children[visibleIndex] as HTMLElement;
    if (!activeBtn) return;

    const stripRect = strip.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const btnLeft = btnRect.left - stripRect.left;
    const targetScroll =
      strip.scrollLeft + btnLeft - stripRect.width / 2 + btnRect.width / 2;

    strip.scrollTo({ left: targetScroll, behavior: "smooth" });
  }, [activeIndex, images.length, isMobile, visibleStart]);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
    touchStartRef.current = null;
  };

  // ----------------------------------------------------------------------
  // 8. Render
  // ----------------------------------------------------------------------
  if (!isOpen || !project || loading) return null;
  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      >
        <div className="text-white">No images found</div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col bg-black rounded-lg overflow-hidden"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300"
              aria-label="Close"
            >
              <XMarkIcon className="w-8 h-8" />
            </motion.button>

            {/* Main Image with Slide + Fade */}
            <div className="relative flex-1 bg-black p-4 flex items-center justify-center overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({
                      x: dir > 0 ? 1000 : -1000,
                      opacity: 0,
                    }),
                    center: { x: 0, opacity: 1 },
                    exit: (dir: number) => ({
                      x: dir < 0 ? 1000 : -1000,
                      opacity: 0,
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[activeIndex]}
                    alt={`${project.title} – ${activeIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Arrows */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={goPrev}
                className="absolute left-6 z-10 p-3 bg-white/10 rounded-full text-white "
                aria-label="Previous"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={goNext}
                className="absolute right-6 z-10 p-3 bg-white/10 rounded-full text-white "
                aria-label="Next"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="p-3 bg-black border-t border-gray-800">
              <div
                ref={thumbStripRef}
                className="flex justify-center items-center gap-1.5 "
                style={{ scrollBehavior: "smooth" }}
              >
                <AnimatePresence>
                  {visibleImages.map((src, idx) => {
                    const originalIndex = visibleStart + idx;
                    const isActive = originalIndex === activeIndex;
                    return (
                      <motion.button
                        key={originalIndex}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                          scale: isActive ? 1.15 : 1,
                          opacity: 1,
                        }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: isActive ? 1.2 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => goTo(originalIndex)}
                        className={`relative flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2
                          ${
                            isActive
                              ? "border-white ring-2 ring-white ring-offset-2 ring-offset-black"
                              : "border-gray-600"
                          }`}
                        aria-label={`Thumbnail ${originalIndex + 1}`}
                      >
                        <Image
                          src={src}
                          alt={`Thumbnail ${originalIndex + 1}`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isActive && (
                          <motion.div
                            layoutId="active-thumb-overlay"
                            className="absolute inset-0 bg-white/30 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
