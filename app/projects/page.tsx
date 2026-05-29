import PhotoGallery, {
  type PhotoGalleryProject,
} from "@/components/PhotoGallery";
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

async function getGalleryProjects() {
  try {
    const databaseProjects = await getPublicProjects();
    const galleryProjects = databaseProjects
      .map<PhotoGalleryProject>((project) => ({
        id: project.id,
        title: project.name,
        images: project.images
          .filter((image) => image.blobUrl.trim().length > 0)
          .map((image) => ({
            id: image.id,
            src: image.blobUrl,
            alt: image.altText?.trim() || project.name,
            width: image.width ?? 1200,
            height: image.height ?? 900,
          })),
      }))
      .filter((project) => project.images.length > 0);

    if (galleryProjects.length > 0) {
      return galleryProjects;
    }
  } catch (error) {
    console.error("Failed to load database gallery projects:", error);
  }

  return Promise.all(
    fallbackProjects.map(async (project) => {
      const width = 1200;

      return {
        id: project.id,
        title: project.title,
        images: [
          {
            id: `${project.id}-cover`,
            src: await getFirstBlobUrl(project.blobPrefix, "/fallback.avif"),
            alt: project.title,
            width,
            height: Math.round(width / project.repAspect),
          },
        ],
      } satisfies PhotoGalleryProject;
    }),
  );
}

export default async function ProjectsPage() {
  const galleryProjects = await getGalleryProjects();

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

        <PhotoGallery projects={galleryProjects} />
      </section>
    </article>
  );
}
