import { motion } from "framer-motion";

interface SliderPillProps {
  readonly activeValue: string;
  readonly className?: string;
}

export function SliderPill({
  activeValue,
  className = "absolute top-1 bottom-1 bg-bg rounded-lg shadow-sm",
}: SliderPillProps) {
  return (
    <motion.div
      className={className}
      animate={{
        left: activeValue === "nombre" ? "4px" : "calc(50%)",
      }}
      initial={{
        width: "calc(50% - 4px)",
      }}
      style={{
        width: "calc(50% - 4px)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  );
}
