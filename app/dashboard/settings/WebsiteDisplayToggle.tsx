"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";
import {
  DashboardButton,
  DashboardStatusMessage,
} from "@/components/dashboard";
import {
  toggleWebsiteDisplayAction,
  type ToggleWebsiteDisplayState,
} from "./actions";

type WebsiteDisplayToggleProps = {
  isWebsiteEnabled: boolean;
};

export default function WebsiteDisplayToggle({
  isWebsiteEnabled,
}: WebsiteDisplayToggleProps) {
  const [state, formAction, isPending] = useActionState(
    toggleWebsiteDisplayAction,
    {
      isWebsiteEnabled,
      status: "idle",
    } satisfies ToggleWebsiteDisplayState,
  );
  const currentEnabled =
    typeof state.isWebsiteEnabled === "boolean"
      ? state.isWebsiteEnabled
      : isWebsiteEnabled;
  const nextEnabled = !currentEnabled;

  return (
    <section className="rounded-md border border-neutral-800 bg-neutral-900 p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-400">
            Public website
          </p>
          <h3 className="mt-2 text-xl font-bold text-white">
            {currentEnabled ? "Website is visible" : "Website is hidden"}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-300">
            When hidden, public routes render a blank white page. Dashboard
            routes remain available.
          </p>
        </div>

        <form action={formAction}>
          <input type="hidden" name="enabled" value={String(nextEnabled)} />
          <DashboardButton
            className="min-h-11 px-5"
            disabled={isPending}
            icon={
              currentEnabled ? (
                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
              )
            }
            type="submit"
            variant={
              isPending ? "disabled" : currentEnabled ? "danger" : "primary"
            }
          >
            {isPending
              ? "Updating..."
              : currentEnabled
                ? "Hide website"
                : "Display website"}
          </DashboardButton>
        </form>
      </div>

      {state.message && (
        <DashboardStatusMessage
          className="mt-5"
          status={state.status === "success" ? "success" : "error"}
        >
          {state.message}
        </DashboardStatusMessage>
      )}
    </section>
  );
}
