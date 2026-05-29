import PhotoGallery, { type PhotoGalleryItem } from "@/components/PhotoGallery";
import { getPublicProjects } from "@/lib/db-projects";
import { projects as fallbackProjects } from "@/lib/projects";
import { getFirstBlobUrl } from "@/lib/vercel-blob";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
    <article className="min-h-screen w-full bg-[#f7f5f1] px-4 py-10 text-[--color-primary-title] sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-[1720px]">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <span className="eyebrow">Portfolio</span>
          <h1 className="mt-3 text-4xl font-bold">Onze Projecten</h1>
          <p className="mt-4 text-base leading-7 text-neutral-600 sm:text-lg">
            Een selectie van afgeronde renovaties, badkamers, keukens en
            interieurs.
          </p>
        </header>

        <PhotoGallery images={galleryImages} />
      </div>
    </article>
  );
}
