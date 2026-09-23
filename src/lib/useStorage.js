import { useEffect, useState } from 'react';

export function useStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      return saved !== null &&
        (Array.isArray(initialValue)
          ? Array.isArray(saved)
          : typeof saved === typeof initialValue)
        ? saved
        : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* State remains usable when storage is unavailable. */
    }
  }, [key, value]);
  return [value, setValue];
}
