"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { DashboardButton } from "@/components/dashboard/Button";
import { DASHBOARD_LOGIN_PATH } from "@/lib/dashboard-auth-routes";

type DashboardLogoutButtonProps = {
  isCompact?: boolean;
};

export function DashboardLogoutButton({
  isCompact = false,
}: DashboardLogoutButtonProps) {
  const [isPending, setIsPending] = useState(false);

  return (
    <DashboardButton
      aria-label="Sign out"
      className={isCompact ? "h-10 w-10 !gap-0 !p-0" : "min-h-11 w-full px-3"}
      disabled={isPending}
      icon={<ArrowLeftOnRectangleIcon className="h-5 w-5" aria-hidden="true" />}
      onClick={() => {
        setIsPending(true);
        void signOut({ callbackUrl: DASHBOARD_LOGIN_PATH });
      }}
      title="Sign out"
      type="button"
      variant={isPending ? "disabled" : "secondary"}
    >
      {isCompact ? <span className="sr-only">Sign out</span> : "Sign out"}
    </DashboardButton>
  );
}
