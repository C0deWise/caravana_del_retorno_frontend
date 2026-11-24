"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  HERO_AUTOPLAY_MS,
  HERO_COPY,
  HERO_SLIDES,
} from "../config/landing.config";
import { kalam, montserrat } from "../config/fonts.config";
import CroppedLogo, { LOGO_CROQUIS_2028 } from "@/ui/general/CroppedLogo";

/**
 * Hero principal de la landing ("Carrusel Hero" del prototipo v2).
 *
 * - Fotos reales del Retorno a pantalla completa con fundido cruzado.
 * - Logo, ubicación, lema y CTA fijos sobre la foto.
 * - Flechas, puntos y avance automático cada 5 s.
 * - El autoplay se pausa con hover/foco y se desactiva si el usuario
 *   prefiere movimiento reducido.
 * - Las fotos son decorativas (alt=""): no se describe su contenido.
 */
export default function HeroCarousel() {
  const total = HERO_SLIDES.length;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => setCurrent((index + total) % total),
    [total],
  );
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Avance automático. Se reinicia en cada cambio de slide para que la
  // navegación manual siempre conceda el intervalo completo.
  useEffect(() => {
    if (paused) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const id = window.setTimeout(next, HERO_AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [current, paused, next]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Caravana del Retorno"
      className="relative isolate h-[calc(100svh-5rem)] min-h-[620px] max-h-[820px] w-full overflow-hidden bg-primary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      {/* Fotos apiladas: solo la activa es opaca. */}
      {HERO_SLIDES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Velo del prototipo: asegura contraste AA del texto sobre cualquier foto. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,51,71,0.55)_0%,rgba(2,51,71,0.25)_35%,rgba(2,51,71,0.55)_70%,rgba(2,46,64,0.95)_100%)]"
      />

      {/* Contenido fijo: logo, ubicación, lema y CTA. */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 px-4 pb-32 text-center md:gap-[18px] md:pb-44">
        {/* Logo croquis 2028. */}
        <CroppedLogo
          logo={LOGO_CROQUIS_2028}
          className="w-[280px] drop-shadow-[0_6px_18px_rgba(0,0,0,0.25)] md:w-[500px]"
        />

        <p
          className={`${montserrat.className} flex items-center gap-3.5 text-sm font-bold uppercase tracking-[0.22em] text-text-inverse md:text-lg`}
        >
          <span aria-hidden className="h-0.5 w-10 bg-secondary" />
          {HERO_COPY.location}
          <span aria-hidden className="h-0.5 w-10 bg-secondary" />
        </p>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3.5">
            <Image
              src="/home/icons/ornamento-izq.svg"
              alt=""
              width={56}
              height={24}
              className="hidden shrink-0 md:block"
            />
            <p
              className={`${kalam.className} max-w-[18ch] text-2xl font-bold leading-snug text-text-inverse [text-shadow:0_2px_8px_rgba(0,0,0,0.35)] md:max-w-none md:text-[34px]`}
            >
              {HERO_COPY.motto}
            </p>
            <Image
              src="/home/icons/ornamento-der.svg"
              alt=""
              width={56}
              height={24}
              className="hidden shrink-0 rotate-180 md:block"
            />
          </div>
          <Image
            src="/home/icons/subrayado.svg"
            alt=""
            width={460}
            height={14}
            className="mt-1 w-[260px] md:w-[460px]"
          />
        </div>

        <Link
          href={HERO_COPY.cta.href}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-4 text-sm font-semibold text-primary shadow-lg transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-inverse"
        >
          {HERO_COPY.cta.label}
          <Image src="/home/icons/flecha-cta.svg" alt="" width={18} height={18} />
        </Link>
      </div>

      {/* Flechas (ocultas en móvil: allí se navega con los puntos). */}
      <CarouselArrow direction="prev" onClick={prev} />
      <CarouselArrow direction="next" onClick={next} />

      {/* Pie: solo puntos de navegación. Sin leyenda (no se asumen descripciones de las fotos) ni contador. */}
      <div className="absolute inset-x-4 bottom-24 z-10 flex justify-center md:bottom-[100px]">
        <div className="flex items-center gap-2" role="tablist" aria-label="Seleccionar foto">
          {HERO_SLIDES.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Foto ${i + 1} de ${total}`}
              onClick={() => goTo(i)}
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
                i === current
                  ? "w-9 bg-secondary"
                  : "w-2 bg-text-inverse/55 hover:bg-text-inverse"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Botón circular translúcido de navegación del carrusel. */
function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Foto anterior" : "Foto siguiente"}
      className={`absolute top-1/2 z-10 hidden size-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-text-inverse/45 bg-text-inverse/15 backdrop-blur-[4px] transition-colors hover:bg-text-inverse/30 md:flex ${
        isPrev ? "left-10" : "right-10"
      }`}
    >
      <Image
        src={isPrev ? "/home/icons/chevron-anterior.svg" : "/home/icons/chevron-siguiente.svg"}
        alt=""
        width={26}
        height={26}
      />
    </button>
  );
}
