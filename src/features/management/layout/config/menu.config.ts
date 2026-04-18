import { MenuItem } from "@/features/management/layout/types/menu.types";

export const menuConfig: MenuItem[] = [
  {
    label: "Gestión de Usuario",
    href: "/gestion/usuario",
    icon: "user",
    subitems: [
      {
        label: "Parentesco",
        href: "/gestion/usuario/parentesco",
      },
    ],
  },
  {
    label: "Gestión de Colonia",
    href: "/gestion/colonia",
    icon: "home",
    subitems: [
      {
        label: "Crear Colonia",
        href: "/gestion/colonia/crear",
      },
      {
        label: "Asignar lider de Colonia",
        href: "/gestion/colonia/asignar-lider",
      },
      {
        label: "Inscribirse a una Colonia",
        href: "/gestion/colonia/inscribir-colonia",
      },
      {
        label: "Miembros de la Colonia",
        href: "/gestion/colonia/miembros",
      },
      {
        label: "Solicitudes de ingreso a la Colonia",
        href: "/gestion/colonia/solicitudes-ingreso",
      },
    ],
  },
  {
    label: "Gestión Retorno",
    href: "/gestion/retorno",
    icon: "arrowTurnLeft",
    subitems: [
      {
        label: "Crear Retorno",
        href: "/gestion/retorno/crear",
      },
      {
        label: "Registrar Formulario de inscripción",
        href: "/gestion/retorno/registro/inscripcion",
      },
      {
        label: "Cancelar inscripción a Retorno",
        href: "/gestion/retorno/registro/cancelar",
      },
    ],
  },
];
