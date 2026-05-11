"use client";

import { useState, useRef, useEffect, useLayoutEffect, type ReactNode } from "react";

interface ExpandableContentProps {
  readonly isOpen: boolean;
  readonly children: ReactNode;
  readonly className?: string;
  readonly duration?: number;
  readonly onAnimatingChange?: (isAnimating: boolean) => void;
  readonly spacing?: string;
}

export function ExpandableContent({
  isOpen,
  children,
  className = "",
  duration = 500,
  onAnimatingChange,
  spacing = "1rem",
}: ExpandableContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    onAnimatingChange?.(true);
    const timer = setTimeout(() => onAnimatingChange?.(false), duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onAnimatingChange]);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    if (isOpen) {
      const observer = new ResizeObserver(() => {
        setHeight(element.scrollHeight);
      });
      observer.observe(element);
      setHeight(element.scrollHeight);
      return () => observer.disconnect();
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      style={{
        height: `${height}px`,
        overflow: isOpen ? "visible" : "hidden",
        transition: `height ${duration}ms ease-out, opacity ${duration}ms ease-out, margin ${duration}ms ease-out`,
        opacity: isOpen ? 1 : 0,
        marginBottom: isOpen ? spacing : "0",
      }}
      className={className}
    >
      {children}
    </div>
  );
}