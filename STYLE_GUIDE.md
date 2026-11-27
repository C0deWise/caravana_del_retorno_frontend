# Guía de Estilo — Caravana del Retorno (Frontend)

Documento de referencia base extraído del diseño del formulario de registro (`/auth/registro`). Todo nuevo módulo, layout o refactorización del frontend debe alinearse con estos lineamientos para mantener coherencia visual, accesibilidad y comportamiento responsive en desktop, tablet (iPad) y móvil.

---

## 1. Paleta de Colores y Tipografía

Definidos en `src/app/globals.css` (`@theme`):

- **Fuente principal:** `Inter` (`--font-inter` / `--font-sans`) con soporte de escala accesible vía `--font-scale`.
- **Colores principales:**
  - `primary` (`#024059`): Azul institucional profundo. Se usa en títulos principales (`h1`, `h2`), estados activos, bordes en foco (`focus:border-primary`) y anillos de foco (`ring-primary/50`).
  - `secondary` (`#f28f38`): Naranja cálido. Se usa en acciones principales / CTAs, enlaces activos y highlights (`hover:text-secondary`).
  - `accent-green` (`#038c4a`): Verde éxito. Se usa en confirmaciones, checks de completado y barras de progreso.
  - `accent-red` (`#ec1e25`): Rojo alerta/error. Se usa en bordes e indicaciones de error y botones de cierre/peligro.
  - `accent-yellow` (`#ffb900`): Amarillo de acento.
- **Textos:**
  - `text` (`#343434`): Texto principal.
  - `text-muted` (`#707070`): Texto secundario, iconos sutiles y placeholders auxiliares.
  - `text-inverse` (`#ffffff`): Texto sobre fondos oscuros o botones de color.

---

## 2. Identidad Institucional (Firma Tricolor / Cuatricolor)

- **Componente:** `src/components/layout/HorizontalSeparator.tsx` (`HorizontalSeparator`)
- **Uso:** Barra decorativa de 4 franjas iguales (`#f28f38`, `#038c4a`, `#eabe03`, `#ec1e25`) colocada dentro de un contenedor `h-1 w-full rounded-full overflow-hidden` debajo de los subtítulos de sección (`h2`).
- **Separadores internos en listas/dropdowns:** Barra degradada tipo pill centrada:
  ```tsx
  <div className="py-1.5 flex items-center justify-center">
    <div className="h-1 w-full rounded-full bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />
  </div>
  ```

---

## 3. Fondo Ambiental

El estilo glassmorphism depende de un fondo con color suave detrás para tener profundidad:

- **Recurso principal:** `public/backgrounds/mesh.webp`
- **Implementación base** (`src/app/auth/registro/page.tsx`):
  ```tsx
  <Image
    src="/backgrounds/mesh.webp"
    alt="Fondo ambiental"
    fill
    sizes="100vw"
    priority
    className="object-cover absolute inset-0 -z-10 blur-3xl scale-140"
    unoptimized
  />
  ```
- **Alternativa / textura complementaria:** `public/backgrounds/topography.svg` (disponible en `public/backgrounds/`).

---

## 4. Superficies Glassmorphism (Tarjetas, Paneles y Modales)

### Tarjeta / Panel Principal
- **Clases base:**
  ```text
  bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl rounded-4xl
  ```
- En paneles de gestión o contenedores internos (sidebar, breadcrumb, tarjetas de sección), usar variaciones consistentes como:
  ```text
  bg-white/65 backdrop-blur-xl border border-white/50 shadow-xl rounded-2xl
  ```

### Modales (`FrostedModal` + `AnimatedModal`)
- **Backdrop** (`src/components/feedback/AnimatedModal.tsx`): `bg-black/15 backdrop-blur-sm`
- **Cuerpo del modal** (`src/components/feedback/FrostedModal.tsx`):
  ```text
  bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40
  ```
- **Botón de cierre:** Circular flotante en la esquina superior derecha (`rounded-full bg-red-500 text-white hover:bg-red-600 shadow-md`).

---

## 5. Controles de Formulario y Botones

### Inputs, Selects y DatePicker
- **Componentes reutilizables obligatorios:**
  - `src/components/forms/InputField.tsx`
  - `src/components/forms/SelectField.tsx` (`src/components/forms/select.styles.ts`)
  - `src/components/forms/DatePickerField.tsx` (`src/components/forms/datepicker.styles.css`)
  - `src/components/forms/CountrySelect.tsx`
- **Estilo unificado de campos:**
  - Bordes `rounded-xl`, `border-gray-300`, fondo `bg-white`, padding `px-4 py-3`.
  - Estado focus: `ring-2 ring-primary/50 border-primary`.
  - Estado error: `border-accent-red` + mensaje en `text-accent-red text-xs font-medium`.
  - Estado deshabilitado: `disabled:opacity-60 disabled:bg-gray-50 disabled:cursor-not-allowed`.
  - Placeholders: `text-gray-400/60`.
  - En móvil, evitar teclado en campos de selección (`readOnly` + `inputMode="none"` en DatePicker, `isSearchable={false}` en selects cortos).

### Botones
- **CTA Primario:**
  ```text
  bg-secondary hover:bg-secondary/90 text-white font-medium py-3 px-6 sm:px-8 rounded-xl transition-all shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed
  ```
- **Secundario / Neutral:**
  ```text
  border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-xl transition-all
  ```
- **Fantasma / Regresar:**
  ```text
  text-gray-500 hover:text-gray-800 hover:bg-white/50 font-medium py-3 px-6 rounded-xl transition-all
  ```

### Iconografía
- `lucide-react` para acciones, formularios y UI general.
- `@heroicons/react/24/outline` y `@heroicons/react/24/solid` para navegación, chevrons y encabezados.
- **Regla:** No usar caracteres ASCII/Unicode (`→`, `←`, `×`) como iconos de acción o navegación; usar siempre iconos reales de las librerías disponibles (`ArrowRight`, `ChevronRightIcon`, `XMarkIcon`, etc.).

---

## 6. Animaciones (`framer-motion`)

- **Transiciones entre vistas/pasos:** rápidas y suaves (`duration: 0.15` a `0.2`, `ease: "easeInOut"`), con `AnimatePresence mode="wait"`.
- **Entrada de modales:** `initial={{ opacity: 0, scale: 0.95, y: 20 }}` → `animate={{ opacity: 1, scale: 1, y: 0 }}`.
- **Feedback visual:** `animate-ping` sutil para el paso/estado activo, spinner `animate-spin` en botones durante peticiones, barras de progreso `rounded-full` con `bg-accent-green`, y microinteracciones `active:scale-[0.98]` + `group-hover:translate-x-1` en tarjetas clicables.
- **Textos largos en espacios reducidos:** Usar `MarqueeText` (`src/components/common/MarqueeText.tsx`) en ítems de menú lateral o etiquetas estrechas donde `truncate` ocultaría información importante.

---

## 7. Reglas Responsive (Desktop, iPad/Tablet y Móvil)

1. **Viewport móvil seguro:** Usar `100dvh` (`min-h-[100dvh]` o `h-[100dvh]`) para evitar saltos con la barra de direcciones en iOS/Android.
2. **Espaciados adaptativos:**
   - Externos: `px-4 sm:px-6 md:px-8`
   - Internos en tarjetas: `px-5 md:px-8 lg:px-12`
3. **Grids y acciones:**
   - Formularios y tarjetas en 2 columnas desde `md:` (`grid-cols-1 md:grid-cols-2 gap-4 md:gap-6`).
   - Grupos de botones en columna en móvil (`flex-col-reverse sm:flex-row`, `w-full sm:w-auto`).
4. **Alturas flexibles:** Nunca encerrar formularios o bloques dinámicos en alturas fijas con `overflow-hidden` (usar `height: "auto"` o contenedores con scroll limpio) para que errores o mensajes no recorten botones.
5. **Navegación en móvil y tablet (`< md` / `< lg`):**
   - Evitar sidebars fijos de ancho amplio (`320px`) ocupando la pantalla en móvil/tablet: usar drawer deslizable con backdrop en pantallas pequeñas y barra colapsable en tablet/desktop.
   - Evitar títulos/acciones horizontales sin `truncate` o `flex-wrap` que desborden el header o breadcrumb.
