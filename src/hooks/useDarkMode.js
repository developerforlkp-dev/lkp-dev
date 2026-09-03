import { useState, useEffect, useCallback, useRef } from 'react';

const DARK_MODE_EVENT = 'lkp:darkmode-change';

const useDarkMode = (initialState = false) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem('darkMode');
      return item ? JSON.parse(item) : initialState;
    } catch (error) {
      return initialState;
    }
  });

  // Track whether the current change originated from this instance
  const isLocalChange = useRef(false);

  // Apply body classes and persist to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem('darkMode', JSON.stringify(value));
      if (value) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
      } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
      }
    } catch (error) {
      console.error(error);
    }

    // Broadcast to other useDarkMode instances only if this was a local change
    if (isLocalChange.current) {
      isLocalChange.current = false;
      window.dispatchEvent(new CustomEvent(DARK_MODE_EVENT, { detail: { value } }));
    }
  }, [value]);

  // Listen for changes from other useDarkMode instances
  useEffect(() => {
    const handleDarkModeChange = (e) => {
      const newValue = e.detail?.value;
      if (typeof newValue === 'boolean') {
        setValue(newValue);
      }
    };

    // Also listen for localStorage changes from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'darkMode' && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue);
          if (typeof newValue === 'boolean') {
            setValue(newValue);
          }
        } catch (_) {}
      }
    };

    window.addEventListener(DARK_MODE_EVENT, handleDarkModeChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(DARK_MODE_EVENT, handleDarkModeChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggle = useCallback(() => {
    isLocalChange.current = true;
    setValue(v => !v);
  }, []);

  const enable = useCallback(() => {
    isLocalChange.current = true;
    setValue(true);
  }, []);

  const disable = useCallback(() => {
    isLocalChange.current = true;
    setValue(false);
  }, []);

  return { value, toggle, enable, disable };
};

export default useDarkMode;
