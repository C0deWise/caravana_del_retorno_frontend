# Feature de Accesibilidad

Sistema modular de accesibilidad que permite agregar fácilmente nuevas funcionalidades de accesibilidad sin modificar el componente principal.

## Arquitectura

```
src/features/accessibility/
├── types/                              # Tipos globales
│   └── accessibility.types.ts
├── context/                            # Estado centralizado
│   └── AccessibilityContext.tsx
├── config/                             # Configuración
│   └── modulesRegistry.ts             # Registro de módulos activos
├── modules/                            # Módulos independientes
│   ├── fontScaler/
│   │   ├── types/
│   │   │   └── fontScaler.types.ts    # Tipos específicos del módulo
│   │   ├── components/
│   │   │   └── FontScalerControl.tsx  # UI del módulo
│   │   └── index.ts                   # Exporta módulo como objeto
│   └── index.ts                        # Exporta todos los módulos
├── components/
│   └── AccessibilityToolbox.tsx        # Componente genérico que renderiza módulos
├── providers/
│   └── AccessibilityWrapper.tsx        # Wrapper del provider
├── index.ts                            # Exportaciones públicas
└── README.md                           # Este archivo
```

## Características Actuales

- **Font Scaler**: Ajusta el tamaño de letra de 0.9x a 2x (conforme a WCAG)

## Uso

### En el Layout (ya configurado)

```tsx
import AccessibilityWrapper from "@/features/accessibility/providers/AccessibilityWrapper";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AccessibilityWrapper>
          {children}
        </AccessibilityWrapper>
      </body>
    </html>
  );
}
```

### Usar el Hook en Componentes

```tsx
import { useAccessibility } from "@/features/accessibility";

export default function MyComponent() {
  const { settings, updateSettings, resetSettings } = useAccessibility();

  return (
    <div>
      <p>Font Scale: {settings.fontScale}</p>
      <button onClick={() => updateSettings({ ...settings, fontScale: 1.2 })}>
        Aumentar
      </button>
    </div>
  );
}
```

## Agregar Nuevo Módulo

### 1. Crear la estructura del módulo

```
src/features/accessibility/modules/newFeature/
├── types/
│   └── newFeature.types.ts
├── components/
│   └── NewFeatureControl.tsx
└── index.ts
```

### 2. Definir tipos

```tsx
// modules/newFeature/types/newFeature.types.ts
export interface NewFeatureSettings {
  enabled: boolean;
  value?: string;
}
```

### 3. Crear componente

```tsx
// modules/newFeature/components/NewFeatureControl.tsx
"use client";

import { useAccessibility } from "../../../context/AccessibilityContext";

export default function NewFeatureControl() {
  const { settings, updateSettings } = useAccessibility();
  
  return (
    <div>
      {/* UI del módulo */}
    </div>
  );
}
```

### 4. Exportar como módulo

```tsx
// modules/newFeature/index.ts
import NewFeatureControl from "./components/NewFeatureControl";
import { AccessibilityModule } from "../../types/accessibility.types";

export const newFeatureModule: AccessibilityModule = {
  id: "newFeature",
  label: "Nueva Funcionalidad",
  description: "Descripción de la nueva funcionalidad",
  component: NewFeatureControl,
};
```

### 5. Registrar en el sistema

```tsx
// config/modulesRegistry.ts
import { fontScalerModule } from "../modules/fontScaler";
import { newFeatureModule } from "../modules/newFeature";  // ← Agregar aquí
import { AccessibilityModule } from "../types/accessibility.types";

export const modulesRegistry: AccessibilityModule[] = [
  fontScalerModule,
  newFeatureModule,  // ← Registrar aquí
];
```

## Estado Centralizado

Todos los módulos comparten estado a través de `AccessibilityContext`:

```tsx
const { 
  settings,        // Objeto con toda la configuración de accesibilidad
  updateSettings,  // Actualiza settings (guarda en localStorage)
  resetSettings,   // Restaura valores por defecto
  isOpen,          // Panel abierto/cerrado
  togglePanel      // Abre/cierra el panel
} = useAccessibility();
```

**Nota**: El contexto maneja la persistencia automáticamente en `localStorage` bajo la clave `accessibility_settings`.

## Variables CSS

El módulo fontScaler modifica `--font-scale` que está integrado en todas las tipografías:

```css
:root {
  --font-scale: 1;
}

--text-base: calc(1rem * var(--font-scale));
--text-lg: calc(1.125rem * var(--font-scale));
/* etc... */
```

## Ventajas de esta Arquitectura

✅ **Modular**: Cada funcionalidad es independiente  
✅ **Escalable**: Agregar nuevas funcionalidades es trivial  
✅ **Desacoplado**: El Toolbox no conoce detalles de cada módulo  
✅ **Centralizado**: Un único contexto para todo el estado  
✅ **Persistente**: Automáticamente guarda en localStorage  

## Próximas Funcionalidades Propuestas

- [ ] Contraste Alto
- [ ] Reducir Animaciones
- [ ] Modo Oscuro
- [ ] Espaciado Aumentado
