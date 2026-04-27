import { useEffect, DependencyList, useRef } from "react";

export function useDebouncedEffect(
  callback: () => void,
  delay: number,
  deps: DependencyList
) {
  const callbackRef = useRef(callback);
  const lastDepsRef = useRef<DependencyList>(deps);
  const lastDelayRef = useRef<number>(delay);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const haveDepsChanged =
      delay !== lastDelayRef.current ||
      deps.length !== lastDepsRef.current.length ||
      deps.some((dep, i) => dep !== lastDepsRef.current[i]);

    if (haveDepsChanged) {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        callbackRef.current();
      }, delay);

      lastDepsRef.current = deps;
      lastDelayRef.current = delay;
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  });
}
