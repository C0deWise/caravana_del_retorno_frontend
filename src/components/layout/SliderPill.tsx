import { motion } from "framer-motion";

interface SliderPillProps {
  readonly activeValue: string;
  readonly firstValue?: string;
  readonly options?: string[];
  readonly className?: string;
}

export function SliderPill({
  activeValue,
  firstValue,
  options,
  className = "absolute top-1 bottom-1 bg-bg rounded-lg shadow-sm",
}: SliderPillProps) {
  let left: string;
  let width: string;

  if (options && options.length > 0) {
    const index = Math.max(0, options.indexOf(activeValue));
    const pct = 100 / options.length;
    left = `calc(${index * pct}% + 4px)`;
    width = `calc(${pct}% - 8px)`;
  } else {
    left = activeValue === firstValue ? "4px" : "calc(50%)";
    width = "calc(50% - 4px)";
  }

  return (
    <motion.div
      className={className}
      animate={{ left }}
      initial={{ width }}
      style={{ width }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  );
}
