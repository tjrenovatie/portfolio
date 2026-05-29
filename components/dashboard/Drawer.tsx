"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  type DialogProps,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { DashboardButton } from "@/components/dashboard/Button";

type DashboardDrawerProps = {
  children: ReactNode;
  onClose: DialogProps["onClose"];
  open: boolean;
  title: string;
};

export function DashboardDrawer({
  children,
  onClose,
  open,
  title,
}: DashboardDrawerProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

      <div className="fixed inset-0 flex">
        <DialogPanel className="flex h-dvh w-full max-w-80 flex-col border-r border-neutral-800 bg-neutral-900 text-neutral-100 shadow-2xl shadow-black/40">
          <div className="flex min-h-16 items-center justify-between gap-4 border-b border-neutral-800 px-4">
            <DialogTitle className="text-sm font-bold tracking-wide text-white">
              {title}
            </DialogTitle>

            <DashboardButton
              aria-label="Close menu"
              className="h-10 w-10 shrink-0 !gap-0 !p-0"
              onClick={() => onClose(false)}
              variant="secondary"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </DashboardButton>
          </div>

          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
