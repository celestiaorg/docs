'use client';
import { useState, useEffect } from 'react';

/**
 * Custom hook to detect and track Nextra's dark mode state.
 * 
 * Watches for changes to the 'dark' class on document.documentElement
 * which is how Nextra manages theme switching.
 * 
 * @returns {boolean} true if dark mode is active, false otherwise
 */
export function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  
  return isDark;
}

