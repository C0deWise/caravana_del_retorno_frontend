"use client";

import { useEffect, useRef, useState } from "react";
import Spinner from "@/ui/general/Spinner";

export default function Template({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const images = Array.from(containerRef.current.querySelectorAll("img"));

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

    promise.finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      {loading && (
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
