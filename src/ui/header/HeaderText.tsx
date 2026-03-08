import Image from "next/image";

interface HeaderTextProps {
  className?: string;
}

export default function HeaderText({ className }: HeaderTextProps) {
  return (
    <Image
      src="/home/Caravana-Del-Retorno-Text.svg"
      width={170}
      height={72}
      className={`w-full h-auto object-contain relative z-10 ${className || ""}`}
      alt="Titulo de la Caravana Del Retorno"
      priority
    />
  );
}
