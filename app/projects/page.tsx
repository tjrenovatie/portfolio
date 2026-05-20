import BlobImage from "@/components/blobImage";
import { projects } from "@/lib/projects";
import ProjectsClientWrapper from "./ProjectsClientWrapper";

const ROW_HEIGHT = 10;
const CARD_GAP = 16;
const CARD_WIDTH = 300;
/** [grid-auto-rows:10px] */

export const dynamic = "force-static";

export default function ProjectsPage() {
  return (
    <article className="min-h-screen w-full text-[--color-primary-title] p-5">
      <div className="container mx-auto mb-10">
        <h1 className="text-4xl font-bold text-center mb-10">Onze Projecten</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 [grid-auto-rows:2rem]">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <ProjectsClientWrapper />
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const height = CARD_WIDTH / project.repAspect;
  const span = Math.ceil((height + CARD_GAP) / (ROW_HEIGHT + CARD_GAP));

  return (
    <div
      className="group relative overflow-hidden rounded-sm shadow-md hover:shadow-xl transition-shadow cursor-pointer"
      style={{ gridRowEnd: `span ${span}` }}
      data-project-id={project.id}
    >
      <BlobImage
        blobPrefix={project.blobPrefix}
        fallbackSrc="/fallback.avif"
        alt={project.title}
        width={CARD_WIDTH}
        height={Math.round(height)}
        className="w-full h-full object-cover"
        priority
      />
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="p-3 text-white font-medium">{project.title}</p>
      </div>
    </div>
  );
}
