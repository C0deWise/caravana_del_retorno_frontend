"use client";
import { CSSProperties } from "react";
import { useDraggable } from "@/hooks/useDraggable";

interface DraggableProps {
  readonly children: React.ReactNode;
  readonly initialPosition?: {
    readonly top?: string;
    readonly right?: string;
    readonly bottom?: string;
    readonly left?: string;
  };
  readonly className?: string;
}

export function Draggable({
  children,
  initialPosition,
  className = "",
}: DraggableProps) {
  const { ref, pos } = useDraggable();

  const style: CSSProperties = pos
    ? { position: "fixed", left: pos.x, top: pos.y, cursor: "grab" }
    : { position: "fixed", cursor: "grab", ...initialPosition };

  return (
    <div ref={ref} style={style} className={`select-none ${className}`}>
      {children}
    </div>
  );
}
