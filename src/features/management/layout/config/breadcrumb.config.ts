export const breadcrumbLabels: Record<string, string> = {
  "/gestion": "Panel de Gestión",
  "/gestion/usuario": "Gestión de Usuario",
  "/gestion/usuario/parentesco": "Parentesco",

  "/gestion/colonia": "Gestión de Colonia",
  "/gestion/colonia/crear": "Crear Colonia",
  "/gestion/colonia/asignar-lider": "Asignar lider de Colonia",
  "/gestion/colonia/inscribir-colonia": "Inscribirse a una Colonia",
  "/gestion/colonia/miembros": "Miembros de la Colonia*",
  "/gestion/colonia/solicitudes-ingreso": "Solicitudes de ingreso a la Colonia",

  "/gestion/retorno": "Gestión de Retorno",
  "/gestion/retorno/crear": "Crear Retorno",
  "/gestion/retorno/registro": "Registrar Formulario de inscripción",
};

export const nonClickableBreadcrumbRoutes = new Set<string>([
  "/gestion/usuario",
  "/gestion/colonia",
  "/gestion/retorno",
]);
