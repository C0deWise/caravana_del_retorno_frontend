"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Spinner from "@/components/feedback/Spinner";
import { useAuth } from "@/auth/context/AuthContext";

const MIN_LOAD_TIME = 1000;

function waitForImage(img: HTMLImageElement): Promise<void> {
  return new Promise<void>((resolve) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve();
      return;
    }

    let loaded = false;

    const cleanup = () => {
      loaded = true;
      img.removeEventListener("load", onComplete);
      img.removeEventListener("error", onComplete);
    };

    function onComplete() {
      if (!loaded) {
        cleanup();
        resolve();
      }
    }

    img.addEventListener("load", onComplete, { once: true });
    img.addEventListener("error", onComplete, { once: true });
  });
}

async function waitForFonts(): Promise<void> {
  try {
    if (document?.fonts) {
      await document.fonts.ready;
    }
  } catch (e) {
    console.error("Error waiting for fonts", e);
  }
}

function handleResourcesLoaded(
  abortSignal: AbortSignal,
  startTime: number,
  onComplete: () => void,
  timeoutRef: React.RefObject<ReturnType<typeof setTimeout> | null>,
) {
  if (abortSignal.aborted) return;

  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, MIN_LOAD_TIME - elapsedTime);

  if (timeoutRef.current) clearTimeout(timeoutRef.current);

  if (remainingTime > 0) {
    timeoutRef.current = setTimeout(onComplete, remainingTime);
  } else {
    onComplete();
  }
}

export default function Template({ children }: { readonly children: React.ReactNode }) {
  const { isHydrating } = useAuth();
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);

  const checkResourcesLoaded = useCallback(() => {
    if (!containerRef.current) return;

    const images = Array.from(containerRef.current.querySelectorAll("img"));
    const imagePromise =
      images.length === 0
        ? Promise.resolve()
        : Promise.all(images.map(waitForImage));

    const fontPromise = waitForFonts();

    void Promise.all([imagePromise, fontPromise]).finally(() => {
      const signal = abortControllerRef.current?.signal;
      if (!signal) return;
      handleResourcesLoaded(
        signal,
        startTimeRef.current,
        () => setLoading(false),
        timeoutRef,
      );
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }, 3500);
  }, []);

  useEffect(() => {
    if (isHydrating) return; // Wait until session is loaded before checking resources

    abortControllerRef.current = new AbortController();
    startTimeRef.current = Date.now();

    const requestIdleCallbackId = globalThis.requestIdleCallback(
      () => {
        checkResourcesLoaded();
      },
      { timeout: 100 },
    );

    return () => {
      abortControllerRef.current?.abort();
      globalThis.cancelIdleCallback(requestIdleCallbackId);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [checkResourcesLoaded, isHydrating]);

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
          opacity: loading || isHydrating ? 1 : 0,
          filter: loading || isHydrating ? "blur(0px)" : "blur(8px)",
          transition: "opacity 0.8s ease-out, filter 0.8s ease-out",
          pointerEvents: loading || isHydrating ? "auto" : "none",
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
            opacity: loading || isHydrating ? 1 : 0,
            transition: loading || isHydrating ? "opacity 0.6s ease-out 0.3s" : "none",
          }}
        >
          Conectando con la Caravana del Retorno, Florencia, Cauca...
        </p>
      </div>

      {/* Contenido - aparece conforme el spinner desaparece */}
      <div
        ref={containerRef}
        style={{
          display: loading || isHydrating ? "none" : "block",
          opacity: loading || isHydrating ? 0 : 1,
          transition: loading || isHydrating ? "none" : "opacity 0.8s ease-out",
          pointerEvents: loading || isHydrating ? "none" : "auto",
        }}
      >
        {children}
      </div>
    </>
  );
}

