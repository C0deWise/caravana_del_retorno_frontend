import ListCard from "@/components/common/ListCard";
import { EntradaInvitacion } from "../../types/grupalReturnRegistration";
import { TrashIcon, UserIcon } from "@heroicons/react/24/outline";
import { StatusTag } from "@/components/common/StatusTag";

interface SentInvitationCardProps {
    readonly invitation: EntradaInvitacion;
    readonly index: number;
    readonly onRemove: (id: number, kind: "usuario" | "persona") => void;
    readonly isRemoving?: boolean;
}

export function SentInvitationCard({ invitation, index, onRemove, isRemoving }: SentInvitationCardProps) {
    const isUsuario = invitation.kind === "usuario";
    const title = isUsuario
        ? invitation.data.correo_usuario
        : `${invitation.data.pe_nombre} ${invitation.data.pe_apellido}`;
    const estado = isUsuario ? invitation.data.estado.toLowerCase() : "externo";
    const removeId = isUsuario ? invitation.data.usuario_id : invitation.data.pe_codigo;

    return (
        <ListCard
            index={index}
            icon={<UserIcon className="h-6 w-6 text-primary" />}
            badgeConfig={{
                show: isUsuario && invitation.data.estado.toLowerCase() === "pendiente",
                color: "bg-secondary",
                title: "Invitación pendiente",
            }}
            title={
                <span className="text-text font-medium">{title}</span>
            }
            actions={
                <div className="flex items-center gap-2">
                    <StatusTag status={estado} />
                    <button
                        type="button"
                        className="btn-ghost text-accent-red hover:text-accent-red/80"
                        onClick={() => onRemove(removeId, invitation.kind)}
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