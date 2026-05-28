import BlobImage from "@/components/blobImage";
import { getPublicProjects } from "@/lib/db-projects";
import { projects as fallbackProjects, type Project } from "@/lib/projects";
import ProjectsClientWrapper from "./ProjectsClientWrapper";

const CARD_WIDTH = 300;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getRepresentativeAspect(project: {
  images: Array<{ height: number | null; width: number | null }>;
}) {
  const representativeImage = project.images[0];

  if (!representativeImage?.width || !representativeImage.height) {
    return 1.33;
  }

  return representativeImage.width / representativeImage.height;
}

async function getProjects() {
  try {
    const databaseProjects = await getPublicProjects();

    if (databaseProjects.length === 0) {
      return [...fallbackProjects];
    }

    return databaseProjects.map<Project>((project) => ({
      id: project.id,
      title: project.name,
      repAspect: getRepresentativeAspect(project),
      imageUrls: project.imageUrls,
    }));
  } catch (error) {
    console.error("Failed to load database projects:", error);

    return [...fallbackProjects];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <article className="min-h-screen w-full bg-neutral-50 px-5 py-10 text-[--color-primary-title]">
      <div className="container mx-auto mb-10">
        <header className="mx-auto mb-10 max-w-3xl text-center">
          <span className="eyebrow">Portfolio</span>
          <h1 className="mt-3 text-4xl font-bold">Onze Projecten</h1>
          <p className="mt-4 text-base leading-7 text-neutral-600 sm:text-lg">
            Een selectie van afgeronde renovaties, badkamers, keukens en
            interieurs.
          </p>
        </header>

        <div
          className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
          data-project-gallery
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <ProjectsClientWrapper projects={projects} />
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const safeAspect = Math.max(0.65, Math.min(project.repAspect, 1.9));
  const height = Math.round(CARD_WIDTH / safeAspect);
  const previewUrl = project.imageUrls?.find((url) => url.trim().length > 0);

  return (
    <figure
      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-md bg-neutral-200 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      data-project-id={project.id}
    >
      <div
        className="relative w-full cursor-pointer overflow-hidden"
        style={{ aspectRatio: `${safeAspect} / 1` }}
      >
        {previewUrl ? (
        // Database project images come from Vercel Blob URLs that are not known
        // at build time, so render the stored public URL directly.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={project.title}
          width={CARD_WIDTH}
          height={height}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        ) : project.blobPrefix ? (
        <BlobImage
          blobPrefix={project.blobPrefix}
          fallbackSrc="/fallback.avif"
          alt={project.title}
          width={CARD_WIDTH}
          height={height}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          priority
        />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-sm font-semibold text-neutral-500">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 p-4">
        <h2 className="text-lg font-bold leading-tight text-white drop-shadow-sm">
          {project.title}
        </h2>
      </figcaption>
    </figure>
  );
}
