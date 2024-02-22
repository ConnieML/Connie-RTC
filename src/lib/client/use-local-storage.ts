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
  const [value, setValue] = useState(localStorage.getItem(key) || defaultValue);

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
    if (typeof Storage !== 'undefined') {
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

      // Add event listener for storage changes
      window.addEventListener('storage', onStorageChanged);
    }
    return () => {
      window.removeEventListener('storage', onStorageChanged);
    };
  }, [key]);

  return { value, changeValue };
}
