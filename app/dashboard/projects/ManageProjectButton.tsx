"use client";

import { PencilIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  DashboardButton,
  DashboardDialog,
  DashboardFileInput,
  DashboardStatusMessage,
  DashboardTextArea,
  DashboardTextInput,
} from "@/components/dashboard";
import { updateProjectAction, type UpdateProjectState } from "./actions";

const initialUpdateProjectState: UpdateProjectState = {
  status: "idle",
};

type ManageProjectButtonProps = {
  description: string;
  projectId: string;
  projectName: string;
  thumbnailUrl: string | null;
};

export default function ManageProjectButton({
  description,
  projectId,
  projectName,
  thumbnailUrl,
}: ManageProjectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(thumbnailUrl);
  const router = useRouter();
  const previousObjectUrl = useRef<string | null>(null);
  const [state, formAction, isPending] = useActionState(
    updateProjectAction.bind(null, projectId),
    initialUpdateProjectState,
  );
  const currentPreviewUrl = state.thumbnailUrl ?? previewUrl;

  useEffect(() => {
    return () => {
      if (previousObjectUrl.current) {
        URL.revokeObjectURL(previousObjectUrl.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <>
      <DashboardButton
        aria-label={`Manage ${projectName}`}
        onClick={() => setIsOpen(true)}
        variant="secondary"
        className="h-10 w-10 !gap-0 !p-0"
      >
        <PencilIcon className="h-4 w-4" aria-hidden="true" />
      </DashboardButton>

      <DashboardDialog
        description="Update the project title, description, and thumbnail image."
        eyebrow="Manage project"
        onClose={setIsOpen}
        open={isOpen}
        title={projectName}
      >
        <form
          action={formAction}
          className="grid max-h-[calc(100dvh-10rem)] gap-6 overflow-y-auto bg-neutral-50 p-5 dark:bg-neutral-950 lg:grid-cols-[1fr_20rem]"
        >
          {state.message && (
            <DashboardStatusMessage
              className="lg:col-span-2"
              status={state.status === "success" ? "success" : "error"}
            >
              {state.message}
            </DashboardStatusMessage>
          )}

          <section className="grid gap-5 rounded-md border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <DashboardTextInput
              id={`project-name-${projectId}`}
              name="name"
              type="text"
              required
              defaultValue={projectName}
              error={state.fieldErrors?.name}
              label="Project title"
            />

            <DashboardTextArea
              id={`project-description-${projectId}`}
              name="description"
              required
              rows={8}
              defaultValue={description}
              error={state.fieldErrors?.description}
              label="Description"
            />
          </section>

          <aside className="space-y-5">
            <section className="rounded-md border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                Thumbnail preview
              </p>
              <div className="mt-3 h-52 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950">
                {currentPreviewUrl ? (
                  // Blob preview URLs and object URLs are dynamic.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentPreviewUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                    No thumbnail
                  </div>
                )}
              </div>
            </section>

            <DashboardFileInput
              id={`project-thumbnail-${projectId}`}
              name="thumbnail"
              accept="image/avif,image/jpeg,image/png,image/webp"
              error={state.fieldErrors?.thumbnail}
              helperText="Optional. Select a new thumbnail to replace the current one."
              label="Replace thumbnail"
              title="Select a new thumbnail"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];

                if (previousObjectUrl.current) {
                  URL.revokeObjectURL(previousObjectUrl.current);
                  previousObjectUrl.current = null;
                }

                if (!file) {
                  setPreviewUrl(thumbnailUrl);
                  return;
                }

                const objectUrl = URL.createObjectURL(file);
                previousObjectUrl.current = objectUrl;
                setPreviewUrl(objectUrl);
              }}
            />

            <DashboardButton
              type="submit"
              disabled={isPending}
              className="min-h-11 w-full px-5"
              variant={isPending ? "disabled" : "primary"}
            >
              {isPending ? "Saving..." : "Save project"}
            </DashboardButton>
          </aside>
        </form>
      </DashboardDialog>
    </>
  );
}
