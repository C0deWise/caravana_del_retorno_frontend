import Image from "next/image";

interface MainIconProps {
  size?: number;
  className?: string;
}

export default function MainIcon({ size = 87, className = "" }: MainIconProps) {
  return (
    <div
      className={`inline-block w-[${size}px] h-[${size}px] ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/home/Caravana-Del-Retorno-Icon.svg"
        width={size}
        height={size}
        alt="Logo de la Caravana del Retorno"
        className="w-full h-full object-contain rounded-lg"
        priority
        unoptimized
      />
    </div>
  );
}
