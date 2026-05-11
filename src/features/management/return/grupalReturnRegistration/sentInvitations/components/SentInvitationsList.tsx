import Spinner from "@/components/feedback/Spinner";
import { SolicitudMiembro } from "../../types/grupalReturnRegistration";
import { SentInvitationCard } from "./SentInvitationCard";

const VISIBLE_STATES = new Set<SolicitudMiembro["estado"]>(["Pendiente", "Aceptada"]);

interface SentInvitationsListProps {
    readonly invitations: SolicitudMiembro[];
    readonly isLoading: boolean;
    readonly error: string | null;
    readonly onRemove: (usuarioId: number) => void;
    readonly isRemoving?: boolean;
}

export function SentInvitationsList({
    invitations,
    isLoading,
    error,
    onRemove,
    isRemoving,
}: SentInvitationsListProps) {
    const visible = invitations.filter((inv) => VISIBLE_STATES.has(inv.estado));

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Spinner size="md" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert-error">
                <p className="alert-error-text">{error}</p>
            </div>
        );
    }

    if (visible.length === 0) {
        return (
            <p className="text-text-muted text-sm text-center py-4">
                No hay invitaciones enviadas aún.
            </p>
        );
    }

    return (
        <ul className="space-y-3">
            {visible.map((inv, i) => (
                <li key={inv.id}>
                    <SentInvitationCard 
                        invitation={inv} 
                        index={i + 1}
                        onRemove={onRemove}
                        isRemoving={isRemoving}    
                    />
                </li>
            ))}
        </ul>
    );
}