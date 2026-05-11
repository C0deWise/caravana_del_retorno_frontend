import ListCard from "@/components/common/ListCard";
import { SolicitudMiembro } from "../../types/grupalReturnRegistration";
import { TrashIcon, UserIcon } from "@heroicons/react/24/outline";
import { StatusTag } from "@/components/common/StatusTag";

interface SentInvitationCardProps {
    readonly invitation: SolicitudMiembro;
    readonly index: number;
    readonly onRemove: (id: number) => void;
    readonly isRemoving?: boolean;
}

export function SentInvitationCard({ invitation, index, onRemove, isRemoving }: SentInvitationCardProps) {
    return (
        <ListCard
            index={index}
            icon={<UserIcon className="h-6 w-6 text-primary" />}
            badgeConfig={{
                show: invitation.estado === "Pendiente",
                color: "bg-secondary",
                title: "Invitación pendiente",
            }}
            title={
                <span className="text-text font-medium">{invitation.nombreUsuario} {invitation.apellidoUsuario}</span>
            }
            actions={
                <div className="flex items-center gap-2">
                    <StatusTag status={invitation.estado.toLowerCase()} />
                    <button
                        type="button"
                        className="btn-ghost text-accent-red hover:text-accent-red/80"
                        onClick={() => onRemove(invitation.usuarioId)}
                        disabled={isRemoving}
                        title="Eliminar del grupo"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            }
        />
    );
}