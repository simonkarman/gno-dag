import { useStorage } from './useStorage';

const useTransformedStorage = <T>(
  key: string,
  defaultValue: T,
  toString: (t: T) => string,
  fromString: (s: string) => T,
  storage: Storage | undefined,
): [
  T,
  (t: T) => void,
] => {
  const [_value, _setValue] = useStorage(key, toString(defaultValue), storage);
  return [ fromString(_value), (t: T) => _setValue(toString(t))];
};

// General
export const useTransformedLocalStorage = <T>(
  key: string, defaultValue: T, toString: (t: T) => string, fromString: (s: string) => T,
) => useTransformedStorage<T>(
  key, defaultValue, toString, fromString, process.browser ? window.localStorage : undefined,
);
export const useTransformedSessionStorage = <T>(
  key: string, defaultValue: T, toString: (t: T) => string, fromString: (s: string) => T,
) => useTransformedStorage<T>(
  key, defaultValue, toString, fromString, process.browser ? window.sessionStorage : undefined,
);

// Integer
export const useLocalStorageBoolean = (key: string, defaultValue: boolean) => useTransformedLocalStorage(
  key, defaultValue, (b: boolean) => b ? 'true' : 'false', (s: string) => s === 'true',
);
export const useSessionStorageBoolean = (key: string, defaultValue: boolean) => useTransformedSessionStorage(
  key, defaultValue, (b: boolean) => b ? 'true' : 'false', (s: string) => s === 'true',
);

// Integer
export const useLocalStorageInteger = (key: string, defaultValue: number) => useTransformedLocalStorage(
  key, defaultValue, (n: number) => n.toString(10), (s: string) => Number.parseInt(s, 10),
);
export const useSessionStorageInteger = (key: string, defaultValue: number) => useTransformedSessionStorage(
  key, defaultValue, (n: number) => n.toString(10), (s: string) => Number.parseInt(s, 10),
);

// Float
export const useLocalStorageFloat = (key: string, defaultValue: number) => useTransformedLocalStorage(
  key, defaultValue, (n: number) => n.toString(10), (s: string) => Number.parseFloat(s),
);
export const useSessionStorageFloat = (key: string, defaultValue: number) => useTransformedSessionStorage(
  key, defaultValue, (n: number) => n.toString(10), (s: string) => Number.parseFloat(s),
);
