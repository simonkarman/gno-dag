import { useCallback, useRef, useState } from 'react';

interface UseHistoryAddons<T> {
  history: T[],
  pointer: number,
  back(): void,
  forward(): void,
  go(index: number): void,
}

export const useStateWithHistory = <T>(defaultValue: T, maxCapacity: number = 10): [T, (newValue: T) => void, UseHistoryAddons<T>] => {
  const [value, setValue] = useState(defaultValue);
  const historyRef = useRef([value]);
  const pointerRef = useRef(0);

  const set = useCallback(
    (newValue: T) => {
      if (historyRef.current[pointerRef.current] !== newValue) {
        if (pointerRef.current < historyRef.current.length - 1) {
          historyRef.current.splice(pointerRef.current + 1);
        }
        historyRef.current.push(newValue);

        while (historyRef.current.length > maxCapacity) {
          historyRef.current.shift();
        }
        pointerRef.current = historyRef.current.length - 1;
      }
      setValue(newValue);
    },
    [maxCapacity, value],
  );

  const back = useCallback(() => {
    if (pointerRef.current <= 0) return;
    pointerRef.current -= 1;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  const forward = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return;
    pointerRef.current += 1;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  const go = useCallback((index) => {
    if (index < 0 || index >= historyRef.current.length - 1) return;
    pointerRef.current = index;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  return [
    value,
    set,
    {
      history: historyRef.current,
      pointer: pointerRef.current,
      back,
      forward,
      go,
    },
  ];
};
