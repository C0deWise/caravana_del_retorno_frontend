import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface RelationshipActionsProps {
  readonly showActions: boolean;
  readonly isPending: boolean;
  readonly codigo?: string;
  readonly displayUserName: string;
  readonly onApprove?: (relationshipId: string) => void;
  readonly onReject?: (relationshipId: string) => void;
}

export function RelationshipActions({
  showActions,
  isPending,
  codigo,
  displayUserName,
  onApprove,
  onReject,
}: RelationshipActionsProps) {
  if (showActions) {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => codigo && onApprove?.(codigo)}
          className="flex w-[130px] items-center justify-center gap-2 rounded-xl bg-accent-green px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          aria-label={`Aceptar solicitud de parentesco con ${displayUserName}`}
        >
          <CheckIcon className="h-5 w-5" />
          Aceptar
        </button>

        <button
          type="button"
          onClick={() => codigo && onReject?.(codigo)}
          className="flex w-[130px] items-center justify-center gap-2 rounded-xl bg-accent-red px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:opacity-90 active:scale-95 cursor-pointer"
          aria-label={`Rechazar solicitud de parentesco con ${displayUserName}`}
        >
          <XMarkIcon className="h-5 w-5" />
          Rechazar
        </button>
      </div>
    );
  }

  if (!isPending) return null;

  return (
    <p className="text-sm font-medium text-text-muted italic">
      Solicitud enviada
    </p>
  );
}
