import Image from "next/image";
import { EnvelopeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { CONTACT_COPY } from "../config/contact.config";
import type { ContactAccent, ContactPerson } from "../types/contact.types";

/** Clases por acento (literales para que Tailwind las detecte). */
const ACCENT: Record<ContactAccent, { border: string; bg: string }> = {
  primary: { border: "border-t-primary", bg: "bg-primary" },
  secondary: { border: "border-t-secondary", bg: "bg-secondary" },
  "accent-green": { border: "border-t-accent-green", bg: "bg-accent-green" },
  "accent-yellow": { border: "border-t-accent-yellow", bg: "bg-accent-yellow" },
  "accent-red": { border: "border-t-accent-red", bg: "bg-accent-red" },
};

/** Iniciales para el avatar (máx. 2 letras). */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

/**
 * Tarjeta de contacto: rol, ámbito, nombre, descripción del rol y correo.
 * Si falta el nombre se muestra un ícono genérico; si falta el correo se
 * indica que estará disponible próximamente (sin inventar datos).
 */
export default function ContactCard({
  person,
  featured = false,
}: {
  person: ContactPerson;
  /** Tarjeta destacada (presidencia): más ancha en escritorio. */
  featured?: boolean;
}) {
  const accent = ACCENT[person.accent];

  return (
    <article
      className={`flex h-full flex-col gap-5 rounded-2xl border-t-4 bg-bg-card p-6 md:p-8 ${accent.border} ${
        featured ? "md:flex-row md:items-center md:gap-8" : ""
      }`}
    >
      {/*
        Círculo de la persona, pensado para foto. Sin foto: iniciales (o un
        ícono si tampoco hay nombre) sobre el color de acento.
      */}
      <span
        aria-hidden={!person.photo}
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full text-text-inverse ring-4 ring-bg ${accent.bg} ${
          featured ? "size-28 text-3xl md:size-32" : "size-24 text-2xl"
        } font-bold`}
      >
        {person.photo ? (
          <Image
            src={person.photo}
            alt={person.name ?? person.scope}
            fill
            sizes={featured ? "128px" : "96px"}
            className="object-cover"
          />
        ) : person.name ? (
          initials(person.name)
        ) : (
          <UserGroupIcon className="size-1/2" />
        )}
      </span>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {/* Sin nombre, el título ya es el ámbito: no se repite aquí. */}
            {person.name ? `${person.role} · ${person.scope}` : person.role}
          </p>
          <h2 className={`font-bold leading-tight text-primary ${featured ? "text-2xl" : "text-xl"}`}>
            {person.name ?? person.scope}
          </h2>
        </div>
        <p className="text-sm leading-[1.45] text-text-muted">{person.description}</p>

        <div className="mt-auto pt-2">
          {person.email ? (
            <a
              href={`mailto:${person.email}`}
              className="inline-flex max-w-full items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-text-inverse transition-colors hover:bg-[#013548]"
            >
              <EnvelopeIcon className="size-5 shrink-0" aria-hidden />
              <span className="truncate">{person.email}</span>
            </a>
          ) : (
            <p className="inline-flex items-center gap-2 text-sm text-text-muted">
              <EnvelopeIcon className="size-5" aria-hidden />
              {CONTACT_COPY.emailPending}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
