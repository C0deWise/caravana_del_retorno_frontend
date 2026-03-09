
export default function Breadcrumb() {
    return (
        <div className="bg-bg border-b border-bg-border px-6 py-4">
            <div className="flex justify-between items-center">
                <div className="text-sm text-text-muted">
                    <span>Inicio &gt; </span>
                    <span className="font-semibold">Creacion de retornos</span>
                </div>
                <div className="text-right">
                    <div className="text-xs text-text-muted">Usuario</div>
                    <div className="text-sm font-semibold">Administrador</div>
                </div>
            </div>
        </div>
    );
}

export { Breadcrumb };