import type { InputHTMLAttributes, ReactNode } from "react";

type DashboardFileInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  label: string;
  title: string;
};

export function DashboardFileInput({
  "aria-describedby": ariaDescribedBy,
  className,
  error,
  helperText,
  icon,
  id,
  label,
  title,
  ...props
}: DashboardFileInputProps) {
  const errorId = error && id ? `${id}-error` : undefined;
  const helperId = helperText && id ? `${id}-help` : undefined;
  const describedBy = [ariaDescribedBy, helperId, errorId]
    .filter(Boolean)
    .join(" ");
  const ariaProps = error
    ? ({
        "aria-invalid": "true",
      } as const)
    : {};

  return (
    <section className="rounded-md border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-neutral-900 dark:text-white"
      >
        {label}
      </label>
      <div
        className={[
          "mt-3 flex min-h-52 flex-col items-center justify-center rounded-md border border-dashed bg-neutral-50 px-4 text-center dark:bg-neutral-950",
          error
            ? "border-red-500 dark:border-red-500"
            : "border-neutral-300 dark:border-neutral-700",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {icon}
        <p className="mt-3 text-sm font-semibold text-neutral-900 dark:text-white">
          {title}
        </p>
        {helperText && (
          <p
            id={helperId}
            className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400"
          >
            {helperText}
          </p>
        )}
        <input
          id={id}
          aria-describedby={describedBy || undefined}
          {...ariaProps}
          {...props}
          type="file"
          className={[
            "mt-4 w-full text-sm text-neutral-600 file:mr-4 file:min-h-10 file:rounded-md file:border-0 file:bg-neutral-900 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-neutral-800 dark:text-neutral-300 dark:file:bg-neutral-100 dark:file:text-neutral-950 dark:hover:file:bg-neutral-200",
            className ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        {error && (
          <p id={errorId} className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
