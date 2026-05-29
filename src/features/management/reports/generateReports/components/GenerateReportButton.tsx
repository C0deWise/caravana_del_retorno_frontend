"use client";

import { useState } from "react";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { AnimatedModal } from "@/components/feedback/AnimatedModal";
import { GenerateReportModalForm } from "./GenerateReportModalForm";

interface GenerateReportButtonProps {
    readonly retornoId: number;
    readonly retornoAnio: number;
}

export function GenerateReportButton({ retornoId, retornoAnio }: GenerateReportButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-text-inverse hover:opacity-90 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                title={`Generar Reporte - Retorno ${retornoAnio}`}
            >
                <DocumentTextIcon className="w-5 h-5" />
                <span>Reportes</span>
            </button>

            <AnimatedModal isOpen={isModalOpen} onBackdropClick={handleClose}>
                <div className="w-[90vw] max-w-3xl">
                    <GenerateReportModalForm 
                        retornoId={retornoId} 
                        retornoAnio={retornoAnio} 
                        onCancel={handleClose} 
                    />
                </div>
            </AnimatedModal>
        </>
    );
}
