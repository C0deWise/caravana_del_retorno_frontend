"use client";
import { CSSProperties } from "react";
import { useDraggable } from "../hooks/useDraggable";

interface DraggableProps {
  children: React.ReactNode;
  initialPosition?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  className?: string;
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
