import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label: string;
};

const inputClasses =
  "mt-2 min-h-12 w-full rounded-md border bg-white px-4 text-neutral-900 outline-none transition focus:border-[--color-primary] focus:ring-2 focus:ring-[--color-primary]/20";

export default function TextInput({
  error,
  id,
  label,
  ...props
}: TextInputProps) {
  const errorId = error && id ? `${id}-error` : undefined;
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
        <input
          id={id}
          aria-invalid="true"
          aria-describedby={errorId}
          className={`${inputClasses} border-red-500`}
          {...props}
        />
      ) : (
        <input
          id={id}
          aria-invalid="false"
          className={`${inputClasses} border-neutral-300`}
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
