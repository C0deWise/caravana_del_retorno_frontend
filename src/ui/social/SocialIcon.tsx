import Image from "next/image";

interface SocialIconProps {
  href: string;
  src: string;
  label: string;
  size?: number;
  className?: string;
}

export default function SocialIcon({
  href,
  src,
  label,
  size = 80,
  className = "",
}: SocialIconProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`relative inline-block group ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt=""
        fill
        className="rounded-lg group-hover:scale-110 transition-all duration-200 object-contain"
        unoptimized
      />
    </a>
  );
}
