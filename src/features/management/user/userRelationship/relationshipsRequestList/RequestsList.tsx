import { useState } from "react";
import { SliderPill } from "@/components/layout/SliderPill";
import { RelationshipItem } from "../types/relationship.type";
import { RelationshipList } from "../components/RelationshipList";

interface RequestsListProps {
  readonly receivedRequests: RelationshipItem[];
  readonly sentRequests: RelationshipItem[];
  readonly targetUserId: number;
  readonly hasMore: boolean;
  readonly loading: boolean;
  readonly onLoadMore: () => void;
}

export function RequestsList({
  receivedRequests,
  sentRequests,
  targetUserId,
  hasMore,
  loading,
  onLoadMore,
}: RequestsListProps) {
  const [activeRequestTab, setActiveRequestTab] = useState<"received" | "sent">(
    "received",
  );

  return (
    <section className="flex-1 min-w-0 flex flex-col rounded-2xl border border-bg-border bg-bg shadow-sm overflow-hidden">
      <header className="shrink-0 flex flex-col xl:flex-row items-start xl:items-center justify-between px-6 py-4 gap-6 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-primary">
            Solicitudes de Parentesco
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Gestiona las invitaciones enviadas y recibidas
          </p>
        </div>

        <div className="relative flex w-full xl:w-72 overflow-hidden rounded-xl border border-bg-border bg-bg-card p-1 shadow-inner shrink-0">
          <SliderPill
            activeValue={activeRequestTab}
            firstValue="received"
            className="absolute bottom-1 top-1 rounded-lg bg-bg shadow-sm"
          />
          <button
            onClick={() => setActiveRequestTab("received")}
            className={`relative z-10 flex-1 rounded-lg py-2 text-sm font-bold transition-colors duration-300 ${
              activeRequestTab === "received"
                ? "text-primary"
                : "text-text-muted hover:text"
            }`}
          >
            Recibidas ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveRequestTab("sent")}
            className={`relative z-10 flex-1 rounded-lg py-2 text-sm font-bold transition-colors duration-300 ${
              activeRequestTab === "sent"
                ? "text-primary"
                : "text-text-muted hover:text"
            }`}
          >
            Enviadas ({sentRequests.length})
          </button>
        </div>
      </header>

      <RelationshipList
        relationships={activeRequestTab === "received" ? receivedRequests : sentRequests}
        targetUserId={targetUserId}
        emptyMessage={
          activeRequestTab === "received"
            ? "No has recibido solicitudes de parentesco"
            : "No has enviado solicitudes de parentesco"
        }
        innerScrollClassName="px-6 lg:px-8 pb-6 lg:pb-8 pt-4"
        hasMore={hasMore}
        loading={loading}
        onLoadMore={onLoadMore}
      />
    </section>
  );
}
