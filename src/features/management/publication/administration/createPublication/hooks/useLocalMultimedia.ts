"use client";

import { useState, useCallback } from "react";
import {
  FILE_SIZE_LIMITS,
  MediaCategory,
  formatSize,
} from "../config/multimedia.constants";

export type LocalMultimediaItem = {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  file: File;
};

function getMediaCategory(mimeType: string): MediaCategory | null {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  return null;
}

export function useLocalMultimedia() {
  const [items, setItems] = useState<LocalMultimediaItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsSaving(true);
    setError(null);
    setErrorCode(null);

    try {
      const fileArray = Array.from(files as File[]);

      for (const f of fileArray) {
        const category = getMediaCategory(f.type);

        if (!category) {
          setErrorCode(415);
          setError(`Tipo de archivo no soportado: ${f.name}`);
          return;
        }

        const limit = FILE_SIZE_LIMITS[category];
        if (f.size > limit) {
          setErrorCode(413);
          setError(
            `El archivo "${f.name}" excede el tamaño máximo para ${category} (${formatSize(limit)})`,
          );
          return;
        }
      }

      const mapped = fileArray.map((f) => {
        const dataUrl = URL.createObjectURL(f);
        return {
          id: crypto.randomUUID(),
          name: f.name,
          size: f.size,
          type: f.type,
          dataUrl,
          file: f,
        };
      });

      setItems((s) => [...s, ...mapped]);
    } catch {
      setError("Error procesando archivos");
      setErrorCode(500);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const remove = useCallback((id: string) => {
    setItems((s) => {
      const item = s.find((i) => i.id === id);
      if (item?.dataUrl) URL.revokeObjectURL(item.dataUrl);
      return s.filter((i) => i.id !== id);
    });
  }, []);

  const clear = useCallback(() => {
    setItems((s) => {
      s.forEach((item) => {
        if (item.dataUrl) URL.revokeObjectURL(item.dataUrl);
      });
      return [];
    });
  }, []);

  return {
    items,
    addFiles,
    remove,
    clear,
    isSaving,
    error,
    errorCode,
    limits: FILE_SIZE_LIMITS,
  } as const;
}
