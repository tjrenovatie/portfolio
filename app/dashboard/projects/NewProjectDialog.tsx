"use client";

import { PhotoIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  DashboardButton,
  DashboardDialog,
  DashboardFileInput,
  DashboardTextArea,
  DashboardTextInput,
} from "@/components/dashboard";

export default function NewProjectDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DashboardButton
        onClick={() => setIsOpen(true)}
        className="min-h-11 px-5"
        icon={<PlusIcon className="h-5 w-5" aria-hidden="true" />}
      >
        New project
      </DashboardButton>

      <DashboardDialog
        description="Add the basic project content first. The submit action, AVIF conversion, blob upload, and database insert are connected in the next implementation step."
        eyebrow="New project"
        onClose={setIsOpen}
        open={isOpen}
        title="Create a project"
      >
        <form
          className="grid max-h-[calc(100dvh-10rem)] gap-6 overflow-y-auto bg-neutral-50 p-5 dark:bg-neutral-950 lg:grid-cols-[1fr_20rem]"
          encType="multipart/form-data"
        >
          <section className="grid gap-5 rounded-md border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <DashboardTextInput
              id="project-name"
              name="name"
              type="text"
              required
              label="Project name"
              placeholder="Bathroom renovation"
            />

            <DashboardTextArea
              id="project-description"
              name="description"
              required
              rows={8}
              label="Description"
              placeholder="Describe the scope, materials, and result."
            />
          </section>

          <aside className="space-y-5">
            <DashboardFileInput
              id="project-thumbnail"
              name="thumbnail"
              accept="image/avif,image/jpeg,image/png,image/webp"
              required
              helperText="JPG, PNG, WebP, or AVIF."
              icon={
                <PhotoIcon
                  className="h-10 w-10 text-neutral-400 dark:text-neutral-500"
                  aria-hidden="true"
                />
              }
              label="Thumbnail"
              title="Select a thumbnail image"
            />

            <DashboardButton
              type="submit"
              disabled
              className="min-h-11 w-full px-5"
              variant="disabled"
            >
              Create project
            </DashboardButton>
            <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
              Disabled until the create action and upload pipeline are added.
            </p>
          </aside>
        </form>
      </DashboardDialog>
    </>
  );
}
