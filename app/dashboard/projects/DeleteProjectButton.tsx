"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import {
  DashboardButton,
  DashboardDialog,
  DashboardStatusMessage,
} from "@/components/dashboard";
import { deleteProjectAction, type DeleteProjectState } from "./actions";

const initialDeleteProjectState: DeleteProjectState = {
  status: "idle",
};

type DeleteProjectButtonProps = {
  projectId: string;
  projectName: string;
};

export default function DeleteProjectButton({
  projectId,
  projectName,
}: DeleteProjectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    deleteProjectAction.bind(null, projectId),
    initialDeleteProjectState,
  );

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    router.refresh();
    const closeTimer = window.setTimeout(() => setIsOpen(false), 0);

    return () => window.clearTimeout(closeTimer);
  }, [router, state.status]);

  return (
    <>
      <DashboardButton
        aria-label={`Delete ${projectName}`}
        onClick={() => setIsOpen(true)}
        variant="danger"
        className="h-10 w-10 !gap-0 !p-0"
      >
        <TrashIcon className="h-4 w-4" aria-hidden="true" />
      </DashboardButton>

      <DashboardDialog
        description="This removes the project, its image metadata, and the uploaded Blob files. This action cannot be undone."
        eyebrow="Delete project"
        onClose={setIsOpen}
        open={isOpen}
        title={`Delete ${projectName}?`}
      >
        <form action={formAction} className="space-y-5 bg-neutral-50 p-5 dark:bg-neutral-950">
          {state.message && (
            <DashboardStatusMessage
              status={state.status === "success" ? "success" : "error"}
            >
              {state.message}
            </DashboardStatusMessage>
          )}

          <div className="rounded-md border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-300">
              Confirm that you want to delete{" "}
              <span className="font-bold text-neutral-950 dark:text-white">
                {projectName}
              </span>
              .
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <DashboardButton
              onClick={() => setIsOpen(false)}
              variant="secondary"
              disabled={isPending}
            >
              Cancel
            </DashboardButton>
            <DashboardButton
              type="submit"
              variant={isPending ? "disabled" : "danger"}
              disabled={isPending}
              icon={<TrashIcon className="h-4 w-4" aria-hidden="true" />}
            >
              {isPending ? "Deleting..." : "Delete project"}
            </DashboardButton>
          </div>
        </form>
      </DashboardDialog>
    </>
  );
}
