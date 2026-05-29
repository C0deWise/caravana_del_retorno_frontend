"use client";

import type { ComponentType, ReactNode } from "react";

interface CopyableActionProps {
  readonly valueToCopy?: string | null;
  readonly children: ReactNode;
  readonly icon?: ComponentType<{ className?: string }>;
  readonly title?: string;
  readonly disabled?: boolean;
  readonly fallback?: ReactNode;
  readonly className?: string;
  readonly buttonClassName?: string;
  readonly contentClassName?: string;
  readonly iconClassName?: string;
  readonly onCopy?: (value: string) => void;
}

export function CopyableAction({
  valueToCopy,
  children,
  icon: Icon,
  title = "Copiar",
  disabled = false,
  fallback = null,
  className = "",
  buttonClassName = "",
  contentClassName = "",
  iconClassName = "",
  onCopy,
}: CopyableActionProps) {
  const canCopy = Boolean(valueToCopy) && !disabled;

  const handleCopy = async () => {
    if (!valueToCopy || disabled) return;

    await navigator.clipboard.writeText(valueToCopy);
    onCopy?.(valueToCopy);
  };

  if (!canCopy) {
    if (fallback !== null) {
      return <div className={className}>{fallback}</div>;
    }

    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          {Icon ? (
            <Icon
              className={iconClassName || "h-5 w-5 shrink-0 text-text-muted"}
            />
          ) : null}
          <span className={contentClassName}>—</span>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={() => void handleCopy()}
      className={[
        "group inline-flex items-center gap-2 rounded bg-transparent p-0 text-left",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
        buttonClassName,
      ].join(" ")}
    >
      {Icon ? (
        <Icon
          className={
            iconClassName ||
            "h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-primary"
          }
        />
      ) : null}

      <span
        className={
          contentClassName || "transition-colors group-hover:text-primary"
        }
      >
        {children}
      </span>
    </button>
  );
}
