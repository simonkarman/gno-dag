import {
  useState, useEffect, Dispatch, SetStateAction,
} from 'react';
import { usePrevious } from './usePrevious';

const useStorage = <T extends string>(key: string, defaultValue: T, storage: Storage | undefined): [
  T,
  Dispatch<SetStateAction<T>>,
] => {
  const previousKey = usePrevious(key);
  const [value, setValue] = useState<T>(() => {
    const existingValue = storage?.getItem(key) as T;
    if (!existingValue) {
      return defaultValue;
    }
    return existingValue;
  });

  useEffect(() => {
    if (value) {
      storage?.setItem(key, value);
    } else {
      storage?.removeItem(key);
    }
  }, [value]);

  useEffect(() => {
    if (value) {
      if (previousKey) {
        storage?.removeItem(previousKey);
      }
      storage?.setItem(key, value);
    } else {
      storage?.removeItem(key);
    }
  }, [key]);

  return [value, setValue];
};

export const useLocalStorage = <T extends string>(key: string, defaultValue: T) => useStorage<T>(
  key, defaultValue, process.browser ? window.localStorage : undefined,
);

export const useSessionStorage = <T extends string>(key: string, defaultValue: T) => useStorage<T>(
  key, defaultValue, process.browser ? window.sessionStorage : undefined,
);
