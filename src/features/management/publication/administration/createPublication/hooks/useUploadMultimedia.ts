import { useState } from "react";
import { multimediaService } from "../services/multimedia.service";
import { MultimediaCardUploadState } from "../components/MultimediaCard";
import { ApiError } from "@/services/api.services";

export function useUploadMultimedia() {
  const [uploadStates, setUploadStates] = useState<
    Record<string, MultimediaCardUploadState>
  >({});
  const [isUploading, setIsUploading] = useState(false);

  const resetStates = () => setUploadStates({});

  const removeState = (id: string) => {
    setUploadStates((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const uploadSingleFile = async (
    id: string,
    name: string,
    dataUrl?: string,
  ): Promise<boolean> => {
    setUploadStates((prev) => ({
      ...prev,
      [id]: { status: "uploading", progress: 0 },
    }));

    try {
      const result = await multimediaService.uploadFile(
        { name, dataUrl },
        (percentage) => {
          setUploadStates((prev) => ({
            ...prev,
            [id]: { status: "uploading", progress: percentage },
          }));
        },
      );

      if (result.success) {
        setUploadStates((prev) => ({
          ...prev,
          [id]: { status: "success", progress: 100 },
        }));
        return true;
      } else {
        setUploadStates((prev) => ({
          ...prev,
          [id]: {
            status: "error",
            progress: 0,
            errorMessage: result.message || "Error al subir",
          },
        }));
        return false;
      }
    } catch (err) {
      let finalErrorMessage = "Error de conexión, intenta de nuevo";

      if (err instanceof ApiError) {
        if (err.status === 404) {
          //TODO: Cambiar por los codigos de error reales
          finalErrorMessage = "Servicio no encontrado.";
        } else if (err.status === 413 || err.status === 415) {
          finalErrorMessage = "El archivo es inválido o muy grande.";
        } else {
          finalErrorMessage = err.message;
        }
      } else if (err instanceof Error) {
        finalErrorMessage = err.message;
      }

      setUploadStates((prev) => ({
        ...prev,
        [id]: {
          status: "error",
          progress: 0,
          errorMessage: finalErrorMessage,
        },
      }));
      return false;
    }
  };

  const uploadAllFiles = async (
    items: Array<{ id: string; name: string; dataUrl?: string }>,
    onComplete?: () => void,
  ) => {
    if (!items.length) return;
    setIsUploading(true);

    let successCount = 0;

    for (const item of items) {
      if (uploadStates[item.id]?.status === "success") {
        successCount++;
        continue;
      }

      const success = await uploadSingleFile(item.id, item.name, item.dataUrl);
      if (success) successCount++;
    }

    setIsUploading(false);

    if (successCount === items.length && items.length > 0) {
      if (onComplete) {
        setTimeout(onComplete, 1500);
      }
    }
  };

  const retryFile = async (
    item: { id: string; name: string; dataUrl?: string },
    allItems: Array<{ id: string; name: string; dataUrl?: string }>,
    onAllComplete?: () => void,
  ) => {
    const success = await uploadSingleFile(item.id, item.name, item.dataUrl);

    if (success && onAllComplete) {
      setUploadStates((currentState) => {
        const allSuccess = allItems.every(
          (it) =>
            it.id === item.id || currentState[it.id]?.status === "success",
        );
        if (allSuccess) {
          setTimeout(onAllComplete, 1500);
        }
        return currentState;
      });
    }
  };

  return {
    uploadStates,
    isUploading,
    uploadAllFiles,
    retryFile,
    resetStates,
    removeState,
  };
}
