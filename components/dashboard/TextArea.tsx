import type { TextareaHTMLAttributes } from "react";
import TextArea from "@/components/text-area";

type DashboardTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  label: string;
};

export function DashboardTextArea({
  className,
  error,
  ...props
}: DashboardTextAreaProps) {
  return (
    <TextArea
      error={error}
      labelClassName="dark:text-white"
      className={[
        "dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-[--color-primary] dark:focus:ring-[--color-primary]/30",
        error ? "dark:border-red-500" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
