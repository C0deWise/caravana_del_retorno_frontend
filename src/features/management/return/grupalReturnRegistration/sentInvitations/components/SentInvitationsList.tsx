import Spinner from "@/components/feedback/Spinner";
import { EntradaInvitacion } from "../../types/grupalReturnRegistration";
import { SentInvitationCard } from "./SentInvitationCard";

const VISIBLE_MEMBER_STATES = new Set<string>(["pendiente", "aceptado"]);

interface SentInvitationsListProps {
    readonly invitations: EntradaInvitacion[];
    readonly isLoading: boolean;
    readonly error: string | null;
    readonly onRemove: (id: number, kind: "usuario" | "persona") => void;
    readonly isRemoving?: boolean;
}

export function SentInvitationsList({
    invitations,
    isLoading,
    error,
    onRemove,
    isRemoving,
}: SentInvitationsListProps) {
    const visible = invitations.filter((inv) =>
        inv.kind === "persona" || VISIBLE_MEMBER_STATES.has(inv.data.estado.toLowerCase())
    );

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
                <li key={inv.kind === "usuario" ? inv.data.id : `persona-${inv.data.pe_codigo}`}>
                    <SentInvitationCard 
                        invitation={inv} 
                        index={i}
                        onRemove={onRemove}
                        isRemoving={isRemoving}    
                    />
                </li>
            ))}
        </ul>
    );
}