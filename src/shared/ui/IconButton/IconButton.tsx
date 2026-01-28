import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
  ariaLabel?: string;
  active?: boolean;
  danger?: boolean;
  children: React.ReactNode;
};

export function IconButton({
  title,
  ariaLabel,
  active = false,
  danger = false,
  className,
  children,
  ...rest
}: Props) {
  const cls = [
    "wcc-icon-btn",
    active ? "is-active" : "",
    danger ? "is-danger" : "",
    className ?? "",
  ].join(" ").trim();

  const resolvedAriaLabel = ariaLabel ?? rest["aria-label"] ?? title;

  return (
    <button
      type="button"
      className={cls}
      title={title}
      aria-label={resolvedAriaLabel}
      {...rest}
    >
      {children}
    </button>
  );
}
