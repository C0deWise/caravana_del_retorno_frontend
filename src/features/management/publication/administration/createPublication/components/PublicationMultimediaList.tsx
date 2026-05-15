import { useState } from "react";
import { ExpandableContent } from "@/components/layout/ExpandableContent";
import { LocalMultimediaItem } from "../hooks/useLocalMultimedia";
import { MultimediaCard, MultimediaCardUploadState } from "./MultimediaCard";

interface PublicationMultimediaListProps {
  readonly items: LocalMultimediaItem[];
  readonly remove: (id: string) => void;
  readonly uploadStates?: Record<string, MultimediaCardUploadState>;
  readonly removeState?: (id: string) => void;
  readonly retryFile?: (item: LocalMultimediaItem, allItems: LocalMultimediaItem[], onAllComplete?: () => void) => void;
  readonly onCompleteSuccess?: () => void;
}

export function PublicationMultimediaList({
  items,
  remove,
  uploadStates,
  removeState,
  retryFile,
  onCompleteSuccess,
}: PublicationMultimediaListProps) {
  const [deletedItems, setDeletedItems] = useState<Set<string>>(new Set());

  const handleRemoveFile = (id: string) => {
    setDeletedItems((prev) => new Set(prev).add(id));
    setTimeout(() => {
      remove(id);
      if (removeState) removeState(id);
    }, 500);
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto pr-2 rounded-lg bg-bg-card p-2 border border-bg-border">
      {items.map((it) => (
        <ExpandableContent
          key={it.id}
          isOpen={!deletedItems.has(it.id)}
          className=""
          spacing="2"
        >
          <MultimediaCard
            id={it.id}
            name={it.name}
            size={it.size}
            type={it.type}
            dataUrl={it.dataUrl}
            upload={uploadStates?.[it.id] || { status: "idle", progress: 0 }}
            isLeaving={deletedItems.has(it.id)}
            allowRetry={!!retryFile}
            onRemove={handleRemoveFile}
            onRetry={() => retryFile?.(it, items, onCompleteSuccess)}
          />
        </ExpandableContent>
      ))}
    </div>
  );
}
