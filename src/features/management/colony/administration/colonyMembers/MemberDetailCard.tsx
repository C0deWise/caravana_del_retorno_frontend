import { ReactNode, ComponentType } from "react";
import { CopyableAction } from "@/components/common/CopyableAction";

interface MemberDetailCardProps {
  readonly label: string;
  readonly value: string | null | undefined;
  readonly icon: ComponentType<{ className?: string }>;
  readonly copyValue?: string | null;
  readonly fullWidth?: boolean;
  readonly children?: ReactNode;
}

export function MemberDetailCard({
  label,
  value,
  icon: Icon,
  copyValue,
  fullWidth = false,
  children,
}: MemberDetailCardProps) {
  const content = children || value || "N/A";

  return (
    <div className={`flex flex-col gap-1 bg-bg/50 p-2 rounded-lg border border-bg-border/50 ${fullWidth ? "col-span-2" : ""}`}>
      <p className="text-[9px] font-bold text-text-muted uppercase leading-none mb-0.5">{label}</p>
      {copyValue ? (
        <CopyableAction 
          valueToCopy={copyValue} 
          icon={Icon}
          iconClassName="w-4 h-4 text-primary/60 shrink-0"
          contentClassName="text-xs font-semibold text-text truncate max-w-full"
        >
          {content}
        </CopyableAction>
      ) : (
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary/60 shrink-0" />
          <span className="text-xs font-semibold text-text truncate capitalize">{content}</span>
        </div>
      )}
    </div>
  );
}
