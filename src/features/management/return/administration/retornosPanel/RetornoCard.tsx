"use client";

import { useState, useEffect } from "react";
import { ArrowPathIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";
import type { Retorno } from "@/types/retorno.types";
import ListCard from "@/components/common/ListCard";
import { useUpdateReturnState } from "../../hooks/useUpdateReturnState";
import { ConfirmModal } from "@/components/feedback/confirmModal";
import { useToast } from "@/components/feedback/Toast";
import { ConfiguredTag, type TagConfigRecord } from "@/components/common/Tag";
import { GenerateReportButton } from "@/features/management/reports/generateReports/components/GenerateReportButton";

interface RetornoCardProps {
  readonly retorno: Retorno;
  readonly index: number;
  readonly onRefresh: () => void;
}

export function RetornoCard({ retorno, index, onRefresh }: RetornoCardProps) {
  const { updateState, loading, error } = useUpdateReturnState();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { showToast } = useToast();

  const STATUS_CONFIG: TagConfigRecord<string> = {
    activo: { label: "Activo", color: "accent-green" },
    en_curso: { label: "En Curso", color: "accent-yellow" },
    finalizado: { label: "Finalizado", color: "accent-red" },
  };

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  const getNextState = (currentState: string) => {
    const state = currentState.toLowerCase();
    if (state === "activo") return "en_curso";
    if (state === "en_curso") return "finalizado";
    return null;
  };

  const nextState = getNextState(retorno.estado);

  const getBadgeConfig = () => {
    const state = retorno.estado.toLowerCase();
    switch (state) {
      case "activo":
        return { show: true, color: "bg-accent-green" };
      case "en_curso":
        return { show: true, color: "bg-accent-yellow" };
      case "finalizado":
        return { show: false };
      default:
        return { show: false };
    }
  };

  const handleOpenConfirm = () => {
    if (!nextState) return;
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (!nextState) return;
    const success = await updateState(retorno.codigo, nextState);
    setShowConfirmModal(false);
    if (success) {
      showToast(`El retorno ${retorno.anio} ahora está en estado ${nextState}.`, "success");
      onRefresh();
    }
  };

  return (
    <>
      <ListCard
        index={index}
        icon={<CalendarDaysIcon className="w-7 h-7 text-text-inverse" />}
        badgeConfig={getBadgeConfig()}
        title={`Retorno ${retorno.anio}`}
        subtitle={<ConfiguredTag value={retorno.estado} config={STATUS_CONFIG} />}
        actions={
          <div className="flex gap-3">
            <GenerateReportButton retornoId={retorno.codigo} retornoAnio={retorno.anio} />
            {nextState ? (
              <button
                onClick={handleOpenConfirm}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-text-inverse hover:opacity-90 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                title={`Cambiar estado a ${nextState}`}
              >
                <ArrowPathIcon className="w-5 h-5" />
                <span>Modificar Estado</span>
              </button>
            ) : null}
          </div>
        }
      />

      {showConfirmModal && nextState && (
        <ConfirmModal
          isOpen={showConfirmModal}
          title="Modificar Estado del Retorno"
          details={[
            <span key="confirm-msg" className="block text-left space-y-4">
              <span>
                ¿Estás seguro de cambiar el estado del retorno <strong>{retorno.anio}</strong> de{" "}
                <strong>{retorno.estado.toUpperCase().replace("_", " ")}</strong> a{" "}
                <strong>{nextState.toUpperCase().replace("_", " ")}</strong>?
              </span>
              <span className="block pl-5 relative before:content-['•'] before:absolute before:left-1 font-medium text-danger">
                Esta acción NO se puede deshacer.
              </span>
            </span>
          ]}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmModal(false)}
          loading={loading}
          confirmLabel="Confirmar Cambio"
          cancelLabel="Cancelar"
        />
      )}
    </>
  );
}
