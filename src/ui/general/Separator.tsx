interface SeparatorProps {
  className?: string;
}

export default function Separator({ className }: SeparatorProps) {
  return (
    <svg
      className={`w-full h-full ${className}`}
      viewBox="0 0 347 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <g clip-path="url(#clip0_212_1236)">
        <path fill="#024059" d="M0 0h69.345v6.178H0z" />
        <path d="M69.345 0h69.345v6.178H69.345z" fill="#f28f38" />
        <path d="M138.69 0h69.345v6.178H138.69z" fill="#038c4a" />
        <path d="M208.035 0h69.344v6.178h-69.344z" fill="#eabe03" />
        <path fill="#ec1e25" d="M277.379 0h69.345v6.178h-69.345z" />
      </g>
      <defs>
        <clipPath id="clip0_212_1236">
          <rect width="346.724" height="6.178" rx="3.089" fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  );
}
