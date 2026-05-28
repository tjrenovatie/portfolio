import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "dark" | "primary" | "secondary";

type BaseButtonProps = {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  variant?: ButtonVariant;
};

type ButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonLinkProps = BaseButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors";

const variantClasses: Record<ButtonVariant, string> = {
  dark: "bg-black text-white hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-60",
  primary:
    "bg-[--color-primary] text-white hover:bg-[--color-secondary] hover:text-white disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "border border-neutral-300 text-neutral-900 hover:border-[--color-primary] hover:text-[--color-secondary]",
};

function getButtonClasses({
  className,
  fullWidth,
  variant = "primary",
}: Pick<BaseButtonProps, "className" | "fullWidth" | "variant">) {
  return [
    baseClasses,
    variantClasses[variant],
    fullWidth ? "w-full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  children,
  className,
  fullWidth,
  icon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={getButtonClasses({ className, fullWidth, variant })}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  fullWidth,
  href,
  icon,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={getButtonClasses({ className, fullWidth, variant })}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}
