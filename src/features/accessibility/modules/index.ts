import { fontScalerModule } from "./fontScaler";
import { AccessibilityModule } from "../types/accessibility.types";

export const modulesRegistry: AccessibilityModule[] = [fontScalerModule];

export * from "./fontScaler";
