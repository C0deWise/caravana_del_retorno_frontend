import type { CSSProperties } from "react";

interface CurveShapeProps {
  className?: string;
  style?: CSSProperties;
  withShadow?: boolean;
}

export default function CurveShape({ className, withShadow }: CurveShapeProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 699 35"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="#000000"
            floodOpacity="0.7"
          />
        </filter>
      </defs>
      <path
        d="M121.358 25.939C69.823 24.413 24.105 20.344 0 0h698.225C403.142 0 172.894 27.465 121.358 25.939"
        className="fill-primary"
        filter={withShadow ? "url(#shadow)" : undefined}
      />
    </svg>
  );
}
