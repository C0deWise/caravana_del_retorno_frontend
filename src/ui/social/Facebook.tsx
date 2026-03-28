import Image from "next/image";

interface FacebookProps {
  size?: number;
  className?: string;
}

export default function Facebook({ size = 80, className = "" }: FacebookProps) {
  return (
    <a
      href="https://google.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Facebook"
      className={`inline-block h-${size} w-${size} group ${className}`}
    >
      <Image
        src="/social/facebook.svg"
        width={size}
        height={size}
        alt=""
        className="w-full h-full rounded-lg group-hover:scale-110 transition-all duration-200 object-contain"
        unoptimized
      />
    </a>
  );
}
