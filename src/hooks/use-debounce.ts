import { useEffect, useRef } from "react";

export function useDebounce<T>(
  value: T,
  callback: (value: T) => void,
  delay: number = 1000
): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const timer = setTimeout(() => callbackRef.current(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);
}
