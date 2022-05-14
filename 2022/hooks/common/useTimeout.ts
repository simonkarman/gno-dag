import { useCallback, useEffect, useRef } from 'react';

export const useTimeout = (callback: () => void, delay: number) => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const restart = useCallback(() => {
    cancel();
    timeoutRef.current = setTimeout(callbackRef.current, delay);
  }, [delay]);

  useEffect(() => {
    restart();
    return cancel;
  }, [delay, restart, cancel]);

  return { restart, cancel };
};
