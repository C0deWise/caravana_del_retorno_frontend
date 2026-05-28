"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useDev } from "../context/DevContext";
import { useMagneticDraggable } from "@/hooks/useMagneticDraggable";
import { getButtonStyle, getPanelStyle } from "./DevToolbox.styles";
import { DevButton } from "./DevButton";
import { DevPanel } from "./DevPanel";

export default function DevToolboxWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <DevToolbox />;
}

function DevToolbox() {
  const { isDev } = useDev();

  const [isOpen, setIsOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<"top-left" | "top-right" | "bottom-left" | "bottom-right">("top-right");

  const togglePanel = () => setIsOpen((prev) => !prev);

  const { ref, pos, corner, hasMoved, isDragging, isReady } =
    useMagneticDraggable(setButtonPosition, buttonPosition);

  const wasOpenRef = useRef(false);
  const prevDraggingRef = useRef(false);

  useEffect(() => {
    if (isDragging && !prevDraggingRef.current) {
      wasOpenRef.current = isOpen;
      if (isOpen) {
        setIsOpen(false);
      }
    } else if (!isDragging && prevDraggingRef.current && wasOpenRef.current) {
      setIsOpen(true);
    }
    prevDraggingRef.current = isDragging;
  }, [isDragging, isOpen]);

  const handleButtonClick = () => {
    if (!hasMoved.current) {
      togglePanel();
    }
  };

  if (!isDev) return null;

  return (
    <>
      <style>{`
        .dev-dropdown-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .dev-dropdown-scrollbar::-webkit-scrollbar-track {
          background: rgba(24, 24, 27, 0.5); /* zinc-900/50 */
        }
        .dev-dropdown-scrollbar::-webkit-scrollbar-thumb {
          background: #84cc16; /* lime-500 */
          border-radius: 9999px;
        }
      `}</style>

      <DevButton
        isOpen={isOpen}
        onClick={handleButtonClick}
        pos={pos}
        isDragging={isDragging}
        isReady={isReady}
        getButtonStyle={getButtonStyle}
        buttonRef={ref}
      />

      <AnimatePresence>
        {isOpen && (
          <DevPanel
            pos={pos}
            corner={corner}
            getPanelStyle={getPanelStyle}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
