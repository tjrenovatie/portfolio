import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type DashboardButtonVariant = "primary" | "secondary" | "ghost" | "disabled";

type DashboardButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: ReactNode;
  variant?: DashboardButtonVariant;
};

type DashboardButtonLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  icon?: ReactNode;
  variant?: Exclude<DashboardButtonVariant, "disabled">;
};

const baseClasses =
  "inline-flex min-h-10 items-center justify-center gap-2 px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--color-primary]";

const variantClasses: Record<DashboardButtonVariant, string> = {
  primary:
    "bg-[--color-primary] text-white hover:bg-[--color-secondary] hover:text-white",
  secondary:
    "border border-neutral-300 bg-white text-neutral-800 hover:border-[--color-primary] hover:text-[--color-secondary] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:border-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-white",
  ghost:
    "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white",
  disabled:
    "border border-neutral-300 bg-neutral-200 text-neutral-500 disabled:cursor-not-allowed dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-500",
};

export function DashboardButton({
  children,
  className,
  icon,
  type = "button",
  variant = "primary",
  ...props
}: DashboardButtonProps) {
  return (
    <button
      type={type}
      className={[
        baseClasses,
        className?.includes("rounded-") ? "" : "rounded-md",
        variantClasses[variant],
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export function DashboardButtonLink({
  children,
  className,
  href,
  icon,
  variant = "primary",
}: DashboardButtonLinkProps) {
  return (
    <Link
      href={href}
      className={[
        baseClasses,
        className?.includes("rounded-") ? "" : "rounded-md",
        variantClasses[variant],
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon}
      {children}
    </Link>
  );
}
