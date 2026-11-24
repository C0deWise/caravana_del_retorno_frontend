"use client";

import Image from "next/image";
import Link from "next/link";
import InstitutionalStripe from "@/ui/decorators/InstitutionalStripe";
import { useLandingData } from "../hooks/useLandingData";
import {
  ABOUT_COPY,
  COLONIES_COPY,
  INDICATOR_LABELS,
  PILLARS,
  PILLARS_TITLE,
  PLATFORM_COPY,
  type AccentColor,
} from "../config/landing.config";
import type {
  LandingIndicator,
  PublicColonyApi,
} from "../types/landing.types";

/**
 * Clases por color de acento. Deben ser literales para que Tailwind las
 * detecte en build (no se pueden construir con interpolación).
 */
const ACCENT_CLASSES: Record<AccentColor, { border: string; bg: string }> = {
  secondary: { border: "border-t-secondary", bg: "bg-secondary" },
  "accent-green": { border: "border-t-accent-green", bg: "bg-accent-green" },
  "accent-yellow": { border: "border-t-accent-yellow", bg: "bg-accent-yellow" },
  "accent-red": { border: "border-t-accent-red", bg: "bg-accent-red" },
};

/**
 * Sección "¿Quiénes somos?" de la landing (prototipo: "Sección · ¿Quiénes somos?").
 *
 * Bloques, en orden: institucional + foto, pilares, indicadores, colonias
 * y plataforma. Los indicadores y las colonias provienen del backend; el
 * resto es texto institucional del prototipo.
 */
export default function AboutUsSection() {
  const { colonies, finishedReturns, publications, loading } = useLandingData();

  // Solo se incluyen los indicadores que el backend pudo responder.
  const indicators: LandingIndicator[] = [
    {
      key: "colonias" as const,
      label: INDICATOR_LABELS.colonias,
      value: colonies ? colonies.length : null,
    },
    {
      key: "retornos" as const,
      label: INDICATOR_LABELS.retornos,
      value: finishedReturns,
    },
    {
      key: "publicaciones" as const,
      label: INDICATOR_LABELS.publicaciones,
      value: publications,
    },
  ].filter((indicator) => indicator.value !== null);

  return (
    <section
      id="quienes-somos"
      aria-labelledby="quienes-somos-title"
      className="mx-auto flex max-w-[1440px] scroll-mt-28 flex-col gap-12 px-4 pb-24 pt-16 md:px-10 md:pt-28 xl:px-20"
    >
      <Intro />
      <Pillars />
      <Indicators indicators={indicators} loading={loading} />
      <Colonies colonies={colonies} loading={loading} />
      <Platform />
    </section>
  );
}

/* ───────────── Bloque institucional ───────────── */

function Intro() {
  return (
    <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
      <div className="flex flex-1 flex-col gap-5">
        <p className="flex items-center gap-2.5 text-sm font-semibold text-primary">
          <InstitutionalStripe className="h-1.5 w-10" />
          {ABOUT_COPY.eyebrow}
        </p>
        <h2
          id="quienes-somos-title"
          className="text-2xl font-bold leading-tight text-primary md:text-[30px]"
        >
          {ABOUT_COPY.title}
        </h2>
        <p className="text-base leading-normal text-text">
          {ABOUT_COPY.body(ABOUT_COPY.foundingYear)}
        </p>
        <p className="text-sm font-semibold text-primary">
          {ABOUT_COPY.capabilitiesTitle}
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:max-w-[592px]">
          {ABOUT_COPY.capabilities.map((capability) => (
            <li key={capability} className="flex items-center gap-2.5 text-base text-text">
              <span className="flex shrink-0 rounded-full bg-accent-green p-1">
                <Image src="/home/icons/check.svg" alt="" width={14} height={14} />
              </span>
              {capability}
            </li>
          ))}
        </ul>
      </div>

      {/* Foto decorativa: no se asume ni describe su contenido. */}
      <div className="relative aspect-[560/520] w-full shrink-0 overflow-hidden rounded-2xl lg:w-[560px]">
        <Image
          src={ABOUT_COPY.photo}
          alt=""
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

/* ───────────── Pilares ───────────── */

function Pillars() {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-2xl font-bold leading-tight text-primary">
        {PILLARS_TITLE}
      </h3>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((pillar) => {
          const accent = ACCENT_CLASSES[pillar.accent];
          return (
            <li
              key={pillar.title}
              className={`flex flex-col gap-4 rounded-xl border-t-4 bg-bg-card p-6 ${accent.border}`}
            >
              <span className={`flex w-fit rounded-xl p-3 ${accent.bg}`}>
                <Image src={pillar.icon} alt="" width={28} height={28} />
              </span>
              <p className="text-lg font-semibold leading-snug text-primary">
                {pillar.title}
              </p>
              <p className="text-sm leading-[1.45] text-text-muted">
                {pillar.description}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ───────────── Indicadores (datos del backend) ───────────── */

/** Color del acento superior de cada indicador, según el prototipo. */
const INDICATOR_ACCENT: Record<LandingIndicator["key"], string> = {
  colonias: "bg-secondary",
  retornos: "bg-accent-green",
  publicaciones: "bg-accent-red",
};

function Indicators({
  indicators,
  loading,
}: {
  indicators: LandingIndicator[];
  loading: boolean;
}) {
  // Sin datos y sin carga pendiente: se omite el bloque completo.
  if (!loading && indicators.length === 0) return null;

  return (
    <div
      className="grid grid-cols-1 gap-6 rounded-2xl bg-bg-card p-8 sm:grid-cols-3 md:p-10"
      aria-busy={loading}
    >
      {loading
        ? // Esqueleto neutro mientras responde el backend (sin cifras de relleno).
          Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex animate-pulse flex-col gap-2">
              <span className="h-1 w-8 rounded-sm bg-bg-border" />
              <span className="h-12 w-16 rounded bg-bg-border" />
              <span className="h-4 w-32 rounded bg-bg-border" />
            </div>
          ))
        : indicators.map((indicator) => (
            <div key={indicator.key} className="flex flex-col gap-1">
              <span className={`h-1 w-8 rounded-sm ${INDICATOR_ACCENT[indicator.key]}`} />
              <p className="text-[44px] font-extrabold leading-[1.1] text-primary">
                {indicator.value}
              </p>
              <p className="text-base text-text-muted">{indicator.label}</p>
            </div>
          ))}
    </div>
  );
}

/* ───────────── Colonias (datos del backend) ───────────── */

/** Nombre visible de una colonia: ciudad › departamento › país. */
const colonyLabel = (colony: PublicColonyApi) =>
  colony.ciudad ?? colony.departamento ?? colony.pais;

function Colonies({
  colonies,
  loading,
}: {
  colonies: PublicColonyApi[] | null;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-16">
      <div className="flex flex-col gap-3 lg:w-[400px] lg:shrink-0">
        <h3 className="text-2xl font-bold leading-tight text-primary">
          {COLONIES_COPY.title}
        </h3>
        <p className="text-base text-text-muted">{COLONIES_COPY.body}</p>
      </div>

      {loading ? (
        <div className="flex flex-1 flex-wrap gap-3" aria-busy>
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="h-9 w-24 animate-pulse rounded-full bg-bg-card" />
          ))}
        </div>
      ) : colonies && colonies.length > 0 ? (
        <ul className="flex flex-1 flex-wrap gap-3">
          {colonies.map((colony) => (
            <li
              key={colony.codigo}
              className="flex items-center gap-1.5 rounded-full border border-bg-separator bg-bg-card py-2 pl-3 pr-4 text-sm font-semibold text-primary"
            >
              <Image src="/home/icons/pin.svg" alt="" width={16} height={16} />
              {colonyLabel(colony)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="flex-1 rounded-xl border border-dashed border-bg-border px-5 py-4 text-sm text-text-muted">
          {COLONIES_COPY.empty}
        </p>
      )}
    </div>
  );
}

/* ───────────── Plataforma ───────────── */

function Platform() {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-primary p-6 md:p-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-2xl font-bold leading-tight text-text-inverse">
            {PLATFORM_COPY.title}
          </h3>
          <p className="text-base text-text-inverse/85">{PLATFORM_COPY.body}</p>
        </div>
        <Link
          href={PLATFORM_COPY.cta.href}
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border-[1.5px] border-text-inverse px-6 py-3.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-text-inverse/10"
        >
          {PLATFORM_COPY.cta.label}
          <Image src="/home/icons/flecha-boton.svg" alt="" width={18} height={18} />
        </Link>
      </div>

      {/*
        3 columnas solo desde `lg`: en tablet las tarjetas quedaban tan angostas
        que "Superadministrador" se salía. `min-w-0` + `[overflow-wrap:anywhere]`
        garantizan que ningún título desborde su tarjeta en ningún ancho.
      */}
      <ul className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {PLATFORM_COPY.roles.map((role) => (
          <li
            key={role.title}
            className="flex min-w-0 flex-col gap-3 rounded-xl border border-text-inverse/20 bg-text-inverse/[0.08] p-6"
          >
            <p className="flex min-w-0 items-center gap-2.5 text-lg font-semibold text-text-inverse">
              <Image src={role.icon} alt="" width={22} height={22} className="shrink-0" />
              <span className="min-w-0 [overflow-wrap:anywhere]">{role.title}</span>
            </p>
            <p className="text-sm text-text-inverse/80">{role.intro}</p>
            <ul className="flex flex-wrap gap-2">
              {role.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-text-inverse/15 px-2.5 py-1 text-xs font-medium text-text-inverse"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
