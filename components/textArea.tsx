import type { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  helperText?: string;
  label: string;
};

const textAreaClasses =
  "mt-2 w-full resize-y rounded-md border bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20";

export default function TextArea({
  error,
  helperText,
  id,
  label,
  ...props
}: TextAreaProps) {
  const errorId = error && id ? `${id}-error` : undefined;
  const helperId = helperText && id ? `${id}-help` : undefined;
  const hasError = Boolean(error);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-neutral-900"
      >
        {label}
      </label>
      {hasError ? (
        <textarea
          id={id}
          aria-invalid="true"
          aria-describedby={errorId}
          className={`${textAreaClasses} border-red-500`}
          {...props}
        />
      ) : (
        <textarea
          id={id}
          aria-invalid="false"
          aria-describedby={helperId}
          className={`${textAreaClasses} border-neutral-300`}
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
