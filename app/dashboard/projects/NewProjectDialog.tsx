"use client";

import { PhotoIcon, PlusIcon } from "@heroicons/react/24/outline";
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
import { createProjectAction, type CreateProjectState } from "./actions";

const initialCreateProjectState: CreateProjectState = {
  status: "idle",
};

export default function NewProjectDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function openDialog() {
    setFormKey((currentKey) => currentKey + 1);
    setIsOpen(true);
  }

  function closeDialog(open: boolean) {
    setIsOpen(open);
  }

  return (
    <>
      <DashboardButton
        onClick={openDialog}
        className="min-h-11 px-5"
        icon={<PlusIcon className="h-5 w-5" aria-hidden="true" />}
      >
        New project
      </DashboardButton>

      <DashboardDialog
        description="Create the project record, convert the thumbnail to AVIF, store it in Vercel Blob, and save the blob metadata in Neon Postgres."
        eyebrow="New project"
        onClose={closeDialog}
        open={isOpen}
        title="Create a project"
      >
        <NewProjectForm key={formKey} onCreated={() => setIsOpen(false)} />
      </DashboardDialog>
    </>
  );
}

function NewProjectForm({ onCreated }: { onCreated: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createProjectAction,
    initialCreateProjectState,
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    formRef.current?.reset();
    router.refresh();
    const closeTimer = window.setTimeout(onCreated, 0);

    return () => window.clearTimeout(closeTimer);
  }, [onCreated, router, state.status]);

  return (
    <form
      ref={formRef}
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
          id="project-name"
          name="name"
          type="text"
          required
          error={state.fieldErrors?.name}
          label="Project name"
          placeholder="Bathroom renovation"
        />

        <DashboardTextArea
          id="project-description"
          name="description"
          required
          rows={8}
          error={state.fieldErrors?.description}
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
          error={state.fieldErrors?.thumbnail}
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
          disabled={isPending}
          className="min-h-11 w-full px-5"
          variant={isPending ? "disabled" : "primary"}
        >
          {isPending ? "Creating..." : "Create project"}
        </DashboardButton>
        <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          Thumbnail images are converted to AVIF before upload.
        </p>
      </aside>
    </form>
  );
}
