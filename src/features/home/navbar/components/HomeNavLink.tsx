"use client";

import Link from "next/link";

interface HomeNavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

export default function HomeNavLink({
  href,
  label,
  isActive,
}: HomeNavLinkProps) {
  return (
    <Link
      href={href}
      className={`relative group hover:text-secondary transition-colors ${
        isActive ? "text-secondary" : ""
      }`}
    >
      {label}
      <span
        className={`absolute left-0 bottom-0 h-0.5 bg-secondary transition-all duration-300 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      ></span>
    </Link>
  );
}
