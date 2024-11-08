import { useState } from 'react';

export default function useLocalStorage(key: string, initialValue: any) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      let value;
      if (typeof window !== 'undefined') {
        value = window.localStorage.getItem(key);
      }
      return value ? JSON.parse(value) : initialValue;
    } catch (error: any) {
      console.error(new Error(error));
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error: any) {
      console.error(new Error(error));
    }
  };

  return [storedValue, setValue];
}
