import PhotoGallery, { type PhotoGalleryItem } from "@/components/PhotoGallery";
import { MotionDiv, MotionH1, MotionP } from "@/components/motion";
import { getPublicProjects } from "@/lib/db-projects";
import { projects as fallbackProjects } from "@/lib/projects";
import { getFirstBlobUrl } from "@/lib/vercel-blob";
import type { Variants } from "framer-motion";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

async function getGalleryImages() {
  try {
    const databaseProjects = await getPublicProjects();
    const galleryImages = databaseProjects.flatMap<PhotoGalleryItem>(
      (project) =>
        project.images
          .filter((image) => image.blobUrl.trim().length > 0)
          .map((image) => ({
            id: image.id,
            src: image.blobUrl,
            alt: image.altText?.trim() || project.name,
            title: project.name,
            description: project.description,
            width: image.width ?? 1200,
            height: image.height ?? 900,
          })),
    );

    if (galleryImages.length > 0) {
      return galleryImages;
    }
  } catch (error) {
    console.error("Failed to load database gallery images:", error);
  }

  return Promise.all(
    fallbackProjects.map(async (project) => {
      const width = 1200;

      return {
        id: project.id,
        src: await getFirstBlobUrl(project.blobPrefix, "/fallback.avif"),
        alt: project.title,
        title: project.title,
        description: "Bekijk dit afgeronde renovatieproject van TJ Renovatie.",
        width,
        height: Math.round(width / project.repAspect),
      } satisfies PhotoGalleryItem;
    }),
  );
}

export default async function ProjectsPage() {
  const galleryImages = await getGalleryImages();

  return (
    <article className="min-h-screen w-full bg-[#f7f5f1] text-[--color-primary-title]">
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pt-20">
        <MotionDiv
          className="mb-12 max-w-3xl select-text"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <MotionP className="eyebrow mb-4" variants={revealUp}>
            Portfolio
          </MotionP>
          <MotionH1
            className="mb-5 text-[--color-primary-title]"
            variants={revealUp}
          >
            Onze Projecten
          </MotionH1>
          <MotionP
            className="max-w-2xl text-base leading-8 text-neutral-700 sm:text-lg"
            variants={revealUp}
          >
            Een selectie van afgeronde renovaties, badkamers, keukens en
            interieurs.
          </MotionP>
        </MotionDiv>

        <PhotoGallery images={galleryImages} />
      </section>
    </article>
  );
}
