import { CSSProperties } from "react";

export const getButtonStyle = (
  pos: { x: number; y: number } | null,
  isDragging: boolean,
): CSSProperties => {
  const baseStyle: CSSProperties = {
    position: "fixed",
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: 9999,
  };

  if (pos) {
    return {
      ...baseStyle,
      left: pos.x,
      top: pos.y,
      transition: isDragging ? "none" : "left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), top 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    };
  }

  return {
    ...baseStyle,
    top: "1.5rem",
    left: "1.5rem",
  };
};

export const getPanelStyle = (
  pos: { x: number; y: number } | null,
  corner: string,
): CSSProperties => {
  const MARGIN = 12;
  const BUTTON_SIZE = 52;

  if (!pos) {
    return {
      position: "fixed",
      top: MARGIN + BUTTON_SIZE + MARGIN,
      left: MARGIN,
      cursor: "default",
      zIndex: 9999,
    };
  }

  const panelPositions: Record<string, CSSProperties> = {
    "top-left": {
      position: "fixed",
      left: pos.x,
      top: pos.y + BUTTON_SIZE + MARGIN,
      cursor: "default",
      zIndex: 9999,
    },
    "top-right": {
      position: "fixed",
      right: MARGIN,
      top: pos.y + BUTTON_SIZE + MARGIN,
      cursor: "default",
      zIndex: 9999,
    },
    "bottom-left": {
      position: "fixed",
      left: pos.x,
      bottom: typeof window !== "undefined" ? window.innerHeight - pos.y + MARGIN : MARGIN,
      cursor: "default",
      zIndex: 9999,
    },
    "bottom-right": {
      position: "fixed",
      right: MARGIN,
      bottom: typeof window !== "undefined" ? window.innerHeight - pos.y + MARGIN : MARGIN,
      cursor: "default",
      zIndex: 9999,
    },
  };

  return panelPositions[corner] || panelPositions["top-left"];
};
