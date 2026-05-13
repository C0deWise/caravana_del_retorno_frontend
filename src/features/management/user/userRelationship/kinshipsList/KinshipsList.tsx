import { RelationshipItem } from "../types/relationship.type";
import { RelationshipList } from "../components/RelationshipList";

interface KinshipsListProps {
  readonly relationships: RelationshipItem[];
  readonly targetUserId: number;
  readonly hasMore: boolean;
  readonly loading: boolean;
  readonly onLoadMore: () => void;
}

export function KinshipsList({
  relationships,
  targetUserId,
  hasMore,
  loading,
  onLoadMore,
}: KinshipsListProps) {
  return (
    <section className="flex flex-col rounded-2xl border border-bg-border bg-bg-card shadow-sm shrink-0 overflow-hidden w-full lg:w-1/3 lg:min-w-[400px] xl:min-w-[450px]">
      <header className="shrink-0 flex items-start justify-between px-6 py-4 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-primary">Mis Parentescos</h2>
          <p className="text-sm text-text-muted mt-1">
            Familiares confirmados
          </p>
        </div>
      </header>

      <RelationshipList
        relationships={relationships}
        targetUserId={targetUserId}
        emptyMessage="No tienes parentescos registrados"
        innerScrollClassName="px-6 pb-6 pt-4"
        hasMore={hasMore}
        loading={loading}
        onLoadMore={onLoadMore}
      />
    </section>
  );
}
