export const segmentNames: Record<string, string> = {
  gestion: "Gestión",
  colonia: "Colonia",
  retorno: "Retorno",
};

export function formatSegment(segment: string): string {
  return (
    segmentNames[segment] ??
    segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
