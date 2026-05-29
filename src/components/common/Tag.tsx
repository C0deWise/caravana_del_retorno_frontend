import { ReactNode } from "react";

/**
 * Propiedades del componente base Tag.
 */
export interface TagProps {
  /** El texto que se mostrará dentro de la etiqueta. */
  readonly label: string;
  /** Clases CSS adicionales (opcional). */
  readonly className?: string;
  /** Ícono para mostrar a la izquierda del texto (opcional). */
  readonly icon?: ReactNode;
}

/**
 * Componente base para renderizar una etiqueta (Tag) visual.
 * Para mapear estados, roles o valores a colores, usa `ConfiguredTag`.
 */
export function Tag({ label, className = "", icon }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}

/**
 * Variantes de color semánticas disponibles para los Tags.
 * - `primary`: Color principal.
 * - `secondary`: Color secundario.
 * - `accent-green`: Verde para estados de éxito o positivos.
 * - `accent-red`: Rojo para estados de peligro o negativos.
 * - `accent-yellow`: Amarillo para estados de advertencia o espera.
 * - `muted`: Color apagado para elementos inactivos o expirados.
 */
export type TagColorVariant =
  | "primary"
  | "secondary"
  | "accent-green"
  | "accent-red"
  | "accent-yellow"
  | "muted";

export const TAG_COLOR_STYLES: Record<TagColorVariant, string> = {
  primary: "bg-primary/15 text-primary",
  secondary: "bg-secondary/15 text-secondary",
  "accent-green": "bg-accent-green/15 text-accent-green",
  "accent-red": "bg-accent-red/15 text-accent-red",
  "accent-yellow": "bg-accent-yellow/15 text-accent-yellow",
  muted: "bg-text-muted/15 text-text-muted",
};

/**
 * Diccionario de configuración para mapear valores a etiquetas y colores semánticos.
 */
export type TagConfigRecord<T extends string | number | symbol> = Record<
  T,
  {
    /** El texto visible que se mostrará en la etiqueta. */
    label: string;
    /**
     * El color semántico de la etiqueta.
     * Valores posibles: "primary" | "secondary" | "accent-green" | "accent-red" | "accent-yellow" | "muted"
     */
    color: TagColorVariant;
    /** Ícono opcional para esta configuración. */
    icon?: ReactNode;
  }
>;

/**
 * Propiedades del componente ConfiguredTag.
 */
interface ConfiguredTagProps<T extends string | number | symbol> {
  /** El valor a mostrar. */
  readonly value: T | string;
  /** El diccionario de configuración que define cómo se ve cada valor. */
  readonly config: Partial<TagConfigRecord<T>>;
  /** La llave por defecto a usar si el `value` no se encuentra en `config`. */
  readonly defaultKey?: T;
  /** Si es true, aplica trim() y toLowerCase() a los valores de tipo string antes de buscar. Por defecto es true. */
  readonly normalize?: boolean;
}

/**
 * Componente que renderiza un Tag basándose en un diccionario de configuración.
 *
 * @example
 * const STATUS_CONFIG: TagConfigRecord<string> = {
 *   active: { label: "Activo", color: "accent-green" },
 *   inactive: { label: "Inactivo", color: "accent-red" }
 * };
 *
 * return <ConfiguredTag value={user.status} config={STATUS_CONFIG} />
 */
export function ConfiguredTag<T extends string | number | symbol>({
  value,
  config,
  defaultKey,
  normalize = true,
}: ConfiguredTagProps<T>) {
  const normalizedValue = (
    normalize && typeof value === "string" ? value.trim().toLowerCase() : value
  ) as T;

  const matchedConfig =
    config[normalizedValue] || (defaultKey ? config[defaultKey] : undefined);

  if (!matchedConfig) return null;

  return (
    <Tag
      label={matchedConfig.label}
      className={TAG_COLOR_STYLES[matchedConfig.color]}
      icon={matchedConfig.icon}
    />
  );
}
