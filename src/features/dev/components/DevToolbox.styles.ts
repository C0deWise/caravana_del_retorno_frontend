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
      transition: isDragging ? "none" : "left 0.3s ease-out, top 0.3s ease-out 0.1s",
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
      bottom: globalThis.window === undefined ? MARGIN : window.innerHeight - pos.y + MARGIN,
      cursor: "default",
      zIndex: 9999,
    },
    "bottom-right": {
      position: "fixed",
      right: MARGIN,
      bottom: globalThis.window === undefined ? MARGIN : window.innerHeight - pos.y + MARGIN,
      cursor: "default",
      zIndex: 9999,
    },
  };

  return panelPositions[corner] || panelPositions["top-left"];
};
