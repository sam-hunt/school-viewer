import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';
import { ThemeContext } from './ThemeProvider';

// Helper to render Header with necessary providers
const renderHeader = (isDark = false) => {
  const mockToggleTheme = vi.fn();
  const theme = createTheme({ palette: { mode: isDark ? 'dark' : 'light' } });

  return {
    ...render(
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <ThemeContext.Provider value={{ currentTheme: isDark ? 'dark' : 'light', toggleTheme: mockToggleTheme }}>
            <Header />
          </ThemeContext.Provider>
        </MuiThemeProvider>
      </BrowserRouter>,
    ),
    mockToggleTheme,
  };
};

describe('Header', () => {
  it('should render the app title', () => {
    renderHeader();
    expect(screen.getByText('School Viewer')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderHeader();

    expect(screen.getByRole('link', { name: /Schools/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Clusters/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /About/i })).toBeInTheDocument();
  });

  it('should render correct navigation link hrefs', () => {
    renderHeader();

    expect(screen.getByRole('link', { name: /Schools/i })).toHaveAttribute('href', '/schools');
    expect(screen.getByRole('link', { name: /Clusters/i })).toHaveAttribute('href', '/clusters');
    expect(screen.getByRole('link', { name: /About/i })).toHaveAttribute('href', '/about');
  });

  it('should render theme toggle button with light mode icon', () => {
    renderHeader(false);

    const toggleButton = screen.getByRole('button', { name: /Toggle Dark Mode/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('should render theme toggle button with dark mode icon', () => {
    renderHeader(true);

    const toggleButton = screen.getByRole('button', { name: /Toggle Dark Mode/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('should call toggleTheme when theme toggle button is clicked', async () => {
    const user = userEvent.setup();
    const { mockToggleTheme } = renderHeader();

    const toggleButton = screen.getByRole('button', { name: /Toggle Dark Mode/i });
    await user.click(toggleButton);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should render school icon', () => {
    const { container } = renderHeader();
    const schoolIcon = container.querySelector('svg');
    expect(schoolIcon).toBeInTheDocument();
  });
});
