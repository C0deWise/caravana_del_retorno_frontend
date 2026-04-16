"use client"

import { CheckIcon, XMarkIcon, BellIcon } from "@heroicons/react/24/outline";
import { Request } from "../types/request.types";

interface RequestsCardProps {
    request: Request;
    index: number;
    onApprove: (request: Request) => void;
    onReject: (request: Request) => void;
}

export function RequestsCard({ request, index, onApprove, onReject }: RequestsCardProps) {
    const normalizedStatus = request.requestStatus.trim().toLowerCase();
    const isPending = normalizedStatus === "pendiente";

    const getStatusConfig = (status: string) => {
        if (status === "aceptado") {
            return {
                label: "Aceptada",
                badgeClass: "bg-accent-green/20 text-accent-green",
            };
        }

        if (status === "rechazado") {
            return {
                label: "Rechazada",
                badgeClass: "bg-accent-red/15 text-accent-red",
            };
        }

        if (status === "expirado") {
            return {
                label: "Expirada",
                badgeClass: "bg-text-muted/15 text-text-muted",
            };
        }

        return {
            label: "Pendiente",
            badgeClass: "bg-secondary/15 text-secondary",
        };
    };

    const formatDate = (dateString: string) => {
        if (!dateString) {
            return "—";
        }

        return new Date(dateString).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    };

    const { label, badgeClass } = getStatusConfig(normalizedStatus);

    return (
        <div
            className={`border rounded-4xl p-6 shadow-sm ${
                isPending
                    ? "bg-bg border-gray-100"
                    : "bg-bg-card border-gray-200"
            }`}
        >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <span className="text-lg font-mono text-text-muted w-6 text-center shrink-0">
                        {index + 1}
                    </span>

                    <div className="w-14 h-14 bg-linear-to-tl from-primary/90 to-secondary/90 rounded-xl flex items-center justify-center shadow-md shrink-0">
                        <span className="text-white font-bold text-xl">
                            <BellIcon className="w-6 h-6" />
                        </span>
                    </div>

                    <div>
                        <h3 className="font-bold text-xl text-text">
                            {request.user.nombre} {request.user.apellido}
                        </h3>
                        <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-1 ${badgeClass}`}
                        >
                            {label}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                    <div>
                        <p className="text-sm text-text-muted">
                            Solicitud #{request.requestId}
                        </p>
                        <p className="text-sm text-text-muted">
                            Contacto: {request.user.celular}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-text-muted">
                            {formatDate(request.createdAt)}
                        </p>
                    </div>
                    {isPending && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => onApprove(request)}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-accent-green/15 text-accent-green hover:bg-accent-green/25 transition-colors"
                                aria-label={`Aprobar solicitud ${request.requestId}`}
                            >
                                <CheckIcon className="w-5 h-5" />
                                Aprobar
                            </button>

                            <button
                                type="button"
                                onClick={() => onReject(request)}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-accent-red/10 text-accent-red hover:bg-accent-red/20 transition-colors"
                                aria-label={`Rechazar solicitud ${request.requestId}`}
                            >
                                <XMarkIcon className="w-5 h-5" />
                                Rechazar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

