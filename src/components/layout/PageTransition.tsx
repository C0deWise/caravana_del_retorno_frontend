"use client";

import { useEffect, useRef, useState } from "react";
import Spinner from "@/components/feedback/Spinner";

const MIN_LOADING_TIME = 300;

export default function PageTransition({
  children,
}: {
  readonly children: React.ReactNode;
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

    let timeoutId: number;

    const promise =
      images.length === 0
        ? Promise.resolve()
        : Promise.all(images.map(waitForLoad));

    void promise.finally(() => {
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

      timeoutId = window.setTimeout(() => {
        setLoading(false);
      }, remaining);
    });

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className="relative min-h-[100px] h-full flex flex-col">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-10 rounded-lg">
          <Spinner size="lg" />
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full flex-1 flex flex-col"
        style={{ visibility: loading ? "hidden" : "visible" }}
      >
        {children}
      </div>
    </div>
  );
}

