"use client";

import { useTransition } from "react";
import { BarsArrowDownIcon, BarsArrowUpIcon } from "@heroicons/react/24/outline";
import { DashboardButton } from "@/components/dashboard";
import { reorderProjectAction } from "./actions";

type ReorderProjectButtonsProps = {
  isFirst: boolean;
  isLast: boolean;
  projectId: string;
  projectName: string;
};

export default function ReorderProjectButtons({
  isFirst,
  isLast,
  projectId,
  projectName,
}: ReorderProjectButtonsProps) {
  const [isPending, startTransition] = useTransition();

  function moveProject(direction: "down" | "up") {
    startTransition(async () => {
      const result = await reorderProjectAction(projectId, direction);

      if (result.status === "error") {
        console.error(result.message);
      }
    });
  }

  const upDisabled = isPending || isFirst;
  const downDisabled = isPending || isLast;

  return (
    <div className="flex items-center gap-2">
      <DashboardButton
        aria-label={`Move ${projectName} up`}
        className="h-10 w-10 !gap-0 !p-0"
        disabled={upDisabled}
        onClick={() => moveProject("up")}
        title={`Move ${projectName} up`}
        variant={upDisabled ? "disabled" : "secondary"}
      >
        <BarsArrowUpIcon className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Move up</span>
      </DashboardButton>
      <DashboardButton
        aria-label={`Move ${projectName} down`}
        className="h-10 w-10 !gap-0 !p-0"
        disabled={downDisabled}
        onClick={() => moveProject("down")}
        title={`Move ${projectName} down`}
        variant={downDisabled ? "disabled" : "secondary"}
      >
        <BarsArrowDownIcon className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Move down</span>
      </DashboardButton>
    </div>
  );
}
