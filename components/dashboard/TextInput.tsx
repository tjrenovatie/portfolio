import type { InputHTMLAttributes } from "react";
import TextInput from "@/components/textInput";

type DashboardTextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label: string;
};

export function DashboardTextInput({
  className,
  error,
  ...props
}: DashboardTextInputProps) {
  const stateClassName = error ? "dark:border-red-500" : "";
  const inputClassName = [
    "dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-[--color-primary] dark:focus:ring-[--color-primary]/30",
    stateClassName,
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TextInput
      error={error}
      labelClassName="dark:text-white"
      className={inputClassName}
      {...props}
    />
  );
}
