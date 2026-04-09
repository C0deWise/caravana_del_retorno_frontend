import { MenuItem } from "@/features/management/layout/sidebar/types/menu.types";

export const menuConfig: MenuItem[] = [
  {
    label: "Gestión de Colonia",
    href: "/gestion/colonia",
    icon: "home",
    subitems: [
      {
        label: "Crear",
        href: "/gestion/colonia/crear",
      },
      {
        label: "Asignar lider",
        href: "/gestion/colonia/asignar-lider",
      },
      {
        label: "Inscribirse",
        href: "/gestion/colonia/inscribir-colonia",
      },
      {
        label: "Miembros",
        href: "/gestion/colonia/miembros",
      },
      {
        label: "Solicitudes de ingreso",
        href: "/gestion/colonia/solicitudes-ingreso",
      },
    ],
  },
  {
    label: "Gestión Retorno",
    href: "/gestion/retorno",
    icon: "arrowLeft",
    subitems: [
      {
        label: "Crear Retorno",
        href: "/gestion/retorno/crear",
      },
    ],
  },
];
