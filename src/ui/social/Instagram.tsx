import Image from "next/image";

interface InstagramProps {
  size?: number;
  className?: string;
}

export default function Instagram({
  size = 80,
  className = "",
}: InstagramProps) {
  return (
    <a
      href="https://google.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className={`inline-block h-${size} w-${size} group ${className}`}
    >
      <Image
        src="/social/instagram.svg"
        width={size}
        height={size}
        alt=""
        className="w-full h-full rounded-lg group-hover:scale-110 transition-all duration-200 object-contain"
        unoptimized
      />
    </a>
  );
}
