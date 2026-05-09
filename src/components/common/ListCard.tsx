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
}

export default function ListCard({
  index,
  icon,
  iconBadge,
  badgeConfig,
  title,
  subtitle,
  actions,
}: ListCardProps) {
  const finalBadge = iconBadge ?? (badgeConfig?.show ? (
    <span
      className="absolute -top-1.5 -right-1.5 flex h-4 w-4"
      title={badgeConfig.title}
    >
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${badgeConfig.color ?? "bg-secondary"} opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-4 w-4 ${badgeConfig.color ?? "bg-secondary"} border-2 border-bg`}></span>
    </span>
  ) : undefined);

  return (
    <div className="bg-bg border border-bg-border rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-row items-stretch">
      {/* Columna de Índice Estructural */}
      <div className="flex items-center justify-center w-14 md:w-16 bg-primary/5 border-r border-primary/20 shrink-0">
        <span className="text-xl font-bold text-primary/80 select-none">
          {index + 1}
        </span>
      </div>

      {/* Contenido Principal */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between flex-1 p-3 md:px-5 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 bg-linear-to-tl from-primary/90 to-secondary/90 rounded-xl flex items-center justify-center shadow-md shrink-0">
            {icon}
            {finalBadge}
          </div>
          <div>
            <h3 className="font-bold text-xl text-text">{title}</h3>
            {subtitle && (
              <div className="flex items-center text-sm text-text-muted mt-1">
                {typeof subtitle === "string" ? (
                  <span className="font-medium text-secondary">{subtitle}</span>
                ) : (
                  subtitle
                )}
              </div>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center justify-end gap-3 w-full md:w-auto mt-4 md:mt-0 border-t md:border-none pt-4 md:pt-0 border-bg-border">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
