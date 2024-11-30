import { ThemeProvider as MuiThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { createContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/use-local-storage';
import type { PaletteMode } from '@mui/material';
import type { ReactNode } from 'react';
import { grey } from '@mui/material/colors';

export const lavender = {
  main: '#CB9EFF',
  light: '#FFCFFF',
  dark: '#996FCB',
  contrastText: '#FFFFFF',
};
export const royal = {
  main: '#7005FC',
  light: '#AB4CFF',
  dark: '#2600C7',
  contrastText: '#FFFFFF',
};

export const themeFromMode = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: mode === 'dark' ? lavender : royal,
      secondary: mode === 'dark' ? royal : lavender,
      background: {
        paper: mode === 'dark' ? grey[900] : grey[300],
      },
    },
  });

export interface ThemeContextType {
  currentTheme: string;
  toggleTheme: () => void;
}

export interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextType>({ currentTheme: 'dark', toggleTheme: () => {} });

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useLocalStorage<PaletteMode>('theme', 'dark');

  const themeProviderValue = useMemo(
    () => ({
      currentTheme,
      toggleTheme: () => setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark'),
    }),
    [currentTheme, setCurrentTheme],
  );

  return (
    <ThemeContext.Provider value={themeProviderValue}>
      <MuiThemeProvider theme={themeFromMode(currentTheme)}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
