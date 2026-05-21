"use client";

import { useTransition } from "react";
import { BarsArrowDownIcon, BarsArrowUpIcon } from "@heroicons/react/24/outline";
import { DashboardButton } from "@/components/dashboard";
import { reorderGalleryImageAction } from "./actions";

type ReorderGalleryImageButtonsProps = {
  imageId: string;
  imageName: string;
  isFirst: boolean;
  isLast: boolean;
  projectId: string;
};

export default function ReorderGalleryImageButtons({
  imageId,
  imageName,
  isFirst,
  isLast,
  projectId,
}: ReorderGalleryImageButtonsProps) {
  const [isPending, startTransition] = useTransition();

  function moveImage(direction: "down" | "up") {
    startTransition(async () => {
      const result = await reorderGalleryImageAction(
        projectId,
        imageId,
        direction,
      );

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
        aria-label={`Move ${imageName} up`}
        className="h-10 w-10 !gap-0 !p-0"
        disabled={upDisabled}
        onClick={() => moveImage("up")}
        title={`Move ${imageName} up`}
        variant={upDisabled ? "disabled" : "secondary"}
      >
        <BarsArrowUpIcon className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Move up</span>
      </DashboardButton>
      <DashboardButton
        aria-label={`Move ${imageName} down`}
        className="h-10 w-10 !gap-0 !p-0"
        disabled={downDisabled}
        onClick={() => moveImage("down")}
        title={`Move ${imageName} down`}
        variant={downDisabled ? "disabled" : "secondary"}
      >
        <BarsArrowDownIcon className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Move down</span>
      </DashboardButton>
    </div>
  );
}
