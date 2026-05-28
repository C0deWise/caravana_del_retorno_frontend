import { ToggleRight } from "lucide-react";
import { useDev } from "../../context/DevContext";

export function FeaturesTab() {
  const { featureFlags, setFeatureFlag } = useDev();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-[10px] text-amber-500/70 font-bold uppercase tracking-widest">
        <ToggleRight size={14} />
        <span>Feature Flags</span>
      </div>
      <div className="space-y-2">
        {Object.entries(featureFlags).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-black/40">
            <span className="text-[10px] font-mono text-zinc-300">{key}</span>
            <button
              onClick={() => setFeatureFlag(key as any, !value)}
              className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
                value ? "bg-amber-500" : "bg-zinc-700"
              }`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                value ? "translate-x-4" : "translate-x-1"
              }`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
