"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";
import {
  DashboardButton,
  DashboardFileInput,
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
        <p
          className={`rounded-md border px-4 py-3 text-sm font-semibold ${
            state.status === "success"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {state.message}
        </p>
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
