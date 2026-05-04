"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { ExpandableContent } from "@/components/layout/ExpandableContent";
import { useLocalMultimedia } from "../hooks/useLocalMultimedia";
import { multimediaService } from "../services/multimedia.service";

interface LoadContentModalFormProps {
  readonly onSuccess: () => void;
  readonly onCancel: () => void;
}

export default function LoadContentModalForm({
  onSuccess,
  onCancel,
}: LoadContentModalFormProps) {
  const { items, addFiles, remove, clear, isSaving, error } =
    useLocalMultimedia();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [messages, setMessages] = useState<Array<{ id: string; text: string }>>(
    [],
  );
  const [deletedItems, setDeletedItems] = useState<Set<string>>(new Set());

  const [isDragging, setIsDragging] = useState(false);

  const onFilesSelected = (files: FileList | null) => {
    if (!files) return;
    addFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    onFilesSelected(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const openFileDialog = () => inputRef.current?.click();

  const getMediaTypeColor = (type: string) => {
    if (type.startsWith("image/")) return "bg-blue-100 text-blue-700";
    if (type.startsWith("audio/")) return "bg-purple-100 text-purple-700";
    if (type.startsWith("video/")) return "bg-pink-100 text-pink-700";
    return "bg-gray-100 text-gray-700";
  };

  const handleRemove = (id: string) => {
    setDeletedItems((prev) => new Set(prev).add(id));
    setTimeout(() => {
      remove(id);
    }, 500);
  };

  const handleClear = () => {
    setDeletedItems(new Set(items.map((it) => it.id)));
    setTimeout(() => {
      clear();
    }, 500);
  };

  const handleUpload = async () => {
    if (!items.length) return;
    setMessages([]);

    const payload = items.map((it) => ({ name: it.name, blobUrl: it.blobUrl }));

    try {
      const results = await multimediaService.uploadBulk(payload);
      const successCount = results.filter((r) => r.success).length;
      const newMessages = results.map((r, idx) => ({
        id: `msg-${idx}-${Date.now()}`,
        text: formatUploadResult(r),
      }));
      setMessages(newMessages);

      if (successCount === results.length) {
        clear();
        setTimeout(onSuccess, 800);
      }
    } catch {
      setMessages([{ id: "error", text: "Error subiendo archivos" }]);
    }
  };

  const formatUploadResult = (r: {
    name: string;
    success: boolean;
    message?: string;
  }) => {
    const status = r.success ? "OK" : "FAIL";
    const message = r.message ? ` (${r.message})` : "";
    return `${r.name}: ${status}${message}`;
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
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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
          onChange={(e) => onFilesSelected(e.target.files)}
        />

        <button
          className="w-full px-4 py-3.5 rounded-xl bg-accent-green text-white font-bold hover:opacity-90 transition-opacity border-2 border-dashed border-accent-green/30"
          onClick={openFileDialog}
        >
          Seleccionar archivos
        </button>
      </section>

      {error && (
        <div className="p-3 rounded-lg bg-accent-red/10 text-accent-red border border-accent-red/20">
          {error}
        </div>
      )}

      <div>
        <h2 className="font-semibold text-text mb-3">
          Archivos en local ({items.length})
        </h2>
        <div className="space-y-2">
          {items.map((it) => (
            <ExpandableContent key={it.id} isOpen={!deletedItems.has(it.id)}>
              <li className="flex items-center justify-between p-3 bg-bg-hover rounded-lg border border-bg-border hover:border-bg-active transition-colors list-none">
                <div className="flex items-center gap-3 flex-1">
                  {it.blobUrl && it.type.startsWith("image/") ? (
                    <Image
                      src={it.blobUrl}
                      alt={it.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-lg"
                      unoptimized
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center font-semibold text-sm ${getMediaTypeColor(it.type)}`}
                    >
                      {it.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-text-primary truncate">
                      {it.name}
                    </div>
                    <div className="text-sm text-text-muted">
                      {(it.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(it.id)}
                  className="flex items-center justify-center p-2 text-text-inverse bg-accent-red hover:opacity-90 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer shrink-0 ml-2"
                  title="Eliminar archivo"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </li>
            </ExpandableContent>
          ))}
        </div>
      </div>

      {messages.length > 0 && (
        <div className="space-y-1 p-4 rounded-lg bg-bg-hover border border-bg-border">
          {messages.map((m) => (
            <div key={m.id} className="text-sm text-text-muted">
              {m.text}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          className="flex-1 px-4 py-3.5 rounded-xl bg-secondary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          onClick={handleUpload}
          disabled={isSaving || items.length === 0}
        >
          {isSaving ? "Subiendo..." : "Cargar a servidor"}
        </button>
        <button
          className="px-4 py-3.5 rounded-xl bg-accent-red text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          onClick={handleClear}
          disabled={items.length === 0}
        >
          Limpiar
        </button>
        <button
          className="px-4 py-3.5 rounded-xl bg-bg-hover border border-bg-border text-text font-bold hover:bg-bg-active transition-colors"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
