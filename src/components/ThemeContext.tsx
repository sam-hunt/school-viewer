import { createContext } from 'react';

export interface ThemeContextType {
  currentTheme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({ currentTheme: 'dark', toggleTheme: () => void 0 });

