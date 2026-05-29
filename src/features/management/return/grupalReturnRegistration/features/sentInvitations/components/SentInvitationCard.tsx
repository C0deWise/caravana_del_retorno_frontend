import ListCard from "@/components/common/ListCard";
import { EntradaInvitacion } from "../../../shared/types/grupalReturnRegistration";
import { TrashIcon, UserIcon } from "@heroicons/react/24/outline";
import { RequestStatusTag } from "@/features/management/components/RequestStatusTag";

interface SentInvitationCardProps {
    readonly invitation: EntradaInvitacion;
    readonly index: number;
}

export function SentInvitationCard({ invitation, index }: SentInvitationCardProps) {
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
                    <RequestStatusTag status={estado} />
                </div>
            }
        />
    );
}