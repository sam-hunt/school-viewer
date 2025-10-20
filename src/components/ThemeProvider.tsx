import { ThemeProvider as MuiThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage/useLocalStorage';
import type { PaletteMode } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { grey } from '@mui/material/colors';
import { ThemeContext } from './ThemeContext';

const lavender = {
  main: '#CB9EFF',
  light: '#FFCFFF',
  dark: '#996FCB',
  contrastText: '#FFFFFF',
};
const royal = {
  main: '#7005FC',
  light: '#AB4CFF',
  dark: '#2600C7',
  contrastText: '#FFFFFF',
};

const themeFromMode = (mode: PaletteMode) =>
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

export const ThemeProvider = ({ children }: PropsWithChildren) => {
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
