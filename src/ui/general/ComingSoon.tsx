import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import InstitutionalStripe from "@/ui/decorators/InstitutionalStripe";

interface ComingSoonProps {
  /** Ícono (heroicons) que identifica el módulo. */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  eyebrow: string;
  title: string;
  description: string;
  /** Enlace de salida para no dejar al visitante sin camino. */
  action: { label: string; href: string };
}

/**
 * Aviso de módulo o contenido "aún no disponible" para el portal público.
 * Reutilizable: cada página le pasa sus propios textos (ver el `config` de
 * cada feature). No muestra fechas ni datos: solo el estado del módulo.
 */
export default function ComingSoon({
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
}: ComingSoonProps) {
  return (
    <section
      aria-labelledby="coming-soon-title"
      className="mx-auto flex max-w-[1440px] px-4 py-20 md:px-10 md:py-28 xl:px-20"
    >
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-6 rounded-2xl border border-dashed border-bg-border bg-bg-card px-6 py-14 text-center md:px-12">
        <span className="flex size-20 items-center justify-center rounded-full bg-primary text-secondary shadow-lg">
          <Icon className="size-10" aria-hidden />
        </span>
        <p className="flex items-center gap-2.5 text-sm font-semibold text-primary">
          <InstitutionalStripe className="h-1.5 w-10" />
          {eyebrow}
          <InstitutionalStripe className="h-1.5 w-10" />
        </p>
        <h1
          id="coming-soon-title"
          className="text-2xl font-bold leading-tight text-primary md:text-[30px]"
        >
          {title}
        </h1>
        <p className="max-w-[52ch] text-base text-text-muted">{description}</p>
        <Link
          href={action.href}
          className="rounded-full border-[1.5px] border-primary px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-text-inverse"
        >
          {action.label}
        </Link>
      </div>
    </section>
  );
}
