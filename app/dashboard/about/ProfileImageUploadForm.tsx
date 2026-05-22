"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";
import {
  DashboardButton,
  DashboardFileInput,
  DashboardStatusMessage,
} from "@/components/dashboard";
import {
  uploadProfileImageAction,
  type UploadProfileImageState,
} from "./actions";

const initialUploadProfileImageState: UploadProfileImageState = {
  status: "idle",
};

export default function ProfileImageUploadForm() {
  const [state, formAction, isPending] = useActionState(
    uploadProfileImageAction,
    initialUploadProfileImageState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <DashboardFileInput
        id="profile-image"
        name="image"
        accept="image/avif,image/jpeg,image/png,image/webp"
        error={state.fieldErrors?.image}
        helperText="JPG, PNG, WebP, or AVIF. The image is converted to AVIF before upload."
        icon={
          <UserCircleIcon
            className="h-10 w-10 text-neutral-400 dark:text-neutral-500"
            aria-hidden="true"
          />
        }
        label="Profile image"
        required
        title="Select a profile image"
      />

      {state.message && (
        <DashboardStatusMessage
          status={state.status === "success" ? "success" : "error"}
        >
          {state.message}
        </DashboardStatusMessage>
      )}

      <DashboardButton
        type="submit"
        disabled={isPending}
        variant={isPending ? "disabled" : "primary"}
      >
        {isPending ? "Uploading..." : "Upload profile image"}
      </DashboardButton>
    </form>
  );
}
