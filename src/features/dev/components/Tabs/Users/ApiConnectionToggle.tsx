import { Wifi, WifiOff } from "lucide-react";

interface ApiConnectionToggleProps {
  readonly apiMode: boolean;
  readonly onToggle: () => void;
}

export function ApiConnectionToggle({ apiMode, onToggle }: ApiConnectionToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-black/40">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
        {apiMode ? <Wifi size={14} className="text-lime-500" /> : <WifiOff size={14} className="text-zinc-600" />}
        <span>Conexión API</span>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${apiMode ? "bg-lime-500" : "bg-zinc-700"
          }`}
      >
        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${apiMode ? "translate-x-5" : "translate-x-1"
          }`} />
      </button>
    </div>
  );
}
