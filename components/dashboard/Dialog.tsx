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

type DashboardDialogProps = {
  children: ReactNode;
  description?: string;
  eyebrow?: string;
  onClose: DialogProps["onClose"];
  open: boolean;
  title: string;
};

export function DashboardDialog({
  children,
  description,
  eyebrow,
  onClose,
  open,
  title,
}: DashboardDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-sm dark:bg-neutral-950/80"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex min-h-dvh items-center justify-center overflow-y-auto p-4">
        <DialogPanel className="w-full max-w-4xl overflow-hidden rounded-md border border-neutral-200 bg-white text-neutral-950 shadow-2xl shadow-black/25 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-black/60">
          <div className="flex items-start justify-between gap-4 border-b border-neutral-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              {eyebrow && (
                <p className="text-sm font-semibold uppercase text-[--color-primary]">
                  {eyebrow}
                </p>
              )}
              <DialogTitle className="mt-1 text-xl font-bold text-neutral-950 dark:text-white">
                {title}
              </DialogTitle>
              {description && (
                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                  {description}
                </p>
              )}
            </div>

            <DashboardButton
              aria-label="Close dialog"
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
