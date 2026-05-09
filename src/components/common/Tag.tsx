import { ReactNode } from "react";

export interface TagProps {
  readonly label: string;
  readonly className?: string;
  readonly icon?: ReactNode;
}

export function Tag({ label, className = "", icon }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}
