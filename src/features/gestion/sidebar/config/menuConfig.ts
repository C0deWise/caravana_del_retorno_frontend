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
      },
      {
        label: "Establecer lider de Colonia",
        href: "/gestion/colonia/establecer-lider",
        icon: "home",
        subitems: [
          {
            label: "establecer vice",
            href: "/vice",
            icon: "home",
            subitems: [
              { label: "test 1", href: "/test1" },
              { label: "test 2", href: "/test2" },
            ],
          },
          {
            label: "establecer secretario",
            href: "/secretario",
          },
        ],
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
