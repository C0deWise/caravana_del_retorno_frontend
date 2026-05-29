import { useRef, useState, useEffect } from "react";

export function useDraggable() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      dragging.current = true;
      offset.current = {
        x: e.clientX - el.getBoundingClientRect().left,
        y: e.clientY - el.getBoundingClientRect().top,
      };
      el.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };

    const onMouseUp = () => {
      dragging.current = false;
      el.style.cursor = "grab";
    };

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      dragging.current = true;
      offset.current = {
        x: touch.clientX - el.getBoundingClientRect().left,
        y: touch.clientY - el.getBoundingClientRect().top,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const touch = e.touches[0];
      setPos({
        x: touch.clientX - offset.current.x,
        y: touch.clientY - offset.current.y,
      });
    };

    const onTouchEnd = () => {
      dragging.current = false;
    };

    el.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return { ref, pos };
}
