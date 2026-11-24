import HeroCarousel from "@/features/home/landing/components/HeroCarousel";
import ValuesBar from "@/features/home/landing/components/ValuesBar";
import AboutUsSection from "@/features/home/landing/components/AboutUsSection";
import SongVideoSection from "@/features/home/landing/components/SongVideoSection";

/**
 * Página de Inicio (landing pública).
 *
 * Estructura según el prototipo de Figma:
 *  1. Carrusel hero (fotos reales + logo, lema y CTA).
 *  2. Barra de valores superpuesta al hero.
 *  3. Sección "¿Quiénes somos?" (ancla `#quienes-somos`).
 *  4. Cierre con frase + video de la canción del regreso (ancla `#cancion-del-retorno`).
 *
 * El header y el footer los aporta el layout compartido `app/(public)/layout.tsx`.
 */
export default function Inicio() {
  return (
    <>
      <HeroCarousel />
      <ValuesBar />
      <AboutUsSection />
      <SongVideoSection />
    </>
  );
}
