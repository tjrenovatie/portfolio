import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { notFound } from "next/navigation";
import {
  getDashboardProject,
  getProjectImages,
} from "@/lib/db-projects";
import { DashboardButtonLink } from "@/components/dashboard";
import { dashboardNoIndexMetadata } from "@/lib/dashboard-seo";
import GalleryImageList from "./GalleryImageList";
import ImageUploadForm from "./ImageUploadForm";

export const metadata = dashboardNoIndexMetadata;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProjectImagesPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectImagesPage({
  params,
}: ProjectImagesPageProps) {
  const { projectId } = await params;
  const project = await getDashboardProject(projectId);

  if (!project) {
    notFound();
  }

  const images = await getProjectImages(project.id);
  const galleryImages = images.filter((image) => image.role === "gallery");

  return (
    <article className="space-y-6">
      <section className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-end">
        <div>
          <DashboardButtonLink
            href="/dashboard/projects"
            icon={<ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />}
            variant="ghost"
            className="mb-4 w-fit px-0 hover:bg-transparent dark:hover:bg-transparent"
          >
            Back to projects
          </DashboardButtonLink>
          <p className="text-sm font-semibold uppercase text-[--color-primary]">
            Project images
          </p>
          <h2 className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">
            {project.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Upload gallery images and manage the display order for the public
            project gallery.
          </p>
        </div>

        <div className="rounded-md border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            Gallery images
          </p>
          <p className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
            {galleryImages.length}
          </p>
        </div>
      </section>

      <GalleryImageList images={galleryImages} projectId={project.id} />

      <ImageUploadForm projectId={project.id} />
    </article>
  );
}
