"use client";

import { useState } from "react";
import { useAuth } from "@/auth/context/AuthContext";
import { useCreatePublication } from "../hooks/useCreatePublication";
import { AnimatedModal } from "@/components/feedback/AnimatedModal";
import { useLocalMultimedia } from "../hooks/useLocalMultimedia";
import { useUploadMultimedia } from "../hooks/useUploadMultimedia";
import Spinner from "@/components/feedback/Spinner";
import { PublicationBasicInfo } from "./PublicationBasicInfo";
import { PublicationMultimediaList } from "./PublicationMultimediaList";
import { MultimediaSelectionModal } from "./MultimediaSelectionModal";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface CreatePublicationModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onRefresh?: () => void;
}

export function CreatePublicationModal({ isOpen, onClose, onRefresh }: CreatePublicationModalProps) {
  const { user } = useAuth();
  const { createPublication, isLoading: isCreating, error: createError } = useCreatePublication();

  const [titulo, setTitulo] = useState("");
  const [resena, setResena] = useState("");
  const [success, setSuccess] = useState(false);
  const [isMultimediaModalOpen, setIsMultimediaModalOpen] = useState(false);

  const { items, addFiles, remove, clear } = useLocalMultimedia();
  const { uploadStates, isUploading, uploadAllFiles, retryFile, resetStates, removeState } = useUploadMultimedia();

  const resetForm = () => {
    setTitulo("");
    setResena("");
    setSuccess(false);
    clear();
    resetStates();
  };

  const handleClose = () => {
    if (isMultimediaModalOpen) return;
    if (!isUploading && !isCreating) {
      resetForm();
      onClose();
    }
  };

  const onCompleteSuccess = () => {
    setSuccess(true);
    if (onRefresh) onRefresh();
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const codigoAutor = user.id;
    const codigoColonia = user.codigo_colonia ?? 0;
    const codigoRetorno = (user as unknown as Record<string, unknown>).codigo_retorno as number | undefined ?? 0;

    try {
      await createPublication({
        titulo,
        resena,
        codigo_autor: codigoAutor,
        codigo_colonia: codigoColonia,
        codigo_retorno: codigoRetorno,
      });

      if (items.length > 0) {
        uploadAllFiles(items, onCompleteSuccess);
      } else {
        onCompleteSuccess();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isLoading = isCreating || isUploading;

  let submitButtonText = "Publicar";
  if (isCreating) {
    submitButtonText = "Creando...";
  } else if (isUploading) {
    submitButtonText = "Subiendo archivos...";
  }

  return (
    <>
      <AnimatedModal isOpen={isOpen} onBackdropClick={handleClose} maxWidth="max-w-2xl">
        <div className="w-full bg-bg rounded-2xl shadow-2xl border border-bg-border overflow-hidden">
          <div className="p-5 md:p-6">
            <h2 className="mb-4 text-2xl font-bold text-primary">Crear Nueva Publicación</h2>

            {success ? (
              <div className="rounded-xl bg-success/10 p-6 text-center text-success border border-success/20">
                <div className="text-lg font-bold">¡Publicación creada exitosamente!</div>
                {items.length > 0 && <div className="text-sm mt-2">Los archivos multimedia también han sido subidos.</div>}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <PublicationBasicInfo
                  titulo={titulo}
                  setTitulo={setTitulo}
                  resena={resena}
                  setResena={setResena}
                  isLoading={isLoading}
                />

                <div className="flex items-center justify-between mt-2 mb-1">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-text">Archivos Seleccionados</span>
                    <span className="text-xs text-text-muted">{items.length} archivo(s)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMultimediaModalOpen(true)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold hover:opacity-90 shadow-sm transition-all text-sm disabled:opacity-50"
                  >
                    <PhotoIcon className="w-5 h-5" />
                    Adjuntar archivos
                  </button>
                </div>

                <PublicationMultimediaList
                  items={items}
                  remove={remove}
                  uploadStates={uploadStates}
                  removeState={removeState}
                  retryFile={retryFile}
                  onCompleteSuccess={onCompleteSuccess}
                />

                {createError && (
                  <p className="text-sm text-accent-red mt-2 font-medium bg-accent-red/10 p-3 rounded-lg">
                    {createError}
                  </p>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-text hover:bg-bg-hover transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !titulo.trim() || !resena.trim()}
                    className="flex items-center gap-2 rounded-xl bg-secondary px-6 py-2.5 text-sm font-bold text-text-inverse shadow-md hover:bg-secondary/90 hover:shadow-lg transition-all disabled:opacity-50 active:scale-95"
                  >
                    {isLoading && <Spinner size="sm" className="text-text-inverse" />}
                    {submitButtonText}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </AnimatedModal>

      <MultimediaSelectionModal
        isOpen={isMultimediaModalOpen}
        onClose={() => setIsMultimediaModalOpen(false)}
        onFilesSelected={addFiles}
        items={items}
      />
    </>
  );
}
