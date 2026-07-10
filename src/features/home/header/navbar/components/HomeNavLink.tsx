"use client";

import AnimatedLink from "@/components/layout/AnimatedLink";

interface HomeNavLinkProps {
  readonly href: string;
  readonly label: string;
  readonly isActive: boolean;
  readonly onClick?: () => void;
}

export default function HomeNavLink({
  href,
  label,
  isActive,
  onClick,
}: HomeNavLinkProps) {
  const isUnimplemented = href === "/";

  return (
    <div
      className={isUnimplemented ? "opacity-50 cursor-not-allowed" : ""}
      title={isUnimplemented ? "Próximamente" : undefined}
    >
      <AnimatedLink
        href={isUnimplemented ? "#" : href}
        label={label}
        onClick={onClick}
        linkClassName={`text-shadow-lg ${isActive ? "text-secondary" : ""} ${isUnimplemented ? "pointer-events-none" : ""}`}
        textClassName={`text-text-inverse text-shadow-lg group-hover:text-secondary ${isActive ? "text-secondary" : ""}`}
        underlineClassName={isActive ? "w-full" : "w-0 group-hover:w-full"}
      />
    </div>
  );
}

