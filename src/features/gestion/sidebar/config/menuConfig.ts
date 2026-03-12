import { MenuItem } from "@/types/menu";

export const menuConfig: MenuItem[] = [
  {
    label: "Gestión Colonia",
    href: "/gestion/colonia",
    icon: "home",
    subitems: [
      {
        label: "Crear Colonia",
        href: "/gestion/colonia/crear",
        icon: "plus",
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
        icon: "plus",
      },
    ],
  },
];
