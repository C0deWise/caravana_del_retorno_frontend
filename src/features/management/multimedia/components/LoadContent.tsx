"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useLocalMultimedia } from "../hooks/useLocalMultimedia";
import { multimediaService } from "../services/multimedia.service";

export default function LoadContentComponent() {
  const { items, addFiles, remove, clear, isSaving, error } =
    useLocalMultimedia();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [messages, setMessages] = useState<Array<{ id: string; text: string }>>(
    [],
  );

  const onFilesSelected = (files: FileList | null) => {
    if (!files) return;
    addFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onFilesSelected(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const openFileDialog = () => inputRef.current?.click();

  const getMediaTypeColor = (type: string) => {
    if (type.startsWith("image/")) return "bg-blue-100 text-blue-700";
    if (type.startsWith("audio/")) return "bg-purple-100 text-purple-700";
    if (type.startsWith("video/")) return "bg-pink-100 text-pink-700";
    return "bg-gray-100 text-gray-700";
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
      <h1 className="text-2xl font-semibold">Cargar Contenido Multimedia</h1>

      <section
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        aria-label="Zona de arrastre para cargar archivos multimedia"
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-white hover:bg-gray-50"
      >
        <p className="text-text-muted mb-4">
          Arrastra aquí los archivos o usa el botón para seleccionar
        </p>
        <button
          className="px-4 py-2 rounded bg-primary text-white"
          onClick={openFileDialog}
        >
          Seleccionar archivos
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*"
          className="hidden"
          onChange={(e) => onFilesSelected(e.target.files)}
        />
      </section>

      {error && (
        <div className="p-3 rounded bg-red-100 text-red-700">{error}</div>
      )}

      <div>
        <h2 className="font-medium">Archivos en local</h2>
        {items.length === 0 ? (
          <p className="text-text-muted">No hay archivos guardados en local.</p>
        ) : (
          <ul className="space-y-2 mt-2">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-3">
                  {it.blobUrl && it.type.startsWith("image/") ? (
                    <Image
                      src={it.blobUrl}
                      alt={it.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded"
                      unoptimized
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded flex items-center justify-center font-semibold text-sm ${getMediaTypeColor(it.type)}`}>
                      {it.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium truncate">{it.name}</div>
                    <div className="text-sm text-text-muted">
                      {(it.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                </div>

                <button
                  className="px-3 py-1 rounded bg-red-100 text-red-700"
                  onClick={() => remove(it.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="px-4 py-2 rounded bg-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUpload}
          disabled={isSaving || items.length === 0}
        >
          {isSaving ? "Subiendo..." : "Cargar a servidor"}
        </button>
        <button
          className="px-4 py-2 rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => clear()}
          disabled={items.length === 0}
        >
          Limpiar local
        </button>
      </div>

      {messages.length > 0 && (
        <div className="space-y-1 p-3 rounded bg-gray-50">
          {messages.map((m) => (
            <div key={m.id} className="text-sm text-text-muted">
              {m.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
