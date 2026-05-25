import { motion } from "framer-motion";
import { CSSProperties, useState } from "react";
import { X, Home, LayoutGrid } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { UsersTab } from "./Tabs/UsersTab";
import { FeaturesTab } from "./Tabs/FeaturesTab";
import { RoutesTab } from "./Tabs/RoutesTab";

interface DevPanelProps {
  readonly pos: { x: number; y: number } | null;
  readonly corner: string;
  readonly getPanelStyle: (pos: { x: number; y: number } | null, corner: string) => CSSProperties;
  readonly onClose: () => void;
}

type TabType = "users" | "features" | "routes";

export function DevPanel({ pos, corner, getPanelStyle, onClose }: DevPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<TabType>("users");

  return (
    <motion.section
      style={getPanelStyle(pos, corner)}
      className="w-80 backdrop-blur-xl bg-black/90 border border-zinc-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto z-[9999] font-mono text-zinc-400"
      initial={{ opacity: 0, scale: 0.9, y: -20, rotateX: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20, rotateX: -10 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="bg-zinc-900/50 px-4 py-3 border-b border-zinc-800 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold tracking-tighter text-zinc-500 uppercase">
            Dev Console
          </span>
          <div className="flex items-center gap-2 border-l border-zinc-700 pl-3">
            <button
              onClick={() => router.push("/inicio")}
              className={`transition-all ${pathname?.startsWith("/inicio") || pathname === "/" ? "text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] scale-110" : "text-zinc-500 hover:text-fuchsia-400"}`}
              title="Ir a Inicio"
            >
              <Home size={14} />
            </button>
            <button
              onClick={() => router.push("/gestion")}
              className={`transition-all ${pathname?.startsWith("/gestion") ? "text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)] scale-110" : "text-zinc-500 hover:text-fuchsia-400"}`}
              title="Ir a Gestión"
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === "users" ? "bg-zinc-800/50 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
        >
          Usuarios
        </button>
        <button
          onClick={() => setActiveTab("features")}
          className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === "features" ? "bg-zinc-800/50 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
        >
          Features
        </button>
        <button
          onClick={() => setActiveTab("routes")}
          className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${activeTab === "routes" ? "bg-zinc-800/50 text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
        >
          Rutas
        </button>
      </div>

      <div className="p-5 space-y-6">
        {activeTab === "users" && <UsersTab />}
        {activeTab === "features" && <FeaturesTab />}
        {activeTab === "routes" && <RoutesTab />}
      </div>
    </motion.section>
  );
}
