"use client";

import { ReactNode } from "react";

export interface ListCardProps {
  readonly index: number;
  readonly icon: ReactNode;
  readonly iconBadge?: ReactNode;
  readonly badgeConfig?: {
    readonly color?: string;
    readonly title?: string;
    readonly show?: boolean;
  };
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
  readonly actions?: ReactNode;
  readonly showIndex?: boolean;
}

export default function ListCard({
  index,
  icon,
  iconBadge,
  badgeConfig,
  title,
  subtitle,
  actions,
  showIndex = true,
}: ListCardProps) {
  const finalBadge =
    iconBadge ??
    (badgeConfig?.show ? (
      <span
        className="absolute -top-1.5 -right-1.5 flex h-4 w-4"
        title={badgeConfig.title}
      >
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${badgeConfig.color ?? "bg-secondary"} opacity-75`}
        />
        <span
          className={`relative inline-flex h-4 w-4 rounded-full border-2 border-bg ${badgeConfig.color ?? "bg-secondary"}`}
        />
      </span>
    ) : undefined);

  return (
    <div className="flex items-stretch overflow-hidden rounded-2xl border border-bg-border bg-bg shadow-sm transition-shadow hover:shadow-md">
      {showIndex && (
        <div className="flex w-14 shrink-0 items-center justify-center border-r border-primary/20 bg-primary/5 md:w-16">
          <span className="select-none text-xl font-bold text-primary/80">
            {index + 1}
          </span>
        </div>
      )}

      <div className="flex min-w-0 flex-1 items-center gap-4 py-3 px-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-tl from-primary/90 to-secondary/90 shadow-md">
          {icon}
          {finalBadge}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-text">{title}</h3>
          </div>

          {subtitle && (
            <div className="mt-1 shrink-0 text-sm text-text-muted">
              {typeof subtitle === "string" ? (
                <span className="font-medium text-secondary">{subtitle}</span>
              ) : (
                subtitle
              )}
            </div>
          )}
        </div>

        {actions && (
          <div className="ml-auto flex shrink-0 items-center justify-end gap-3 whitespace-nowrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
