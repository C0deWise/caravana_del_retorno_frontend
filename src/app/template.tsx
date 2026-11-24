"use client";

import { useEffect, useRef, useState } from "react";
import Spinner from "@/ui/animations/Spinner";

/**
 * Plantilla raíz: envuelve TODAS las rutas y se vuelve a montar en cada
 * navegación. Mantiene el contenido oculto hasta que cargan sus imágenes
 * (máximo `MAX_WAIT_MS`) para evitar saltos de diseño.
 *
 * La pantalla de carga (spinner) ya NO aparece por defecto: solo se muestra
 * si la carga tarda más de `SPINNER_DELAY_MS`. Si todo está listo antes,
 * la página aparece directamente, sin parpadeo del spinner.
 */
const SPINNER_DELAY_MS = 350;
const MAX_WAIT_MS = 2000;

export default function Template({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Timeout de seguridad: si las imágenes tardan más, mostramos la página de todas formas.
    const maxWait = setTimeout(() => setLoading(false), MAX_WAIT_MS);
    // El spinner solo entra si hay una demora perceptible.
    const spinnerDelay = setTimeout(() => setShowSpinner(true), SPINNER_DELAY_MS);

    const clearTimers = () => {
      clearTimeout(maxWait);
      clearTimeout(spinnerDelay);
    };

    if (!containerRef.current) {
      return clearTimers;
    }

    // Solo las imágenes de carga inmediata. Las `loading="lazy"` (la mayoría de
    // next/image y las galerías) no cargan hasta hacer scroll: esperarlas
    // hacía que siempre se agotara MAX_WAIT_MS y saliera el spinner.
    const images = Array.from(
      containerRef.current.querySelectorAll<HTMLImageElement>("img"),
    ).filter((img) => img.loading !== "lazy");

    function waitForLoad(img: HTMLImageElement) {
      return new Promise<void>((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      });
    }

    const promise =
      images.length === 0
        ? Promise.resolve()
        : Promise.all(images.map(waitForLoad));

    void promise.finally(() => {
      clearTimers();
      setLoading(false);
    });

    return clearTimers;
  }, []);

  return (
    <>
      {loading && showSpinner && (
        <div className="fixed inset-0 flex items-center justify-center bg-primary z-50">
          <Spinner size="xl" />
        </div>
      )}
      <div
        ref={containerRef}
        style={{ visibility: loading ? "hidden" : "visible" }}
      >
        {children}
      </div>
    </>
  );
}
