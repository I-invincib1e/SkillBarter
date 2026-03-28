import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ThemePreference = 'auto' | 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(pref: ThemePreference): Theme {
  if (pref === 'auto') return getSystemTheme();
  return pref;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    const stored = localStorage.getItem('theme-preference') as ThemePreference;
    if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored;
    return 'auto';
  });

  const [theme, setTheme] = useState<Theme>(() => resolveTheme(
    (() => {
      const stored = localStorage.getItem('theme-preference') as ThemePreference;
      if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored;
      return 'auto';
    })()
  ));

  useEffect(() => {
    if (preference !== 'auto') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [preference]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const setPreference = (pref: ThemePreference) => {
    setPreferenceState(pref);
    localStorage.setItem('theme-preference', pref);
    setTheme(resolveTheme(pref));
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setPreference(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
