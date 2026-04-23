"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Spinner from "@/ui/animations/Spinner";

export default function Template({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);
  const MIN_LOAD_TIME = 1000; // Mínimo 1 segundo (puedes ajustar)

  const checkResourcesLoaded = useCallback(() => {
    if (!containerRef.current) return;

    const images = Array.from(containerRef.current.querySelectorAll("img"));
    const fonts = document.fonts;

    function waitForImage(img: HTMLImageElement) {
      return new Promise<void>((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
          resolve();
          return;
        }

        let loaded = false;
        const cleanup = () => {
          loaded = true;
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onError);
        };

        const onLoad = () => {
          if (!loaded) {
            cleanup();
            resolve();
          }
        };

        const onError = () => {
          if (!loaded) {
            cleanup();
            resolve();
          }
        };

        img.addEventListener("load", onLoad, { once: true });
        img.addEventListener("error", onError, { once: true });
      });
    }

    function waitForFonts() {
      if (!fonts.ready) {
        return fonts.ready;
      }
      return Promise.resolve();
    }

    const imagePromise =
      images.length === 0
        ? Promise.resolve()
        : Promise.all(images.map(waitForImage));

    const fontPromise = waitForFonts();

    Promise.all([imagePromise, fontPromise]).finally(() => {
      if (!abortControllerRef.current?.signal.aborted) {
        const elapsedTime = Date.now() - startTimeRef.current;
        const remainingTime = Math.max(0, MIN_LOAD_TIME - elapsedTime);

        if (remainingTime > 0) {
          // Si no ha pasado el tiempo mínimo, esperar
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setLoading(false);
          }, remainingTime);
        } else {
          // Si ya pasó el tiempo mínimo, mostrar inmediatamente
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setLoading(false);
        }
      }
    });

    timeoutRef.current = setTimeout(() => {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }, 3500);
  }, []);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    startTimeRef.current = Date.now();

    const requestIdleCallbackId = window.requestIdleCallback(
      () => {
        checkResourcesLoaded();
      },
      { timeout: 100 },
    );

    return () => {
      abortControllerRef.current?.abort();
      window.cancelIdleCallback(requestIdleCallbackId);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [checkResourcesLoaded]);

  return (
    <>
      {/* Spinner + fondo con gradiente - se desvanecen suavemente */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background:
            "linear-gradient(135deg, #024059 0%, #013548 50%, #02314d 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
          opacity: loading ? 1 : 0,
          filter: loading ? "blur(0px)" : "blur(8px)",
          transition: "opacity 0.8s ease-out, filter 0.8s ease-out",
          pointerEvents: loading ? "auto" : "none",
        }}
      >
        <Spinner size="xl" />
        <p
          style={{
            color: "white",
            fontSize: "1.125rem",
            fontWeight: 600,
            letterSpacing: "0.025em",
            fontFamily: "var(--font-inter), sans-serif",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            opacity: loading ? 1 : 0,
            transition: loading ? "opacity 0.6s ease-out 0.3s" : "none",
          }}
        >
          Conectando con la Caravana del Retorno, Florencia, Cauca...
        </p>
      </div>

      {/* Contenido - aparece conforme el spinner desaparece */}
      <div
        ref={containerRef}
        style={{
          display: loading ? "none" : "block",
          opacity: loading ? 0 : 1,
          transition: loading ? "none" : "opacity 0.8s ease-out",
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        {children}
      </div>
    </>
  );
}
