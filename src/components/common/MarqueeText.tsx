"use client";

import React, { useRef, useState, useEffect } from "react";

interface MarqueeTextProps {
  /** El texto que se va a mostrar y animar */
  readonly text: string;
  /** Clases base para el texto (ej: "text-sm font-medium text-gray-800") */
  readonly className?: string;
  /** Velocidad de la animación. Mayor = más rápido. Por defecto 20. */
  readonly speed?: number;
  /** Duración mínima de la animación en segundos. Por defecto 3. */
  readonly minDuration?: number;
}

export function MarqueeText({
  text,
  className = "",
  speed = 20,
  minDuration = 3,
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [marqueeStyle, setMarqueeStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const textWidth = textRef.current.scrollWidth;

        if (textWidth > containerWidth) {
          setIsOverflowing(true);
          const dist = textWidth - containerWidth;
          const duration = Math.max(minDuration, dist / speed);

          setMarqueeStyle({
            "--marquee-dist": `-${dist}px`,
            "--marquee-duration": `${duration}s`,
          } as React.CSSProperties);
        } else {
          setIsOverflowing(false);
          setMarqueeStyle({});
        }
      }
    };

    const timeoutId = setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [text, speed, minDuration]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden relative">
      <p
        ref={textRef}
        style={isOverflowing ? marqueeStyle : undefined}
        className={`${className} ${
          isOverflowing ? "animate-marquee" : "truncate"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
