import FontScalerControl from "./components/FontScalerControl";
import { AccessibilityModule } from "../../types/accessibility.types";

export const fontScalerModule: AccessibilityModule = {
  id: "fontScaler",
  label: "Tamaño de letra",
  description: "Ajusta el tamaño de la tipografía de la aplicación",
  component: FontScalerControl,
};

export * from "./types/fontScaler.types";
