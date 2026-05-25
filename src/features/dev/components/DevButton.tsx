import { Bug } from "lucide-react";
import { CSSProperties } from "react";

interface DevButtonProps {
  readonly isOpen: boolean;
  readonly onClick: () => void;
  readonly pos: { x: number; y: number } | null;
  readonly isDragging: boolean;
  readonly isReady: boolean;
  readonly getButtonStyle: (pos: { x: number; y: number } | null, isDragging: boolean) => CSSProperties;
  readonly buttonRef: React.RefObject<HTMLDivElement | null>;
}

export function DevButton({
  isOpen,
  onClick,
  pos,
  isDragging,
  isReady,
  getButtonStyle,
  buttonRef,
}: DevButtonProps) {
  return (
    <div
      ref={buttonRef}
      style={{
        ...getButtonStyle(pos, isDragging),
        visibility: isReady ? "visible" : "hidden",
      }}
      className="group"
    >
      <button
        onClick={onClick}
        className={`w-14 h-14 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center overflow-hidden relative shadow-2xl ${isOpen
            ? "bg-zinc-900 border-lime-500 rotate-90"
            : "bg-black border-zinc-700 hover:border-lime-500 hover:scale-110"
          }`}
        aria-label="Toggle Dev Console"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#4ade80_1px,transparent_1px)] [background-size:10px_10px]" />

        <Bug
          size={28}
          className={`transition-colors duration-300 ${isOpen ? "text-lime-500" : "text-zinc-500 group-hover:text-lime-400"}`}
        />
      </button>
    </div>
  );
}
