import { Kalam, Montserrat } from "next/font/google";

/**
 * Tipografías de acento definidas en el prototipo de Figma.
 * Se cargan solo para la landing (no se tocan las fuentes globales del layout raíz).
 *  - Montserrat: rótulo "FLORENCIA, CAUCA" y contador del carrusel.
 *  - Kalam: lema manuscrito del hero.
 */
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const kalam = Kalam({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});
