"use client";

/* eslint-disable @next/next/no-img-element -- WebP animado: next/image lo
   trataría como imagen estática optimizable; se usa <img> para conservar la animación. */

import { useState } from "react";
import CroppedLogo, { LOGO_CROQUIS_ICON } from "@/ui/general/CroppedLogo";

/** Chiva animada (WebP 192px generado desde `Fotos/logo-croquis-icon-animado.gif`). */
const ANIMATED_CHIVA_SRC = "/logos/logo-croquis-icon-animado.webp";

/**
 * Posición del círculo de la chiva dentro del logo recortado, en % del
 * logo (medido sobre el SVG: cuadrado de ~490 u. que empieza en (4, 12)
 * dentro del recorte de 1496 × 562 u.). La animación se superpone justo ahí.
 */
const CIRCLE_BOX = {
  left: `${(4 / 1496) * 100}%`,
  top: `${(12 / 562) * 100}%`,
  width: `${(490 / 1496) * 100}%`,
};

/**
 * Logo del header público con la chiva animada al pasar el mouse por el círculo.
 *
 * - La animación (243 KB) se descarga la PRIMERA vez que se pasa el mouse,
 *   no en cada carga de página.
 * - Cada vez que se entra, la animación arranca desde el inicio (se vuelve
 *   a montar la imagen; el navegador la toma de caché).
 * - Si el sistema pide reducir movimiento, no se anima.
 * - En pantallas táctiles no hay hover: se ve el logo normal.
 */
export default function HeaderLogo() {
  const [hovering, setHovering] = useState(false);
  // Se incrementa en cada entrada para reiniciar la animación.
  const [playId, setPlayId] = useState(0);

  const handleEnter = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlayId((id) => id + 1);
    setHovering(true);
  };

  return (
    <span className="relative block w-[160px] lg:w-[180px] xl:w-[210px]">
      <CroppedLogo logo={LOGO_CROQUIS_ICON} className="w-full" />

      {/* Zona del círculo: detecta el hover y aloja la animación encima. */}
      <span
        aria-hidden
        onMouseEnter={handleEnter}
        onMouseLeave={() => setHovering(false)}
        className="absolute aspect-square overflow-hidden rounded-full"
        style={CIRCLE_BOX}
      >
        {playId > 0 && (
          <img
            key={playId}
            src={ANIMATED_CHIVA_SRC}
            alt=""
            draggable={false}
            className={`size-full object-cover transition-opacity duration-200 ${
              hovering ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </span>
    </span>
  );
}
