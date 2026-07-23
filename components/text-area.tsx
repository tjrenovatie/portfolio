import type { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  containerClassName?: string;
  error?: string;
  helperText?: string;
  label: string;
  labelClassName?: string;
};

const textAreaClasses =
  "mt-2 w-full resize-y rounded-md border bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20";

export default function TextArea({
  "aria-describedby": ariaDescribedBy,
  className,
  containerClassName,
  error,
  helperText,
  id,
  label,
  labelClassName,
  ...props
}: TextAreaProps) {
  const errorId = error && id ? `${id}-error` : undefined;
  const helperId = helperText && id ? `${id}-help` : undefined;
  const describedBy = [ariaDescribedBy, helperId, errorId]
    .filter(Boolean)
    .join(" ");
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
        <textarea
          id={id}
          aria-describedby={describedBy || undefined}
          {...ariaInvalidProps}
          className={[textAreaClasses, "border-red-500", className ?? ""]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      ) : (
        <textarea
          id={id}
          aria-describedby={describedBy || undefined}
          className={[textAreaClasses, "border-neutral-300", className ?? ""]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
      )}
      {helperText && (
        <p id={helperId} className="mt-2 text-sm text-neutral-500">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
