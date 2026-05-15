import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "@/components/feedback/Spinner";

interface AnimatedListProps<T> {
  readonly items: T[];
  readonly renderItem: (item: T, index: number) => ReactNode;
  readonly keyExtractor: (item: T) => string | number;
  readonly emptyMessage?: string;
  readonly onEmptyActionClick?: () => void;
  readonly emptyActionLabel?: string;
  readonly containerClassName?: string;
  readonly emptyContainerClassName?: string;
  readonly itemClassName?: string;
  readonly enableScrollShadow?: boolean;
  readonly innerScrollClassName?: string;
  readonly hasMore?: boolean;
  readonly loading?: boolean;
  readonly onLoadMore?: () => void;
}

export function AnimatedList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage,
  onEmptyActionClick,
  emptyActionLabel,
  containerClassName = "space-y-3 w-full",
  emptyContainerClassName = "flex flex-col items-center justify-center py-20 text-text-muted bg-bg-card rounded-2xl border border-dashed border-bg-border",
  itemClassName,
  enableScrollShadow = true,
  innerScrollClassName = "px-6 pb-6",
  hasMore = false,
  loading = false,
  onLoadMore,
}: AnimatedListProps<T>) {
  const itemInitial = { opacity: 0, scale: 0.9 };
  const itemAnimate = { opacity: 1, scale: 1 };
  const itemExit = { opacity: 0, scale: 0.9 };

  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [isScrolledBottom, setIsScrolledBottom] = useState(true);
  const [canScroll, setCanScroll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (enableScrollShadow) {
      setCanScroll(false);
      setIsScrolledBottom(true);
      setIsScrolledTop(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    }
  }, [items.length, enableScrollShadow]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    
    requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      
      const isScrollable = clientHeight > 0 && scrollHeight > clientHeight + 3;
      setIsScrolledTop(scrollTop <= 5);
      
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      
      scrollTimeoutRef.current = setTimeout(() => {
        setCanScroll(isScrollable);
        setIsScrolledBottom(
          !isScrollable || Math.ceil(scrollTop + clientHeight) >= scrollHeight - 3,
        );
      }, 400);
    });
  }, []);

  useEffect(() => {
    if (loading || !hasMore || !onLoadMore) return;
    const currentSentinel = sentinelRef.current;
    if (!currentSentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: "100px" },
    );

    observer.observe(currentSentinel);
    return () => observer.disconnect();
  }, [loading, hasMore, onLoadMore, items.length]);

  useEffect(() => {
    if (!enableScrollShadow || !scrollRef.current) return;

    const observer = new ResizeObserver(() => {
      handleScroll();
    });

    observer.observe(scrollRef.current);
    
    if (scrollRef.current.firstElementChild) {
      observer.observe(scrollRef.current.firstElementChild);
    }

    window.addEventListener("resize", handleScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [enableScrollShadow, handleScroll]);

  const listContent = (
    <div className="flex flex-col">
      <AnimatePresence mode="popLayout">
        {items.length === 0 && emptyMessage && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={emptyContainerClassName}
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

      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center space-x-3 py-6 text-primary shrink-0"
        >
          <Spinner size="lg" />
          <span className="font-medium text-sm">Cargando más...</span>
        </div>
      )}
    </div>
  );

  if (!enableScrollShadow) {
    return listContent;
  }

  return (
    <div className="relative flex flex-col min-h-0 flex-1 overflow-hidden">
      <div
        className={`absolute top-0 left-0 right-0 h-6 bg-linear-to-b from-black/15 dark:from-white/10 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
          !canScroll || isScrolledTop ? "opacity-0" : "opacity-100"
        }`}
      />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto min-h-0 custom-scrollbar ${innerScrollClassName}`}
      >
        {listContent}
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-black/15 dark:from-white/10 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
          !canScroll || isScrolledBottom ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}


