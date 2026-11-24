/**
 * "Franja Institucional" del prototipo: barra de 4 segmentos
 * (naranja, verde, amarillo, rojo). Se usa como separador y como eyebrow.
 * El tamaño (alto/ancho) lo define quien la usa vía `className`.
 */
export default function InstitutionalStripe({
  className = "h-2 w-full",
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`flex overflow-hidden rounded-full ${className}`}
    >
      <span className="flex-1 bg-secondary" />
      <span className="flex-1 bg-accent-green" />
      <span className="flex-1 bg-accent-yellow" />
      <span className="flex-1 bg-accent-red" />
    </span>
  );
}
