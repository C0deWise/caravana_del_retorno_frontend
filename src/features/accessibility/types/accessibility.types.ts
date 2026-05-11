import { ComponentType } from "react";

export interface AccessibilityModule {
  id: string;
  label: string;
  description?: string;
  component: ComponentType;
}

export interface AccessibilitySettings {
  fontScale?: number;
  // Agregar nuevas propiedades aquí cuando se creen nuevos módulos
}
