"use client";

import { useState, useCallback } from "react";

export type LocalMultimediaItem = {
  id: string;
  name: string;
  size: number;
  type: string;
  blobUrl?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
        if (f.size > MAX_FILE_SIZE) {
          setErrorCode(413);
          setError(
            `El archivo ${f.name} excede el tamaño máximo de ${Math.round(MAX_FILE_SIZE / 1024)} KB`,
          );
          return;
        }
        if (!/^(image|video|audio)\//.test(f.type)) {
          setErrorCode(415);
          setError(`Tipo de archivo no soportado: ${f.name}`);
          return;
        }
      }

      const mapped = fileArray.map((f) => {
        const blobUrl = URL.createObjectURL(f);
        return {
          id: crypto.randomUUID(),
          name: f.name,
          size: f.size,
          type: f.type,
          blobUrl,
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
      if (item?.blobUrl) {
        URL.revokeObjectURL(item.blobUrl);
      }
      return s.filter((i) => i.id !== id);
    });
  }, []);

  const clear = useCallback(() => {
    setItems((s) => {
      s.forEach((item) => {
        if (item.blobUrl) {
          URL.revokeObjectURL(item.blobUrl);
        }
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
  } as const;
}
