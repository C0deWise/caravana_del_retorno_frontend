"use client";

import { useAccessibility } from "../context/AccessibilityContext";
import { modulesRegistry } from "../config/registry";

export default function AccessibilityToolbox() {
  const { resetSettings, isOpen, togglePanel } = useAccessibility();

  return (
    <>
      <button
        onClick={togglePanel}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-text-inverse)",
        }}
        aria-label="Abrir panel de accesibilidad"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <span className="text-lg">♿</span>
      </button>

      {isOpen && (
        <section
          id="accessibility-panel"
          aria-label="Controles de accesibilidad"
          className="fixed bottom-20 right-6 z-40 w-72 rounded-lg shadow-xl p-6 space-y-6 max-h-96 overflow-y-auto"
          style={{
            backgroundColor: "var(--color-bg-card)",
            border: "1px solid var(--color-bg-border)",
          }}
        >
          <div>
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: "var(--color-primary)" }}
            >
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
              className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: "var(--color-bg-border)",
                color: "var(--color-text)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-primary)";
                e.currentTarget.style.color = "var(--color-text-inverse)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-bg-border)";
                e.currentTarget.style.color = "var(--color-text)";
              }}
              aria-label="Restaurar configuración de accesibilidad predeterminada"
            >
              Restaurar predeterminados
            </button>
          </div>
        </section>
      )}
    </>
  );
}
