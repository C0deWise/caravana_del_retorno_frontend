import Image from "next/image";

interface MainTextProps {
  size?: number;
  className?: string;
}

export default function MainText({
  size = 170,
  className = "",
}: MainTextProps) {
  const height = size * 0.4235;

  return (
    <div
      className={`inline-block h-${size} w-[${size}px] ${className}`}
      style={{ width: size, height: height }}
    >
      <Image
        src="/home/Caravana-Del-Retorno-Text.svg"
        width={size}
        height={height}
        alt="Caravana del Retorno"
        className="w-full h-full rounded-lg object-contain"
        unoptimized
      />
    </div>
  );
}
