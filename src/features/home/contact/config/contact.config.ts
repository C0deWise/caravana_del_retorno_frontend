import type { ContactPerson } from "../types/contact.types";

/**
 * Contactos de la Caravana del Retorno (página pública "Contacto").
 *
 * ⚠️ Datos pendientes de confirmar: los correos y los nombres marcados como
 * `null` no se han proporcionado aún. Completarlos aquí cuando el equipo los
 * entregue; mientras sean `null`, la tarjeta no los muestra.
 * Las descripciones de rol se basan en lo que la plataforma ya describe
 * (sección "¿Quiénes somos?"): revisarlas con la organización.
 */
export const CONTACT_COPY = {
  eyebrow: "Contacto",
  title: "Escríbenos",
  body: "Estas son las personas que organizan la Caravana del Retorno. Escríbele a quien corresponda según tu colonia o tu consulta.",
  emailLabel: "Escribir correo",
  emailPending: "Correo de contacto próximamente",
};

export const CONTACTS: readonly ContactPerson[] = [
  {
    key: "presidencia",
    role: "Presidenta",
    scope: "Caravana del Retorno",
    name: "Andrea Montilla",
    description:
      "Lidera la organización general de la Caravana del Retorno y coordina a las colonias y al comité organizador.",
    email: null,
    photo: null,
    accent: "primary",
  },
  {
    key: "colonia-cali",
    role: "Presidente de Colonia",
    scope: "Colonia Cali",
    name: null,
    description:
      "Gestiona los retornantes y las publicaciones de la colonia de florencianos en Cali.",
    email: null,
    photo: null,
    accent: "secondary",
  },
  {
    key: "colonia-popayan",
    role: "Presidente de Colonia",
    scope: "Colonia Popayán",
    name: null,
    description:
      "Gestiona los retornantes y las publicaciones de la colonia de florencianos en Popayán.",
    email: null,
    photo: null,
    accent: "accent-green",
  },
  {
    key: "colonia-bogota",
    role: "Presidente de Colonia",
    scope: "Colonia Bogotá",
    name: null,
    description:
      "Gestiona los retornantes y las publicaciones de la colonia de florencianos en Bogotá.",
    email: null,
    photo: null,
    accent: "accent-yellow",
  },
  {
    key: "comite-florencia",
    role: "Comité de Organización",
    scope: "Florencia, Cauca",
    name: null,
    description:
      "Organiza en Florencia la llegada de las caravanas: programación, actividades culturales, hospedaje y logística local.",
    email: null,
    photo: null,
    accent: "accent-red",
  },
];
