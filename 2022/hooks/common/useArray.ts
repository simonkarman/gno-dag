import { Dispatch, SetStateAction, useState } from 'react';

interface UseArrayAddons<T> {
  clear(): void;
  push(element: T): void;
  filter(predicate: (item: T, index: number, arr: T[]) => boolean): void;
  setAt(index: number, item: T): void;
  updateAt(index: number, item: (old: T) => T): void;
  removeAt(index: number): void;
}

export const useArray = <T>(defaultValue: T[]): [T[], Dispatch<SetStateAction<T[]>>, UseArrayAddons<T>] => {
  const [array, setArray] = useState(defaultValue);

  const clear = () => {
    setArray([]);
  };

  const push = (element: T) => {
    setArray(a => [...a, element]);
  };

  const filter = (predicate: (item: T, index: number, arr: T[]) => boolean) => {
    setArray(arr => arr.filter(predicate));
  };

  const setAt = (index: number, item: T) => {
    setArray(a => [
      ...a.slice(0, index),
      item,
      ...a.slice(index + 1, a.length - 1),
    ]);
  };

  const updateAt = (index: number, item: (old: T) => T) => {
    setArray((a) => [
      ...a.slice(0, index),
      item(a[index]),
      ...a.slice(index + 1, a.length - 1),
    ]);
  };

  const removeAt = (index: number) => {
    setArray((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)]);
  };

  return [array, setArray, {
    clear, push, filter, setAt, updateAt, removeAt,
  }];
};
