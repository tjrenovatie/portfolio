import BlobImage from "@/components/blobImage";
import { getPublicProjects } from "@/lib/db-projects";
import { projects as fallbackProjects, type Project } from "@/lib/projects";
import ProjectsClientWrapper from "./ProjectsClientWrapper";

const ROW_HEIGHT = 10;
const CARD_GAP = 16;
const CARD_WIDTH = 300;
/** [grid-auto-rows:10px] */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getRepresentativeAspect(project: {
  images: Array<{ height: number | null; width: number | null }>;
  thumbnail: { height: number | null; width: number | null } | null;
}) {
  const representativeImage = project.thumbnail ?? project.images[0];

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
      thumbnailUrl: project.thumbnailUrl,
    }));
  } catch (error) {
    console.error("Failed to load database projects:", error);

    return [...fallbackProjects];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <article className="min-h-screen w-full text-[--color-primary-title] p-5">
      <div className="container mx-auto mb-10">
        <h1 className="text-4xl font-bold text-center mb-10">Onze Projecten</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 [grid-auto-rows:2rem]">
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
  const height = CARD_WIDTH / project.repAspect;
  const span = Math.ceil((height + CARD_GAP) / (ROW_HEIGHT + CARD_GAP));

  return (
    <div
      className="group relative overflow-hidden rounded-sm shadow-md hover:shadow-xl transition-shadow cursor-pointer"
      style={{ gridRowEnd: `span ${span}` }}
      data-project-id={project.id}
    >
      {project.thumbnailUrl ? (
        // Database project images come from Vercel Blob URLs that are not known
        // at build time, so render the stored public URL directly.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          width={CARD_WIDTH}
          height={Math.round(height)}
          className="w-full h-full object-cover"
        />
      ) : project.blobPrefix ? (
        <BlobImage
          blobPrefix={project.blobPrefix}
          fallbackSrc="/fallback.avif"
          alt={project.title}
          width={CARD_WIDTH}
          height={Math.round(height)}
          className="w-full h-full object-cover"
          priority
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-sm font-semibold text-neutral-500">
          No image
        </div>
      )}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="p-3 text-white font-medium">{project.title}</p>
      </div>
    </div>
  );
}
