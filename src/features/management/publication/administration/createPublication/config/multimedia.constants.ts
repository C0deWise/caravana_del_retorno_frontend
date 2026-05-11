export const FILE_SIZE_LIMITS = {
  image: 20 * 1024 * 1024, // 20 MB
  audio: 100 * 1024 * 1024, // 100 MB
  video: 500 * 1024 * 1024, // 500 MB
} as const;

export type MediaCategory = keyof typeof FILE_SIZE_LIMITS;

export function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(0)} GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}
