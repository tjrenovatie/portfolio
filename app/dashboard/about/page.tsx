import Image from "next/image";
import { dashboardNoIndexMetadata } from "@/lib/dashboard-seo";
import { getProfileImage } from "@/lib/site-images";
import ProfileImageUploadForm from "./ProfileImageUploadForm";

export const metadata = dashboardNoIndexMetadata;
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardAboutPage() {
  const profileImage = await getProfileImage();

  return (
    <article className="space-y-6">
      <section className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 dark:border-neutral-800 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-[--color-primary]">
            About
          </p>
          <h2 className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">
            Profile image
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Upload the profile image used on the public About page.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <div className="rounded-md border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="relative h-96 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-950">
            {profileImage ? (
              <Image
                src={profileImage.blobUrl}
                alt={profileImage.altText ?? "Current profile image"}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center px-5 text-center text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                No profile image uploaded
              </div>
            )}
          </div>
        </div>

        <section className="rounded-md border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <ProfileImageUploadForm />
        </section>
      </section>
    </article>
  );
}
