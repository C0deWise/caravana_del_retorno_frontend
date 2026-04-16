interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "w-6 h-6 border-2",
  md: "w-10 h-10 border-4",
  lg: "w-16 h-16 border-4",
  xl: "w-24 h-24 border-[6px]",
};

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      className={`rounded-full border-bg border-t-secondary animate-spin ${sizeMap[size]} ${className}`}
    />
  );
}
