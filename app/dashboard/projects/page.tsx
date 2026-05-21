import { getDashboardProjects } from "@/lib/db-projects";
import { PencilIcon } from "@heroicons/react/24/outline";
import { DashboardButtonLink } from "@/components/dashboard";
import DeleteProjectButton from "./DeleteProjectButton";
import NewProjectDialog from "./NewProjectDialog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardProjectsPage() {
  const projects = await getDashboardProjects();

  return (
    <article className="space-y-6">
      <section className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-[--color-primary]">
            Projects
          </p>
          <h2 className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">
            Project library
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Review the projects stored in Neon Postgres and prepare new
            portfolio entries for image upload.
          </p>
        </div>

        <NewProjectDialog />
      </section>

      <section className="rounded-md border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
          <h3 className="text-base font-bold text-neutral-950 dark:text-white">
            Projects
          </h3>
          <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            {projects.length} total
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-semibold text-neutral-950 dark:text-white">
              No database projects yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              Create the first project entry from the dashboard. Upload and
              persistence will be connected in the next step.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {projects.map((project) => (
              <div
                key={project.id}
                className="grid gap-4 px-5 py-4 md:grid-cols-[5rem_1fr_auto] md:items-center"
              >
                <div className="h-20 w-20 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
                  {project.thumbnailUrl ? (
                    // Blob URLs are stored outside Next image config at this stage.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-neutral-950 dark:text-white">
                    {project.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                    {project.description}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    /{project.slug}
                  </p>
                </div>

                <div className="flex items-center gap-2 md:justify-end">
                  <DashboardButtonLink
                    href={`/dashboard/projects/${project.id}/images`}
                    variant="secondary"
                    className="h-10 w-10 !gap-0 !p-0"
                    aria-label={`Manage ${project.name}`}
                  >
                    <PencilIcon className="h-4 w-4" aria-hidden="true" />
                  </DashboardButtonLink>
                  <DeleteProjectButton
                    projectId={project.id}
                    projectName={project.name}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </article>
  );
}
