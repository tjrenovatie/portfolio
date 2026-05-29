import Link from "next/link";
import { dashboardNoIndexMetadata } from "@/lib/dashboard-seo";
import { getDashboardProjects } from "@/lib/db-projects";

export const metadata = dashboardNoIndexMetadata;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardPage() {
  const projects = await getDashboardProjects();
  const recentProjects = projects.slice(0, 6);
  const projectsWithThumbnails = projects.filter(
    (project) => project.thumbnailUrl,
  ).length;
  const metrics = [
    {
      label: "Published projects",
      value: projects.length,
      detail: "Stored in the project database",
    },
    {
      label: "Project thumbnails",
      value: projectsWithThumbnails,
      detail: "Projects with uploaded thumbnail images",
    },
    {
      label: "Missing thumbnails",
      value: projects.length - projectsWithThumbnails,
      detail: "Projects that still need a thumbnail",
    },
  ];


  return (
    <article className="space-y-6">
      <section className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-[--color-primary]">
            Admin
          </p>
          <h2 className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">
            Dashboard overview
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Manage portfolio content, review project data, and keep image
            folders aligned with the public gallery.
          </p>
        </div>

        <Link
          href="/projects"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-[--color-primary] px-5 text-sm font-semibold text-white transition-colors hover:bg-[--color-secondary] hover:text-white"
        >
          View portfolio
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-md border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
              {metric.label}
            </p>
            <p className="mt-3 text-3xl font-bold text-neutral-950 dark:text-white">
              {metric.value}
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              {metric.detail}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-md border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
          <h3 className="text-base font-bold text-neutral-950 dark:text-white">
            Recent projects
          </h3>
          <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            {projects.length} total
          </span>
        </div>

        {recentProjects.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-semibold text-neutral-950 dark:text-white">
              No database projects yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              Create projects from the project library to populate this
              overview.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <div>
                  <p className="text-sm font-bold text-neutral-950 dark:text-white">
                    {project.name}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-neutral-500 dark:text-neutral-400">
                    {project.description}
                  </p>
                </div>
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                  /{project.slug}
                </span>
                <span className="rounded-md bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                  {project.thumbnailUrl ? "Thumbnail" : "No thumbnail"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </article>
  );
}
