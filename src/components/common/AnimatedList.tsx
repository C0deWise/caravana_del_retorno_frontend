import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedListProps<T> {
  readonly items: T[];
  readonly renderItem: (item: T, index: number) => ReactNode;
  readonly keyExtractor: (item: T) => string | number;
  readonly emptyMessage?: string;
  readonly onEmptyActionClick?: () => void;
  readonly emptyActionLabel?: string;
  readonly containerClassName?: string;
  readonly itemClassName?: string;
}

export function AnimatedList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage,
  onEmptyActionClick,
  emptyActionLabel,
  containerClassName = "space-y-4 w-full",
  itemClassName,
}: AnimatedListProps<T>) {
  const itemInitial = { opacity: 0, scale: 0.9 };
  const itemAnimate = { opacity: 1, scale: 1 };
  const itemExit = { opacity: 0, scale: 0.9 };

  return (
    <AnimatePresence mode="popLayout">
      {items.length === 0 && emptyMessage && (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center py-20 text-text-muted bg-bg-card rounded-2xl border border-dashed border-bg-border"
        >
          <p className="text-lg font-medium">{emptyMessage}</p>
          {onEmptyActionClick && emptyActionLabel && (
            <button
              onClick={onEmptyActionClick}
              className="mt-4 text-primary font-bold hover:underline"
            >
              {emptyActionLabel}
            </button>
          )}
        </motion.div>
      )}

      {items.length > 0 && (
        <motion.div className={containerClassName} key="list" layout>
          {items.map((item, index) => (
            <motion.div
              key={keyExtractor(item)}
              layout
              initial={itemInitial}
              animate={itemAnimate}
              exit={itemExit}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                layout: {
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                },
              }}
              className={itemClassName}
            >
              {renderItem(item, index)}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
