import React, { useRef, useState } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { MarqueeText } from "@/components/common/MarqueeText";
import { FILE_SIZE_LIMITS, formatSize } from "../config/multimedia.constants";
import { AnimatedModal } from "@/components/feedback/AnimatedModal";
import { LocalMultimediaItem } from "../hooks/useLocalMultimedia";

interface MultimediaSelectionModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onFilesSelected: (files: FileList | File[]) => void;
  readonly items: LocalMultimediaItem[];
}

export function MultimediaSelectionModal({
  isOpen,
  onClose,
  onFilesSelected,
  items,
}: MultimediaSelectionModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [warningData, setWarningData] = useState<{ count: number; names: string } | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFilesArray = Array.from(files);
    const duplicates: string[] = [];

    const uniqueFiles = newFilesArray.filter((newFile) => {
      const isDuplicate = items.some(
        (existingItem) =>
          existingItem.name === newFile.name && existingItem.size === newFile.size
      );
      if (isDuplicate) duplicates.push(newFile.name);
      return !isDuplicate;
    });

    if (duplicates.length > 0) {
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      setWarningData({ count: duplicates.length, names: duplicates.join(", ") });
      warningTimeoutRef.current = setTimeout(() => setWarningData(null), 10000);
    } else {
      setWarningData(null);
    }

    if (uniqueFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      uniqueFiles.forEach((file) => dataTransfer.items.add(file));
      onFilesSelected(dataTransfer.files);
      onClose();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <AnimatedModal isOpen={isOpen} onBackdropClick={onClose} maxWidth="max-w-xl">
      <div className="w-full bg-bg rounded-2xl shadow-2xl border border-bg-border p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-bg-hover text-text-muted transition-colors"
          aria-label="Cerrar"
        >
          <XCircleIcon className="w-7 h-7 text-accent-red" />
        </button>

        <h3 className="text-xl font-bold text-primary mb-4">Seleccionar Archivos</h3>

        <section
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          aria-label="Zona de arrastre para archivos multimedia"
          className={`rounded-xl p-8 flex flex-col items-center justify-center relative border-2 transition-all ${isDragging
            ? "marching-ants bg-primary/10 shadow-lg border-transparent"
            : "border-dashed border-bg-border bg-bg-hover hover:border-primary/50"
            }`}
        >
          <p className="text-text-muted mb-4 text-center">
            Arrastra aquí tus archivos o usa el botón para seleccionarlos
          </p>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*"
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              if (e.target) e.target.value = "";
            }}
          />

          <button
            type="button"
            className="px-6 py-2.5 rounded-lg bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
            onClick={() => inputRef.current?.click()}
          >
            Examinar archivos
          </button>
        </section>

        <div className="flex flex-wrap justify-center gap-3 text-xs text-text-muted mt-4">
          <span>Imágenes: hasta {formatSize(FILE_SIZE_LIMITS.image)}</span>
          <span>•</span>
          <span>Audios: hasta {formatSize(FILE_SIZE_LIMITS.audio)}</span>
          <span>•</span>
          <span>Videos: hasta {formatSize(FILE_SIZE_LIMITS.video)}</span>
        </div>

        {warningData && (
          <div className="mt-4 flex flex-col text-center p-3 rounded-lg bg-secondary/10 text-secondary border border-secondary/20 text-sm font-medium">
            {warningData.count === 1 ? (
              <>
                <span>El archivo</span>
                <div className="w-full min-w-0 italic overflow-hidden my-0.5">
                  <MarqueeText text={`"${warningData.names}"`} speed={30} />
                </div>
                <span>ya está seleccionado.</span>
              </>
            ) : (
              <>
                <span>Se omitieron {warningData.count} archivos:</span>
                <div className="w-full min-w-0 italic overflow-hidden my-0.5">
                  <MarqueeText text={warningData.names} speed={30} />
                </div>
                <span>que ya estaban seleccionados.</span>
              </>
            )}
          </div>
        )}
      </div>
    </AnimatedModal>
  );
}
