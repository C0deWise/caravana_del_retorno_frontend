"use client";

import { useAccessibility } from "../../../context/AccessibilityContext";
import { useEffect } from "react";
import { FONT_SCALE_CONFIG } from "../types/fontScaler.types";

export default function FontScalerControl() {
  const { settings, updateSettings } = useAccessibility();
  const fontScale = settings.fontScale ?? FONT_SCALE_CONFIG.DEFAULT;

  useEffect(() => {
    const clampedScale = Math.max(
      FONT_SCALE_CONFIG.MIN,
      Math.min(FONT_SCALE_CONFIG.MAX, fontScale)
    );
    document.documentElement.style.setProperty("--font-scale", String(clampedScale));
  }, [fontScale]);

  const handleFontScaleChange = (newScale: number) => {
    updateSettings({
      ...settings,
      fontScale: newScale,
    });
  };

  return (
    <div>
      <label
        htmlFor="font-scale-input"
        className="block text-sm font-medium mb-2"
        style={{ color: "var(--color-text)" }}
      >
        Tamaño de letra
      </label>
      <div className="flex items-center gap-3">
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          A
        </span>
        <input
          id="font-scale-input"
          type="range"
          min={FONT_SCALE_CONFIG.MIN}
          max={FONT_SCALE_CONFIG.MAX}
          step={FONT_SCALE_CONFIG.STEP}
          value={fontScale}
          onChange={(e) =>
            handleFontScaleChange(Number.parseFloat(e.currentTarget.value))
          }
          className="flex-1 cursor-pointer"
          style={{
            accentColor: "var(--color-primary)",
          }}
          aria-label="Ajustar tamaño de letra"
          aria-valuemin={FONT_SCALE_CONFIG.MIN}
          aria-valuemax={FONT_SCALE_CONFIG.MAX}
          aria-valuenow={fontScale}
        />
        <span className="text-xl" style={{ color: "var(--color-text-muted)" }}>
          A
        </span>
      </div>
      <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
        Escala: {(fontScale * 100).toFixed(0)}%
      </p>
    </div>
  );
}
