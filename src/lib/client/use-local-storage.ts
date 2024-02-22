'use client';

import { useEffect, useState } from 'react';

/**
 * A hook to observe a localStorage value and update it when it changes.
 *
 * @param key The key of the value in localStorage
 */
export default function useLocalStorage<T extends number | string | boolean>(
  key: string,
  defaultValue: T,
) {
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        return storedValue as T;
      }
    }
    return defaultValue;
  });

  const changeValue = (newValue: T) => {
    // TODO: Handle no storage edge case
    localStorage.setItem(key, newValue.toString());
    setValue(newValue);
  };

  function onStorageChanged(event: StorageEvent) {
    // Call the callback function with the changed key and value
    if (event.key === key) {
      setValue((event.newValue as T) || defaultValue);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Define a function to check for changes in localStorage
      const checkForChanges = () => {
        for (let i = 0; i < localStorage.length; i++) {
          const checkKey = localStorage.key(i);
          if (checkKey === key) {
            const value = localStorage.getItem(key);
            changeValue(value as T);
          }
        }
      };

      // Call the function initially to capture existing localStorage data
      checkForChanges();

      window.addEventListener('storage', onStorageChanged);
    }
    return () => {
      window.removeEventListener('storage', onStorageChanged);
    };
  }, [key, changeValue, onStorageChanged]);

  return { value, changeValue };
}
