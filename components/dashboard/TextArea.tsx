import type { TextareaHTMLAttributes } from "react";

type DashboardTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function DashboardTextArea({
  className,
  id,
  label,
  ...props
}: DashboardTextAreaProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-neutral-900 dark:text-white"
      >
        {label}
      </label>
      <textarea
        id={id}
        className={[
          "mt-2 w-full resize-y rounded-md border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-[--color-primary] dark:focus:ring-[--color-primary]/30",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    </div>
  );
}
