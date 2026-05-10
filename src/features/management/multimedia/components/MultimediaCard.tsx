"use client";

import Image from "next/image";
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  MusicalNoteIcon,
  FilmIcon,
  DocumentIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import { MarqueeText } from "@/components/common/MarqueeText";

export interface MultimediaCardUploadState {
  readonly status: "idle" | "uploading" | "success" | "error";
  readonly progress: number;
  readonly errorMessage?: string;
}

export interface MultimediaCardProps {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly type: string;
  readonly dataUrl?: string;
  readonly upload: MultimediaCardUploadState;
  readonly isLeaving?: boolean;
  readonly allowRetry?: boolean;
  readonly onRemove: (id: string) => void;
  readonly onRetry?: (id: string) => void;
}

function getMediaTypeStyles(type: string) {
  if (type.startsWith("image/"))
    return { colors: "bg-blue-100 text-blue-700", Icon: null };
  if (type.startsWith("audio/"))
    return { colors: "bg-purple-100 text-purple-700", Icon: MusicalNoteIcon };
  if (type.startsWith("video/"))
    return { colors: "bg-pink-100 text-pink-700", Icon: FilmIcon };
  return { colors: "bg-gray-100 text-gray-700", Icon: DocumentIcon };
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function UploadStatusIndicator({
  upload,
  size,
}: {
  readonly upload: MultimediaCardUploadState;
  readonly size: number;
}) {
  const isSuccess = upload.status === "success";
  const isError = upload.status === "error";
  const isUploading = upload.status === "uploading";

  return (
    <div className="flex items-center gap-3 mt-0.5 text-xs w-full">
      <span className="text-gray-400 shrink-0">{formatSize(size)}</span>

      {isUploading && (
        <div className="flex items-center gap-2 flex-1 w-full">
          <span className="text-primary font-medium shrink-0">
            {upload.progress}%
          </span>
          <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden flex-1">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${upload.progress}%` }}
            />
          </div>
        </div>
      )}

      {isSuccess && (
        <span className="flex items-center gap-1 text-green-600 font-medium">
          <CheckCircleIcon className="w-4 h-4" /> Subido
        </span>
      )}

      {isError && (
        <span
          className="flex items-center gap-1 text-red-600 truncate flex-1"
          title={upload.errorMessage}
        >
          <XCircleIcon className="w-4 h-4 shrink-0" />
          <span className="truncate">{upload.errorMessage ?? "Error"}</span>
        </span>
      )}
    </div>
  );
}

export function MultimediaCard({
  id,
  name,
  size,
  type,
  dataUrl,
  upload,
  isLeaving = false,
  allowRetry = false,
  onRemove,
  onRetry,
}: MultimediaCardProps) {
  const isUploading = upload.status === "uploading";
  const isError = upload.status === "error";
  const { colors, Icon } = getMediaTypeStyles(type);

  return (
    <div
      className={`flex items-center gap-3 mt-2 p-3 rounded-lg border border-gray-200 bg-white shadow-sm
        transition-all duration-500
        ${isLeaving ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
    >
      <div className="shrink-0">
        {dataUrl && type.startsWith("image/") ? (
          <Image
            src={dataUrl}
            alt={name}
            width={40}
            height={40}
            className="rounded-lg object-cover w-10 h-10 border border-gray-100"
            unoptimized
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors}`}
          >
            {Icon && <Icon className="w-5 h-5" />}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center overflow-hidden">
        <MarqueeText
          text={name}
          speed={30}
          className="text-sm font-medium text-gray-800"
        />

        <UploadStatusIndicator upload={upload} size={size} />
      </div>

      {/* Contenedor de botones de acción */}
      <div className="flex items-center gap-1.5 shrink-0 ml-1">
        {isError && allowRetry && onRetry && (
          <button
            type="button"
            onClick={() => onRetry(id)}
            className="flex items-center justify-center w-8 h-8 text-text-inverse bg-secondary
              hover:opacity-90 rounded-lg transition-all shadow-sm active:scale-95
              cursor-pointer"
            title="Reintentar subida"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onRemove(id)}
          disabled={isUploading}
          className="flex items-center justify-center w-8 h-8 text-text-inverse bg-accent-red
            hover:opacity-90 rounded-lg transition-all shadow-sm active:scale-95
            cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title="Eliminar archivo"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
