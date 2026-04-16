import Link from "next/link";
import { ReactNode } from "react";

interface AnimatedLinkProps {
  href: string;
  label: ReactNode;
  linkClassName?: string;
  textClassName?: string;
  underlineClassName?: string;
}

export default function AnimatedLink({
  href,
  label,
  linkClassName,
  textClassName,
  underlineClassName,
}: AnimatedLinkProps) {
  return (
    <Link
      href={href}
      className={`group transition-colors inline-flex flex-col ${linkClassName ?? ""}`}
    >
      <span className={`transition-colors duration-300 ${textClassName ?? ""}`}>
        {label}
      </span>
      <span
        className={`h-0.5 bg-secondary rounded-full transition-all duration-300 ${underlineClassName ?? ""}`}
      />
    </Link>
  );
}
