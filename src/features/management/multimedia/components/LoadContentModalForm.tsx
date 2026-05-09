"use client";

import React, { useRef, useState } from "react";
import { ExpandableContent } from "@/components/layout/ExpandableContent";
import { useLocalMultimedia } from "../hooks/useLocalMultimedia";
import { useUploadMultimedia } from "../hooks/useUploadMultimedia";
import { MultimediaCard } from "./MultimediaCard";
import { MarqueeText } from "@/components/common/MarqueeText";
import { FILE_SIZE_LIMITS, formatSize } from "../config/multimedia.constants";

interface LoadContentModalFormProps {
  readonly onSuccess: () => void;
  readonly onCancel: () => void;
}

export default function LoadContentModalForm({
  onSuccess,
  onCancel,
}: LoadContentModalFormProps) {
  const {
    items,
    addFiles,
    remove,
    clear,
    error: localError,
  } = useLocalMultimedia();
  const {
    uploadStates,
    isUploading,
    uploadAllFiles,
    retryFile,
    resetStates,
    removeState,
  } = useUploadMultimedia();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [deletedItems, setDeletedItems] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);

  const [warningData, setWarningData] = useState<{
    count: number;
    names: string;
  } | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onFilesSelected = (files: FileList | null) => {
    if (!files) return;

    const newFilesArray = Array.from(files);
    const duplicates: string[] = [];

    const uniqueFiles = newFilesArray.filter((newFile) => {
      const isDuplicate = items.some(
        (existingItem) =>
          existingItem.name === newFile.name &&
          existingItem.size === newFile.size,
      );

      if (isDuplicate) duplicates.push(newFile.name);
      return !isDuplicate;
    });

    if (duplicates.length > 0) {
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

      setWarningData({
        count: duplicates.length,
        names: duplicates.join(", "),
      });

      warningTimeoutRef.current = setTimeout(() => {
        setWarningData(null);
      }, 10000);
    } else {
      setWarningData(null);
    }

    if (uniqueFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      uniqueFiles.forEach((file) => dataTransfer.items.add(file));
      addFiles(dataTransfer.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onFilesSelected(e.dataTransfer.files);
  };

  const openFileDialog = () => inputRef.current?.click();

  const handleRemove = (id: string) => {
    setDeletedItems((prev) => new Set(prev).add(id));
    setTimeout(() => {
      remove(id);
      removeState(id);
    }, 500);
  };

  const handleClear = () => {
    setDeletedItems(new Set(items.map((it) => it.id)));
    setWarningData(null);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

    setTimeout(() => {
      clear();
      resetStates();
    }, 500);
  };

  const onCompleteSuccess = () => {
    clear();
    resetStates();
    onSuccess();
  };

  const handleUpload = () => uploadAllFiles(items, onCompleteSuccess);

  const handleRetry = (id: string) => {
    const itemToRetry = items.find((it) => it.id === id);
    if (itemToRetry) {
      retryFile(itemToRetry, items, onCompleteSuccess);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary">
          Cargar Contenido Multimedia
        </h1>
      </div>

      <section
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        aria-label="Zona de arrastre para cargar archivos multimedia"
        className={`rounded-lg p-8 flex flex-col items-center justify-center relative border-2 ${
          isDragging
            ? "marching-ants bg-primary/10 shadow-lg border-transparent"
            : "border-dashed border-bg-border bg-bg-hover"
        }`}
      >
        <p className="text-text-muted mb-8 text-center">
          Arrastra aquí los archivos o usa el botón para seleccionar
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          className="hidden"
          onChange={(e) => {
            onFilesSelected(e.target.files);
            if (e.target) e.target.value = "";
          }}
        />

        <button
          type="button"
          className="w-full px-4 py-3.5 rounded-xl bg-accent-green text-white font-bold hover:opacity-90 transition-opacity border-2 border-dashed border-accent-green/30 disabled:opacity-50"
          onClick={openFileDialog}
          disabled={isUploading}
        >
          Seleccionar archivos
        </button>
      </section>

      <div className="flex flex-wrap justify-center gap-4 text-xs text-text-muted mt-2">
        <span>Imágenes: hasta {formatSize(FILE_SIZE_LIMITS.image)}</span>
        <span>•</span>
        <span>Audios: hasta {formatSize(FILE_SIZE_LIMITS.audio)}</span>
        <span>•</span>
        <span>Videos: hasta {formatSize(FILE_SIZE_LIMITS.video)}</span>
      </div>

      {localError && (
        <div className="p-3 rounded-lg bg-accent-red/10 text-accent-red border border-accent-red/20 text-sm font-medium">
          {localError}
        </div>
      )}

      {warningData && (
        <div className="flex flex-col text-center p-3 rounded-lg bg-secondary/10 text-secondary border border-secondary/20 text-sm font-medium">
          {warningData.count === 1 ? (
            <>
              <span>El archivo</span>
              <div className="w-full min-w-0 italic overflow-hidden my-0.5">
                <MarqueeText text={`"${warningData.names}"`} speed={30} />
              </div>
              <span>ya estaba seleccionado.</span>
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

      <div>
        <h2 className="font-semibold text-text mb-3">
          Archivos seleccionados ({items.length})
        </h2>
        <div className="space-y-2 max-h-75 overflow-y-auto pr-2">
          {items.map((it) => (
            <ExpandableContent
              key={it.id}
              isOpen={!deletedItems.has(it.id)}
              className="-mt-2"
            >
              <MultimediaCard
                id={it.id}
                name={it.name}
                size={it.size}
                type={it.type}
                dataUrl={it.dataUrl}
                upload={uploadStates[it.id] || { status: "idle", progress: 0 }}
                isLeaving={deletedItems.has(it.id)}
                allowRetry={false}
                onRemove={handleRemove}
                onRetry={handleRetry}
              />
            </ExpandableContent>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          className="flex-1 px-4 py-3.5 rounded-xl bg-secondary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          onClick={handleUpload}
          disabled={isUploading || items.length === 0}
        >
          {isUploading ? "Subiendo..." : "Subir archivos"}
        </button>
        <button
          className="px-4 py-3.5 rounded-xl bg-accent-red text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          onClick={handleClear}
          disabled={items.length === 0 || isUploading}
        >
          Limpiar
        </button>
        <button
          className="px-4 py-3.5 rounded-xl bg-bg-hover border border-bg-border text-text font-bold hover:bg-bg-active transition-colors disabled:opacity-50"
          onClick={onCancel}
          disabled={isUploading}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
