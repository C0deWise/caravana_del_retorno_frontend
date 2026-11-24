/**
 * Contenido editorial estático de la landing, tomado literalmente del
 * prototipo de Figma "Caravana del Retorno – Quiénes somos + Historia".
 *
 * Reglas:
 *  - Aquí solo vive TEXTO INSTITUCIONAL (lema, valores, pilares, roles).
 *  - Ninguna cifra ni descripción de fotografías se define aquí: las cifras
 *    llegan del backend (`useLandingData`) y las fotos no llevan leyenda.
 *  - Las rutas de imágenes siguen la nomenclatura de `public/fotos` y `public/logos`.
 */

/* ───────────── Hero / carrusel ───────────── */

/**
 * Fotos del carrusel, en el mismo orden que los 5 slides del prototipo.
 * Sin leyendas: el prototipo traía textos de ejemplo que no están verificados.
 */
export const HERO_SLIDES: readonly string[] = [
  "/fotos/foto-retorno-02.jpeg",
  "/fotos/foto-retorno-07.jpeg",
  "/fotos/foto-retorno-01.jpeg",
  "/fotos/foto-retorno-04.jpeg",
  "/fotos/foto-retorno-09.jpeg",
];

/** Tiempo entre slides (prototipo: "avance automático cada 5 s"). */
export const HERO_AUTOPLAY_MS = 5000;


export const HERO_COPY = {
  location: "Florencia, Cauca",
  motto: "Volvemos a nuestras raíces, volvemos a nuestra gente.",
  cta: { label: "Sé parte del Retorno", href: "/auth/registro" },
};

/* ───────────── Barra de valores ───────────── */

export interface ValueItem {
  title: string;
  description: string;
  icon: string;
}

export const VALUES: readonly ValueItem[] = [
  {
    title: "Reencuentro",
    description: "Con nuestra gente y nuestras raíces",
    icon: "/home/icons/valor-reencuentro.svg",
  },
  {
    title: "Comunidad",
    description: "Unidos por el amor a nuestra tierra",
    icon: "/home/icons/valor-comunidad.svg",
  },
  {
    title: "Orgullo",
    description: "Por lo que somos y de dónde venimos",
    icon: "/home/icons/valor-orgullo.svg",
  },
  {
    title: "Cultura",
    description: "Tradiciones que nos conectan",
    icon: "/home/icons/valor-cultura.svg",
  },
];

/* ───────────── ¿Quiénes somos? ───────────── */

export const ABOUT_COPY = {
  eyebrow: "¿Quiénes somos?",
  title: "Somos Florencianos que siguen trazando su camino a casa",
  /**
   * Texto institucional. El año de inicio de la organización aún no está
   * confirmado: mientras `foundingYear` sea `null` la frase "desde {año}"
   * se omite. NO poner un año sin confirmarlo con el equipo.
   */
  foundingYear: null as number | null,
  body: (foundingYear: number | null) =>
    `La Caravana del Retorno nace de los florencianos que un día salimos a estudiar o trabajar lejos pero aún llevamos a Florencia en el corazón. Esto generó${
      foundingYear ? ` desde ${foundingYear}` : ""
    } una organización conjunta entre todos para unir esfuerzos y retornar, aunque sea unos días, al lugar de donde yacen nuestras raíces. Hoy somos colonias que se reencuentran con su gente y sus tradiciones en una gran caravana que abraza la Comunidad Florenciana.`,
  capabilitiesTitle: "Esta plataforma nos permite:",
  capabilities: [
    "Organizar caravanas",
    "Reunir colonias",
    "Gestionar retornantes",
    "Divulgar noticias",
    "Conservar memoria histórica",
    "Canalizar donaciones",
  ],
  /** Foto del bloque institucional. Decorativa: no se describe su contenido. */
  photo: "/fotos/foto-retorno-10.jpeg",
};

/** Colores de acento por tarjeta: corresponden a los tokens de `globals.css`. */
export type AccentColor = "secondary" | "accent-green" | "accent-yellow" | "accent-red";

export interface PillarItem {
  title: string;
  description: string;
  icon: string;
  accent: AccentColor;
}

export const PILLARS_TITLE = "Nuestros pilares";

export const PILLARS: readonly PillarItem[] = [
  {
    title: "Colonias",
    description:
      "Agrupan a los florencianos por ciudad para organizarse, viajar juntos y mantenerse en contacto.",
    icon: "/home/icons/pilar-colonias.svg",
    accent: "secondary",
  },
  {
    title: "Caravana del Retorno",
    description:
      "Cada caravana es un reencuentro planificado: programación, actividades culturales, transporte, hospedaje y carnaval.",
    icon: "/home/icons/pilar-caravana.svg",
    accent: "accent-green",
  },
  {
    title: "Donaciones",
    description:
      "Canalizamos aportes transparentes para obras y actividades que benefician a Florencia.",
    icon: "/home/icons/pilar-donaciones.svg",
    accent: "accent-yellow",
  },
  {
    title: "Comunidad",
    description:
      "Preservamos la memoria colectiva con fotografías, videos y testimonios de varias generaciones.",
    icon: "/home/icons/pilar-comunidad.svg",
    accent: "accent-red",
  },
];

/** Etiquetas de los indicadores. Los valores SIEMPRE vienen del backend. */
export const INDICATOR_LABELS = {
  colonias: "Colonias activas",
  retornos: "Retornos realizados",
  publicaciones: "Publicaciones históricas",
} as const;

export const COLONIES_COPY = {
  title: "Colonias que nos reúnen",
  body: "Florencianos organizados desde distintas ciudades de Colombia. Cada colonia tiene un presidente que gestiona sus retornantes y publicaciones.",
  empty: "Las colonias aparecerán aquí en cuanto estén disponibles.",
};

/* ───────────── Video final ───────────── */

/**
 * Canción de un florenciano sobre el regreso (aportada por el equipo).
 * Solo se guarda el ID de YouTube; no se asumen título, autor ni fecha.
 * URL original: https://youtu.be/DfjcxOFzw24
 */
export const SONG_VIDEO = {
  youtubeId: "DfjcxOFzw24",
  eyebrow: "Somos Pueblo",
  phrase: "Florencianos que nos transmiten la vuelta a casa.",
  iframeTitle: "Canción de un florenciano sobre el regreso",
};

export interface RoleItem {
  title: string;
  intro: string;
  tags: readonly string[];
  icon: string;
}

export const PLATFORM_COPY = {
  title: "Una plataforma para toda la comunidad",
  body: "Detrás del portal público hay un sistema con usuarios, colonias y roles.",
  cta: { label: "Ingresar a la plataforma", href: "/gestion" },
  roles: [
    {
      title: "Retornantes",
      intro: "Se registran con su colonia y reservan:",
      tags: ["Hospedaje", "Transporte", "Parqueadero"],
      icon: "/home/icons/rol-retornantes.svg",
    },
    {
      title: "Presidentes de Colonia",
      intro: "Gestionan para su colonia:",
      tags: ["Publicaciones", "Reportes", "Retornantes"],
      icon: "/home/icons/rol-presidentes.svg",
    },
    {
      title: "Superadministrador",
      intro: "Administra la plataforma:",
      tags: ["Caravanas", "Colonias", "Presidentes de Colonia"],
      icon: "/home/icons/rol-superadmin.svg",
    },
  ] as readonly RoleItem[],
};
