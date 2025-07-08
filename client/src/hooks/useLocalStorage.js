import { useState, useEffect } from 'react';
import storageService from '../services/storage'; // Using our storage service!

// Define or import config here
const config = {
  storage: {
    prefix: 'myApp_' // Example prefix for localStorage keys
  }
};

/**
 * A custom hook that behaves like useState but persists the state in localStorage.
 *
 * @param {string} key - The base key to use in localStorage (will be prefixed by the service).
 * @param {any} initialValue - The initial value to use if nothing is found in storage.
 * @returns {[any, function]} An array containing the state value and a function to update it.
 */
const useLocalStorage = (key, initialValue) => {
  // 1. Initialize state by attempting to read from localStorage.
  // We pass a function to useState so this logic only runs once.
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Use our storage service to retrieve the value.
      const item = storageService.getItem(key);
      // If a value exists, use it. Otherwise, use the provided initial value.
      return item !== null ? item : initialValue;
    } catch (error) {
      // If an error occurs (e.g., storage is full), return the initial value.
      console.error(`Error reading localStorage for key "${key}":`, error);
      return initialValue;
    }
  });

  // 2. Create a "wrapped" version of the state update function.
  const setValue = (value) => {
    try {
      // Allow the new value to be a function, like in native `useState`.
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Update React state.
      setStoredValue(valueToStore);
      // Update localStorage via our service.
      storageService.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
    }
  };

  // Optional but recommended: Listen for storage changes from other tabs.
  // This allows syncing state if the user has multiple tabs of the app open.
  useEffect(() => {
    const handleStorageChange = (e) => {
      // The full key includes the prefix.
      const fullKey = `${config.storage.prefix}${key}`;
      if (e.key === fullKey) {
        try {
          setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
        } catch (error) {
          setStoredValue(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
};

export default useLocalStorage;
