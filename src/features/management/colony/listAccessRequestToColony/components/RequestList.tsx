"use client"

import { useMemo } from "react";
import { Request } from "../types/request.types"
import { RequestsCard } from "./RequestsCard";

interface RequestListProps {
    onApprove: (request: Request) => void;
    onReject: (request: Request) => void;
    requests: Request[];
}

export function RequestList({ onApprove, onReject, requests }: RequestListProps) {
    const sortedRequests = useMemo(() => {
        return [...requests].sort((a, b) => {
            const aIsPending = a.requestStatus.trim().toLowerCase() === "pendiente";
            const bIsPending = b.requestStatus.trim().toLowerCase() === "pendiente";

            if (aIsPending === bIsPending) {
                return 0;
            }

            return aIsPending ? -1 : 1;
        });
    }, [requests]);

    if (requests.length === 0) {
        return (
            <div className="text-center py-20">
                <h3 className="text-xl font-bold text-text mb-2">
                    No hay solicitudes de ingreso para esta colonia
                </h3>
                <p className="text-text-muted">Esta colonia no tiene solicitudes de ingreso aún.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            {sortedRequests.map((request, index) => (
                <RequestsCard
                    key={request.requestId}
                    request={request}
                    index={index}
                    onApprove={onApprove}
                    onReject={onReject}
                />
            ))}
        </div>
    );
}