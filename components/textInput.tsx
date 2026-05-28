import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  containerClassName?: string;
  error?: string;
  label: string;
  labelClassName?: string;
};

const inputClasses =
  "mt-2 min-h-12 w-full rounded-md border bg-white px-4 text-neutral-900 outline-none transition focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20";

export default function TextInput({
  "aria-describedby": ariaDescribedBy,
  className,
  containerClassName,
  error,
  id,
  label,
  labelClassName,
  ...props
}: TextInputProps) {
  const errorId = error && id ? `${id}-error` : undefined;
  const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(" ");
  const hasError = Boolean(error);
  const ariaInvalidProps = hasError
    ? ({
        "aria-invalid": "true",
      } as const)
    : {};

  return (
    <div className={containerClassName}>
      <label
        htmlFor={id}
        className={[
          "block text-sm font-semibold text-neutral-900",
          labelClassName ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {label}
      </label>
      {hasError ? (
        <input
          id={id}
          aria-describedby={describedBy || undefined}
          {...ariaInvalidProps}
          className={[inputClasses, "border-red-500", className ?? ""]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      ) : (
        <input
          id={id}
          aria-describedby={describedBy || undefined}
          className={[inputClasses, "border-neutral-300", className ?? ""]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
