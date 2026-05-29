import { AnimatedList } from "@/components/common/AnimatedList";
import type { RelationshipItem } from "../types/relationship.type";
import { RelationshipCard } from "./RelationshipCard";

interface RelationshipListProps {
  readonly relationships: RelationshipItem[];
  readonly targetUserId: number;
  readonly emptyMessage?: string;
  readonly innerScrollClassName?: string;
  readonly hasMore?: boolean;
  readonly loading?: boolean;
  readonly onLoadMore?: () => void;
  readonly onApprove?: (relationshipId: string, userName: string) => void;
  readonly onReject?: (relationshipId: string, userName: string) => void;
}

export function RelationshipList({
  relationships,
  targetUserId,
  emptyMessage = "Todavía no has establecido relaciones",
  innerScrollClassName,
  hasMore = false,
  loading = false,
  onLoadMore = () => {},
  onApprove,
  onReject,
}: RelationshipListProps) {
  return (
    <AnimatedList
      items={relationships}
      keyExtractor={(item) => item.codigo ?? String(item.relatedUser.id)}
      emptyMessage={emptyMessage}
      emptyContainerClassName="flex flex-col items-center justify-center py-20 text-text-muted"
      innerScrollClassName={innerScrollClassName}
      hasMore={hasMore}
      loading={loading}
      onLoadMore={onLoadMore}
      renderItem={(relationship, index) => (
        <RelationshipCard
          relationship={relationship}
          index={index}
          targetUserId={targetUserId}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}
    />
  );
}


