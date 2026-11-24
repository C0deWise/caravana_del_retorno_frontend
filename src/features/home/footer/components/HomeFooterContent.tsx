import FooterCurve from "@/ui/general/FooterCurve";
import FlorenciaMap from "@/ui/social/FlorenciaMap";
import VerticalSeparator from "@/ui/decorators/VerticalSeparator";
import InstitutionalStripe from "@/ui/decorators/InstitutionalStripe";
import CroppedLogo, { LOGO_CROQUIS_ICON } from "@/ui/general/CroppedLogo";
import SocialIcon from "@/ui/social/SocialIcon";
import Image from "next/image";

/** Entidades que apoyan el proyecto ("Con el apoyo de"). Logos en `public/apoyo`. */
const SUPPORTERS = [
  { name: "CodeWise", logo: "/apoyo/logo-apoyo-codewise.svg" },
  { name: "Universidad del Cauca", logo: "/apoyo/logo-apoyo-unicauca.svg" },
];

/** Redes sociales del footer. */
const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: "/social/facebook.svg" },
  { label: "Instagram", href: "https://instagram.com", icon: "/social/instagram.svg" },
];

/**
 * Contenido del footer público.
 *
 * Responsive (prototipo "Footer" desktop y mobile):
 *  - Móvil / tablet (< `lg`): todo apilado — mapa, "¡Encuéntranos en el mapa!",
 *    apoyos, franja institucional horizontal y fila con logo + redes.
 *  - `lg` (≥1024px): tres columnas — mapa | texto + apoyos | franja vertical | logo + redes.
 *  - Abajo, siempre, la barra de derechos reservados (en flujo normal, ya no
 *    posicionada en absoluto, para que nunca se monte sobre el contenido).
 */
export default function HomeFooterContent() {
  return (
    <div className="relative bg-primary text-text-inverse">
      <FooterCurve />

      <div className="flex flex-col gap-8 px-4 pb-8 pt-10 md:px-8 lg:flex-row lg:items-stretch lg:gap-10 lg:px-10 lg:pb-6 lg:pt-8">
        {/* Mapa */}
        <div className="aspect-[16/10] w-full overflow-hidden rounded-xl md:aspect-[21/9] lg:aspect-square lg:w-64 lg:shrink-0 xl:w-72">
          <FlorenciaMap />
        </div>

        {/* Texto + apoyos */}
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-2xl font-semibold text-shadow-lg">¡Encuéntranos en el mapa!</p>
          <span aria-hidden className="mt-4 h-1 w-full rounded-full bg-bg" />
          <p className="mt-4 text-xl font-semibold text-shadow-lg">Con el apoyo de:</p>
          <ul className="mt-4 flex flex-wrap gap-4 md:gap-6">
            {SUPPORTERS.map((supporter) => (
              <li
                key={supporter.name}
                className="flex size-24 items-center justify-center rounded-xl bg-bg p-3 md:size-28 xl:size-36"
              >
                <Image
                  src={supporter.logo}
                  alt={supporter.name}
                  width={240}
                  height={240}
                  unoptimized
                  className="size-full object-contain"
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Separador: horizontal en móvil, vertical en escritorio. */}
        <InstitutionalStripe className="h-1.5 w-full lg:hidden" />
        {/*
          El SVG de la franja (viewBox 7×277) tomaría su alto de la proporción
          (28px de ancho → 1108px de alto) y estiraría todo el footer; en
          absoluto solo ocupa el alto que ya definen las otras columnas.
        */}
        <span aria-hidden className="relative hidden w-7 shrink-0 lg:block">
          <span className="absolute inset-0 overflow-clip rounded-full">
            <VerticalSeparator />
          </span>
        </span>

        {/* Logo + redes */}
        <div className="flex items-center justify-between gap-6 lg:w-56 lg:flex-col lg:justify-between xl:w-64">
          <CroppedLogo logo={LOGO_CROQUIS_ICON} className="w-[170px] md:w-[200px] xl:w-[220px]" />
          <div className="flex items-center gap-4 lg:flex-col lg:gap-6">
            {SOCIAL_LINKS.map((social) => (
              <SocialIcon
                key={social.label}
                href={social.href}
                src={social.icon}
                label={social.label}
                size={56}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="border-t border-text-inverse/10 bg-black/10 px-4 py-4 text-center text-sm font-light">
        © {new Date().getFullYear()} Todos los derechos reservados | Caravana del Retorno, Florencia,
        Cauca
      </p>
    </div>
  );
}
