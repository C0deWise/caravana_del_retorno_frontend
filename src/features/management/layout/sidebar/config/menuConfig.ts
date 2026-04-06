import { MenuItem } from "@/features/management/layout/sidebar/types/menu.types";

export const menuConfig: MenuItem[] = [
  {
    label: "Gestión Colonia",
    href: "/gestion/colonia",
    icon: "home",
    subitems: [
      {
        label: "Crear Colonia",
        href: "/gestion/colonia/crear",
      },
      {
        label: "Asignar lider de colonia",
        href: "/gestion/colonia/asignar-lider",
      },
      {
        label: "Inscribir Colonia",
        href: "/gestion/colonia/inscribir-colonia",
      },
      {
        label: "Miembros",
        href: "/gestion/colonia/miembros",
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
