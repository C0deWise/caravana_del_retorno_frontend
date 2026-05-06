"use client";

import { Accessibility } from "lucide-react";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAccessibility } from "../context/AccessibilityContext";
import { modulesRegistry } from "../config/registry";
import { useDraggableAccessibility } from "../hooks/useDraggableAccessibility";
import { getButtonStyle, getPanelStyle } from "./AccessibilityToolbox.styles";

export default function AccessibilityToolbox() {
  const {
    resetSettings,
    isOpen,
    togglePanel,
    buttonPosition,
    updateButtonPosition,
  } = useAccessibility();
  const { ref, pos, corner, hasMoved, isDragging, isReady } =
    useDraggableAccessibility(updateButtonPosition, buttonPosition);
  const wasOpenRef = useRef(false);
  const prevDraggingRef = useRef(false);

  useEffect(() => {
    if (isDragging && !prevDraggingRef.current) {
      wasOpenRef.current = isOpen;
      if (isOpen) {
        togglePanel();
      }
    } else if (!isDragging && prevDraggingRef.current && wasOpenRef.current) {
      togglePanel();
    }
    prevDraggingRef.current = isDragging;
  }, [isDragging, isOpen, togglePanel]);

  const handleButtonClick = () => {
    if (!hasMoved.current) {
      togglePanel();
    }
  };

  return (
    <>
      <div
        ref={ref}
        style={{ ...getButtonStyle(pos, isDragging), visibility: isReady ? "visible" : "hidden" }}
      >
        <button
          onClick={handleButtonClick}
          className="w-12 h-12 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 flex items-center justify-center bg-secondary text-text-inverse"
          aria-label="Abrir panel de accesibilidad"
          aria-expanded={isOpen}
          aria-controls="accessibility-panel"
        >
          <Accessibility size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            id="accessibility-panel"
            aria-label="Controles de accesibilidad"
            style={getPanelStyle(pos, corner)}
            className="w-72 rounded-lg shadow-xl p-6 space-y-6 max-h-96 overflow-y-auto bg-bg-card border border-bg-border pointer-events-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div>
              <h2 className="text-lg font-semibold mb-4 text-secondary">
                Accesibilidad
              </h2>
            </div>

            <div className="space-y-4">
              {modulesRegistry.map((module) => (
                <div key={module.id}>
                  {typeof module.component === "function" && <module.component />}
                </div>
              ))}

              <button
                onClick={resetSettings}
                className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-bg-border text-text hover:bg-secondary hover:text-text-inverse"
                aria-label="Restaurar configuración de accesibilidad predeterminada"
              >
                Restaurar predeterminados
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
