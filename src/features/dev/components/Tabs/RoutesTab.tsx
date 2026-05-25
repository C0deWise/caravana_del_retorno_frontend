import { Compass } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export function RoutesTab() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[10px] text-fuchsia-500/70 font-bold uppercase tracking-widest">
        <Compass size={14} />
        <span>Navegación Rápida</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => router.push("/inicio")}
          className={`px-3 py-3 rounded-lg border text-[11px] font-black transition-all text-center ${
            pathname?.startsWith("/inicio") || pathname === "/"
              ? "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.3)]"
              : "border-zinc-800 bg-black/40 text-zinc-400 hover:text-fuchsia-400 hover:border-fuchsia-500/50"
          }`}
        >
          INICIO
        </button>
        <button
          onClick={() => router.push("/gestion")}
          className={`px-3 py-3 rounded-lg border text-[11px] font-black transition-all text-center ${
            pathname?.startsWith("/gestion")
              ? "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.3)]"
              : "border-zinc-800 bg-black/40 text-zinc-400 hover:text-fuchsia-400 hover:border-fuchsia-500/50"
          }`}
        >
          GESTIÓN
        </button>
      </div>
    </div>
  );
}
