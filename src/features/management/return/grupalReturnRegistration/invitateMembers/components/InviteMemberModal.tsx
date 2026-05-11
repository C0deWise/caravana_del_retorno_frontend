"use client"

import { useState } from "react";
import { MiembroGrupo } from "../../types/grupalReturnRegistration";
import { UserSearchResult } from "@/types/user.types";
import { useInviteMember } from "../hooks/useInviteMember.hook";
import { AnimatedModal } from "@/components/feedback/AnimatedModal";
import { UserSearchField } from "@/components/forms/UserSearchField";
import Spinner from "@/components/feedback/Spinner";

interface InviteModalProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
    readonly grupoId: number;
    readonly activeReturnCode: number;
    readonly currentMembers: MiembroGrupo[];
    readonly onInviteSent: () => void;
}

export function InviteMemberModal({
    isOpen,
    onClose, 
    grupoId,
    activeReturnCode,
    currentMembers,
    onInviteSent,
}: InviteModalProps) {
    const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { inviteMember, isLoading, errorMessage, reset } = useInviteMember(currentMembers);

    const handleClose = () => {
        setSelectedUser(null);
        setSuccessMessage(null);
        reset();
        onClose();
    };

    const handleSelect = (user: UserSearchResult) => {
        setSelectedUser(user);
        setSuccessMessage(null);
        reset();
    };

    const handleConfirm = async () => {
        if (!selectedUser) return;
        const success = await inviteMember(selectedUser, grupoId, activeReturnCode);
        if (success) {
            setSuccessMessage(`Invitación enviada a ${selectedUser.nombre} ${selectedUser.apellido}`);
            setSelectedUser(null);
            onInviteSent();
        }
    };

    return (
        <AnimatedModal
            isOpen={isOpen}
            onBackdropClick={handleClose}
            maxWidth="max-w-lg"    
        >

            <div className="rounded-2xl bg-bg-card p-6 shadow-xl w-full">
                <h2 className="section-title mb-4">Invitar miembros</h2>

                <UserSearchField 
                    variant="autocomplete"
                    label="Buscar usuario de la colonia"
                    onSelect={handleSelect}
                />

                {selectedUser && (
                    <div className="mt-4 rounded-xl border border-bg-border bg-bg p-4">
                        <p className="text-text font-medium">{selectedUser.nombre} {selectedUser.apellido}</p>
                        <p className="text-text-muted text-sm">{selectedUser.documento}</p>
                    </div>
                )}

                {errorMessage && (
                    <div className="alert-error mt-4">
                        <p className="alert-error-text">{errorMessage}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="alert-success mt-4">
                        <p className="alert-success-text">{successMessage}</p>
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        className="btn-primary"
                        onClick={handleConfirm}
                        disabled={!selectedUser || isLoading}
                    >
                        {isLoading ? <Spinner size="sm" /> : "Enviar invitación"}
                    </button>
                </div>
            </div>
        </AnimatedModal>
    );
}