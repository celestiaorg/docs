'use client';
import { useState, useEffect } from 'react';

/**
 * Tracks Vocs' active color theme.
 *
 * @returns {boolean} true if dark mode is active, false otherwise
 */
export function useDarkMode(): boolean {
  const readIsDark = () => {
    if (typeof document === 'undefined') return false;

    const theme = document.documentElement.dataset.vocsTheme;
    if (theme === 'dark') return true;
    if (theme === 'light') return false;

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  };

  const [isDark, setIsDark] = useState(() => {
    return readIsDark();
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(readIsDark());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-vocs-theme', 'style']
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}
