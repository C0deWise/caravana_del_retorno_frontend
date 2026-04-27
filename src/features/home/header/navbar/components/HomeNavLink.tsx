"use client";

import AnimatedLink from "@/components/layout/AnimatedLink";

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
    <AnimatedLink
      href={href}
      label={label}
      linkClassName={`text-shadow-lg ${isActive ? "text-secondary" : ""}`}
      textClassName={`text-text-inverse text-shadow-lg group-hover:text-secondary ${isActive ? "text-secondary" : ""}`}
      underlineClassName={isActive ? "w-full" : "w-0 group-hover:w-full"}
    />
  );
}

