"use client";

import { useEffect, useRef, useState } from "react";
import Spinner from "@/ui/general/Spinner";

const MIN_LOADING_TIME = 250;

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const images = Array.from(containerRef.current.querySelectorAll("img"));

    function waitForLoad(img: HTMLImageElement) {
      return new Promise<void>((resolve) => {
        if (img.complete && img.naturalWidth > 0) resolve();
        else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      });
    }

    const start = performance.now();

    const promise =
      images.length === 0
        ? Promise.resolve()
        : Promise.all(images.map(waitForLoad));

    promise.finally(() => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

      const timeoutId = window.setTimeout(() => {
        setLoading(false);
      }, remaining);

      return () => window.clearTimeout(timeoutId);
    });
  }, []);

  return (
    <div className="relative min-h-100">
      {" "}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm z-10 rounded-lg">
          <Spinner size="lg" />
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full"
        style={{ visibility: loading ? "hidden" : "visible" }}
      >
        {children}
      </div>
    </div>
  );
}
