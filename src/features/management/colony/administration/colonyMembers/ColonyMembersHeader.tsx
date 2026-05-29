import { UserGroupIcon } from "@heroicons/react/24/solid";

interface ColonyMembersHeaderProps {
  readonly fullLocation: string;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly totalMembers: number;
}

export function ColonyMembersHeader({
  fullLocation,
  isLoading,
  error,
  totalMembers,
}: ColonyMembersHeaderProps) {
  const renderBadgeContent = () => {
    if (isLoading) {
      return (
        <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary animate-spin rounded-full" />
      );
    }

    if (error) {
      return <span className="text-accent-red font-bold text-lg">!</span>;
    }

    return (
      <span className="text-xl font-black text-secondary leading-none">
        {totalMembers}
      </span>
    );
  };

  return (
    <header className="px-6 pt-4 pb-4 border-b border-bg-border flex items-center justify-between bg-primary/5">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-11 h-11 bg-primary rounded-xl text-text-inverse shadow-inner flex items-center justify-center shrink-0">
          <UserGroupIcon className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-primary leading-tight mb-0.5">
            Miembros de Colonia
          </h2>
          <p className="text-sm text-text-muted wrap-break-word leading-relaxed line-clamp-2">
            {fullLocation}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-secondary/10 border border-secondary/20 w-11 h-11 rounded-xl shrink-0 shadow-sm">
        {renderBadgeContent()}
      </div>
    </header>
  );
}
