import Image from "next/image";

interface HeaderIconProps {
  className?: string;
}

export default function HeaderIcon({ className }: HeaderIconProps) {
  return (
    <Image
      src="/home/Caravana-Del-Retorno-Icon.svg"
      width={95}
      height={95}
      className={`w-full h-auto object-contain relative z-10 ${className || ""}`}
      alt="Logo de la Caravana Del Retorno"
      priority
    />
  );
}
