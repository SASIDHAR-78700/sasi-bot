import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const ACCENTS = ['royal', 'gold', 'emerald', 'rose'];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('synthara_theme') || 'light';
    } catch {
      return 'light';
    }
  });
  const [accent, setAccent] = useState(() => {
    try {
      const saved = localStorage.getItem('synthara_accent') || 'royal';
      return ACCENTS.includes(saved) ? saved : 'royal';
    } catch {
      return 'royal';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-accent', accent);
    try {
      localStorage.setItem('synthara_theme', theme);
      localStorage.setItem('synthara_accent', accent);
    } catch {
      // storage unavailable — ignore
    }
  }, [theme, accent]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setAccentSafe = useCallback((a) => {
    if (ACCENTS.includes(a)) setAccent(a);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, accent, toggleTheme, setAccent: setAccentSafe, accents: ACCENTS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
