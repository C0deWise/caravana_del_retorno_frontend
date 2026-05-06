import FontScalerControl from "../modules/fontScaler/components/FontScalerControl";
import { AccessibilityModule } from "../types/accessibility.types";

const fontScalerModule: AccessibilityModule = {
  id: "fontScaler",
  label: "Tamaño de letra",
  description: "Ajusta el tamaño de la tipografía de la aplicación",
  component: FontScalerControl,
};

export const modulesRegistry: AccessibilityModule[] = [fontScalerModule];
