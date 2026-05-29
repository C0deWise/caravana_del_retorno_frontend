interface PublicationBasicInfoProps {
  readonly titulo: string;
  readonly setTitulo: (value: string) => void;
  readonly resena: string;
  readonly setResena: (value: string) => void;
  readonly isLoading: boolean;
}

export function PublicationBasicInfo({
  titulo,
  setTitulo,
  resena,
  setResena,
  isLoading,
}: PublicationBasicInfoProps) {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="titulo" className="mb-1 block text-sm font-medium text-text-muted">
          Título
        </label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          disabled={isLoading}
          className="w-full rounded-xl border border-bg-border bg-bg-card p-3 text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
          placeholder="Ingresa el título de la publicación"
        />
      </div>

      <div>
        <label htmlFor="resena" className="mb-1 block text-sm font-medium text-text-muted">
          Contenido
        </label>
        <textarea
          id="resena"
          value={resena}
          onChange={(e) => setResena(e.target.value)}
          required
          rows={4}
          disabled={isLoading}
          className="w-full rounded-xl border border-bg-border bg-bg-card p-3 text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 resize-none"
          placeholder="Escribe el contenido de tu publicación..."
        />
      </div>
    </div>
  );
}
