import Image from "next/image";

interface OptimizedImageProps {
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
  readonly width?: number;
  readonly height?: number;
}

export function OptimizedImage({
  src,
  alt,
  className,
  width = 48,
  height = 48,
}: OptimizedImageProps) {
  const isDataUrl = src.startsWith("data:");

  if (isDataUrl) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={false}
    />
  );
}
