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
        label: "Administrar Colonias",
        href: "/gestion/colonia/administrar",
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
        href: "/gestion/retorno/registro",
      },
    ],
  },
];
