import CurveShape from "@/ui/decorators/CurveShape";
import InstitutionalStripe from "@/ui/decorators/InstitutionalStripe";
import { kalam } from "../config/fonts.config";
import { SONG_VIDEO } from "../config/landing.config";

/**
 * Cierre de la landing: una frase y el video de YouTube con la canción
 * de un florenciano sobre el regreso.
 *
 * - Se usa `youtube-nocookie.com` (modo de privacidad mejorada de YouTube:
 *   no guarda cookies hasta que el visitante reproduce el video).
 * - `loading="lazy"`: el iframe solo se carga al acercarse con el scroll,
 *   así no penaliza la carga inicial de la página.
 * - Contenedor 16:9 responsivo, sin anchos fijos.
 * - Borde inferior curvo: reutiliza `CurveShape` (la misma silueta y
 *   orientación que `FooterCurve`) pintada en blanco, para que el cierre
 *   azul de esta sección sea paralelo a la curva del pie de página y entre
 *   ambos quede una franja blanca ondulada en vez de un corte recto.
 */
export default function SongVideoSection() {
  const src = `https://www.youtube-nocookie.com/embed/${SONG_VIDEO.youtubeId}?rel=0`;

  return (
    <section
      id="cancion-del-retorno"
      aria-labelledby="cancion-del-retorno-title"
      className="relative mb-20 bg-primary px-4 pb-28 pt-20 md:mb-24 md:px-10 md:pb-32 md:pt-24 xl:px-20"
    >
      <div className="mx-auto flex max-w-[960px] flex-col items-center gap-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <p className="flex items-center gap-2.5 text-sm font-semibold text-secondary">
            <InstitutionalStripe className="h-1.5 w-10" />
            {SONG_VIDEO.eyebrow}
            <InstitutionalStripe className="h-1.5 w-10" />
          </p>
          <h2
            id="cancion-del-retorno-title"
            className={`${kalam.className} text-3xl font-bold leading-snug text-text-inverse md:text-[42px]`}
          >
            {SONG_VIDEO.phrase}
          </h2>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.35)] ring-1 ring-text-inverse/15">
          <iframe
            src={src}
            title={SONG_VIDEO.iframeTitle}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        </div>
      </div>

      {/* Silueta inferior en blanco, idéntica a la curva superior del footer. */}
      <CurveShape className="pointer-events-none absolute -bottom-px right-0 h-10 w-full rotate-180 [&_path]:fill-bg!" />
    </section>
  );
}
