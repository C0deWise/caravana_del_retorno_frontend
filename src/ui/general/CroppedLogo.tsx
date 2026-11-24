/**
 * Muestra un SVG de logo recortado a su zona visible.
 *
 * Los logos "croquis" se exportaron sobre un lienzo grande con mucho margen
 * transparente. Cambiar su `viewBox` no sirve (sus máscaras internas recortan
 * el contenido), así que el recorte se hace con CSS: un contenedor con la
 * proporción del contenido y `overflow-hidden`, y la imagen escalada y
 * desplazada dentro de él. Todo en porcentajes, así que el ancho lo decide
 * quien lo usa vía `className` (p. ej. `w-[220px]`).
 *
 * Las medidas (`canvas` y `crop`) están en unidades del viewBox original.
 */

export interface LogoCrop {
  src: string;
  alt: string;
  /** Tamaño del viewBox original del SVG. */
  canvas: { width: number; height: number };
  /** Caja del contenido visible dentro del viewBox. */
  crop: { x: number; y: number; width: number; height: number };
}

/** Logo croquis con bus + texto (header, footer). */
export const LOGO_CROQUIS_ICON: LogoCrop = {
  src: "/logos/logo-croquis-icon.svg",
  alt: "Caravana del Retorno",
  canvas: { width: 1826.88, height: 1607.99993 },
  crop: { x: 26, y: 556, width: 1496, height: 562 },
};

/** Logo croquis edición 2028 (hero de la landing). */
export const LOGO_CROQUIS_2028: LogoCrop = {
  src: "/logos/logo-croquis-2028.svg",
  alt: "Caravana del Retorno a Florencia 2028",
  canvas: { width: 1802.88, height: 1697.249988 },
  crop: { x: 112, y: 554, width: 1490, height: 688 },
};

export default function CroppedLogo({
  logo,
  className = "",
}: {
  logo: LogoCrop;
  className?: string;
}) {
  const { canvas, crop } = logo;
  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ aspectRatio: `${crop.width} / ${crop.height}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático con recorte por CSS; next/image no aporta optimización aquí. */}
      <img
        src={logo.src}
        alt={logo.alt}
        draggable={false}
        className="absolute max-w-none"
        style={{
          width: `${(canvas.width / crop.width) * 100}%`,
          left: `${(-crop.x / crop.width) * 100}%`,
          top: `${(-crop.y / crop.height) * 100}%`,
        }}
      />
    </span>
  );
}
