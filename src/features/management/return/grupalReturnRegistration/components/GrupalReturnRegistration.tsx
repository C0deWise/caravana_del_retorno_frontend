"use client";

import { useState, useEffect } from "react";
import { RequireAuth } from "@/auth/components/RequireAuth";
import { useAuth } from "@/auth/context/AuthContext";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import { useGrupo } from "../hooks/useGrupo.hook";
import { useGrupalMembersList } from "../hooks/useGrupalMemberList.hook";
import { useCancelGroup } from "../hooks/useCancelGroup.hook";
import { useSentInvitations } from "../sentInvitations/hooks/useSentInvitations.hook";
import { useRemoveMember } from "../invitateMembers/hooks/useRemoveMember.hook";
import { useRemoveExternalPerson } from "../externalPerson/hooks/useRemoveExternalPerson.hook";
import { InviteMemberModal } from "../invitateMembers/components/InviteMemberModal";
import { ExternalPersonModal } from "../externalPerson/components/ExternalPersonModal";
import { SentInvitationsList } from "../sentInvitations/components/SentInvitationsList";
import { GrupalRegistrationForm } from "../grupalRegistrationForm/components/GrupalRegistrationForm";
import { returnRegistrationService } from "../../returnRegistrationForm/services/returnRegistration.service";
import type { Retorno } from "../../types/retorno.types";
import Spinner from "@/components/feedback/Spinner";

type View = "main" | "form";

function GrupalReturnRegistrationFeature() {
  const { user } = useAuth();
  const [view, setView] = useState<View>("main");
  const [activeReturn, setActiveReturn] = useState<Retorno | null>(null);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [showInviteExternal, setShowInviteExternal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { grupo, isLoading: grupoLoading, error: grupoError } = useGrupo(user?.id);
  const { members, isLoading: membersLoading, refetch: refetchMembers } = useGrupalMembersList(grupo?.id);
  const { invitations, isLoading: invitationsLoading, error: invitationsError, hasPending, refetch: refetchInvitations } = useSentInvitations(grupo?.id);
  const { cancelGroup, isLoading: cancelling, error: cancelError } = useCancelGroup();
  const { removeMember, isLoading: removingMember } = useRemoveMember();
  const { removeExternalPerson, isLoading: removingExternal } = useRemoveExternalPerson();

  // Resolver retorno activo una sola vez
  useEffect(() => {
    returnRegistrationService.getActiveReturn().then(setActiveReturn).catch(() => setActiveReturn(null));
  }, []);

  const canEnroll = !hasPending && members.length >= 1;

  const handleRemoveMember = async (usuarioId: number) => {
    if (!grupo) return;
    await removeMember(usuarioId, grupo.id);
    void refetchMembers();
    void refetchInvitations();
  };

  const handleRemoveExternal = async (personaId: number) => {
    if (!grupo) return;
    await removeExternalPerson(personaId, grupo.id);
    void refetchMembers();
  };

  const handleCancelConfirm = async () => {
    if (!grupo) return;
    await cancelGroup(grupo.id);
    setShowCancelConfirm(false);
  };

  if (grupoLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (grupoError) {
    return (
      <div className="flex justify-center py-12">
        <div className="alert-error max-w-md">
          <p className="alert-error-text">{grupoError}</p>
        </div>
      </div>
    );
  }

  if (!grupo) {
    return (
      <div className="flex justify-center py-12">
        <div className="alert-error max-w-md">
          <p className="alert-error-text">No se encontró un grupo asociado.</p>
        </div>
      </div>
    );
  }

  if (view === "form" && activeReturn) {
    return (
      <div className="flex justify-center px-4 py-8">
        <GrupalRegistrationForm
          retornoId={activeReturn.codigo}
          grupoId={grupo.id}
          retornoAnio={activeReturn.anio}
          onSuccess={() => setView("main")}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Registro grupal</h1>
        <button
          type="button"
          className="btn-ghost text-accent-red text-sm"
          onClick={() => setShowCancelConfirm(true)}
          disabled={cancelling}
        >
          {cancelling ? <Spinner size="sm" /> : "Cancelar grupo"}
        </button>
      </div>

      {cancelError && (
        <div className="alert-error">
          <p className="alert-error-text">{cancelError}</p>
        </div>
      )}

      {/* Acciones de invitación */}
      <div className="flex gap-3">
        <button
          type="button"
          className="btn-secondary flex-1"
          onClick={() => setShowInviteMember(true)}
        >
          Invitar miembro
        </button>
        <button
          type="button"
          className="btn-secondary flex-1"
          onClick={() => setShowInviteExternal(true)}
        >
          Invitar persona externa
        </button>
      </div>

      {/* Invitaciones enviadas */}
      <section>
        <h2 className="section-title mb-3">Invitaciones enviadas</h2>
        <SentInvitationsList
          invitations={invitations}
          isLoading={invitationsLoading}
          error={invitationsError}
          onRemove={handleRemoveMember}
          isRemoving={removingMember}
        />
      </section>

      {/* Botón inscribir */}
      <div className="flex justify-end">
        {hasPending && (
          <p className="text-text-muted text-sm mr-4 self-center">
            Hay invitaciones pendientes de aceptar.
          </p>
        )}
        {members.length === 0 && !membersLoading && (
          <p className="text-text-muted text-sm mr-4 self-center">
            El grupo debe tener al menos un miembro.
          </p>
        )}
        <button
          type="button"
          className="btn-primary"
          disabled={!canEnroll || !activeReturn}
          onClick={() => setView("form")}
        >
          Inscribir grupo
        </button>
      </div>

      {/* Modales */}
      {grupo && (
        <>
          <InviteMemberModal
            isOpen={showInviteMember}
            onClose={() => setShowInviteMember(false)}
            grupoId={grupo.id}
            activeReturnCode={activeReturn?.codigo ?? null}
            currentMembers={members}
            onInviteSent={() => void refetchInvitations()}
          />

          <ExternalPersonModal
            isOpen={showInviteExternal}
            onClose={() => setShowInviteExternal(false)}
            grupoId={grupo.id}
            onPersonaAdded={() => void refetchMembers()}
          />
        </>
      )}

      <ConfirmModal
        isOpen={showCancelConfirm}
        title="¿Cancelar el grupo?"
        details={["Esta acción eliminará el grupo y desvinculará a todos sus miembros."]}
        onConfirm={handleCancelConfirm}
        onCancel={() => setShowCancelConfirm(false)}
        loading={cancelling}
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
      />
    </div>
  );
}

export default function GrupalReturnRegistration() {
  return (
    <RequireAuth roles={["usuario", "lider_colonia"]}>
      <GrupalReturnRegistrationFeature />
    </RequireAuth>
  );
}