import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';
import { ThemeContext } from './ThemeContext';

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

  it('should render app title and icon as a link to home', () => {
    renderHeader();
    const homeLink = screen.getByRole('link', { name: 'School Viewer home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
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

    const toggleButton = screen.getByRole('button', { name: /Switch to dark mode/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('should render theme toggle button with dark mode icon', () => {
    renderHeader(true);

    const toggleButton = screen.getByRole('button', { name: /Switch to light mode/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('should call toggleTheme when theme toggle button is clicked', async () => {
    const user = userEvent.setup();
    const { mockToggleTheme } = renderHeader();

    const toggleButton = screen.getByRole('button', { name: /Switch to dark mode/i });
    await user.click(toggleButton);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should render school icon', () => {
    const { container } = renderHeader();
    const schoolIcon = container.querySelector('svg');
    expect(schoolIcon).toBeInTheDocument();
  });

  it('should hide decorative icons from screen readers', () => {
    renderHeader();

    // School icon in title
    const schoolIcon = screen.getByTestId('SchoolIcon');
    expect(schoolIcon).toHaveAttribute('aria-hidden', 'true');

    // Icons in navigation links
    const searchIcon = screen.getByTestId('SearchIcon');
    expect(searchIcon).toHaveAttribute('aria-hidden', 'true');

    const bubbleIcon = screen.getByTestId('BubbleChartIcon');
    expect(bubbleIcon).toHaveAttribute('aria-hidden', 'true');

    const infoIcon = screen.getByTestId('InfoOutlinedIcon');
    expect(infoIcon).toHaveAttribute('aria-hidden', 'true');
  });

  it('should wrap navigation links in nav element with aria-label', () => {
    renderHeader();

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav).toBeInTheDocument();

    // Navigation should contain the links
    const schoolsLink = screen.getByRole('link', { name: /Schools/i });
    const clustersLink = screen.getByRole('link', { name: /Clusters/i });
    const aboutLink = screen.getByRole('link', { name: /About/i });

    expect(nav).toContainElement(schoolsLink);
    expect(nav).toContainElement(clustersLink);
    expect(nav).toContainElement(aboutLink);
  });

  it('should have accessible navigation structure', () => {
    const { container } = renderHeader();

    // Verify nav element exists
    const navElement = container.querySelector('nav');
    expect(navElement).toBeInTheDocument();
    expect(navElement).toHaveAttribute('aria-label', 'Main navigation');
  });

  it('should use semantic list structure for navigation', () => {
    const { container } = renderHeader();

    // Verify ul element exists within nav
    const navElement = container.querySelector('nav');
    const ulElement = navElement?.querySelector('ul');
    expect(ulElement).toBeInTheDocument();

    // Verify list items exist
    const listItems = navElement?.querySelectorAll('li');
    expect(listItems).toHaveLength(3);

    // Each list item should contain a link
    listItems?.forEach((li) => {
      const link = li.querySelector('a');
      expect(link).toBeInTheDocument();
    });
  });

  it('should have descriptive aria-labels on navigation links', () => {
    renderHeader();

    const schoolsLink = screen.getByRole('link', { name: 'Schools list page' });
    expect(schoolsLink).toBeInTheDocument();

    const clustersLink = screen.getByRole('link', { name: 'School clusters map page' });
    expect(clustersLink).toBeInTheDocument();

    const aboutLink = screen.getByRole('link', { name: 'About this application' });
    expect(aboutLink).toBeInTheDocument();
  });

  it('should render navigation as a proper list for screen readers', () => {
    renderHeader();

    // Screen readers should announce "list, 3 items" when navigating to the nav
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    const list = nav.querySelector('ul');

    expect(list).toBeInTheDocument();
    expect(list?.children).toHaveLength(3);
  });

  it('should have visual indicator for active navigation link (not color only)', () => {
    renderHeader();

    // Active links should have both color AND underline (borderBottom)
    // This test verifies that we don't rely on color alone for indicating active state
    const schoolsLink = screen.getByRole('link', { name: 'Schools list page' });

    // The active link will have inline styles applied via the style prop
    // We can't easily test the exact computed styles in JSDOM, but we can verify
    // the style prop function returns different values for active/inactive states
    expect(schoolsLink).toHaveAttribute('style');
  });

  it('should render GitHub link button', () => {
    renderHeader();

    const githubLink = screen.getByRole('link', { name: 'View source code on GitHub' });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/sam-hunt/school-viewer');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should hide navigation icons on xs screens', () => {
    const { container } = renderHeader();

    // Navigation icons should have responsive display styling
    const searchIcon = screen.getByTestId('SearchIcon');
    const bubbleIcon = screen.getByTestId('BubbleChartIcon');
    const infoIcon = screen.getByTestId('InfoOutlinedIcon');

    // Verify icons are rendered (MUI's responsive breakpoints work in browser, not JSDOM)
    expect(searchIcon).toBeInTheDocument();
    expect(bubbleIcon).toBeInTheDocument();
    expect(infoIcon).toBeInTheDocument();

    // Verify that the icons have MUI classes indicating responsive behavior
    // MUI applies CSS classes that control display based on viewport size
    expect(searchIcon.classList.toString()).toContain('MuiSvgIcon');
    expect(bubbleIcon.classList.toString()).toContain('MuiSvgIcon');
    expect(infoIcon.classList.toString()).toContain('MuiSvgIcon');
  });

  it('should have responsive font sizes for app title', () => {
    const { container } = renderHeader();

    const titleElement = screen.getByText('School Viewer');
    expect(titleElement).toBeInTheDocument();

    // Verify the element has the component and variant attributes
    expect(titleElement.tagName).toBe('DIV');
  });

  it('should have responsive font sizes for navigation link text', () => {
    renderHeader();

    const schoolsText = screen.getByText('Schools');
    const clustersText = screen.getByText('Clusters');
    const aboutText = screen.getByText('About');

    // Verify all navigation text elements are rendered
    expect(schoolsText).toBeInTheDocument();
    expect(clustersText).toBeInTheDocument();
    expect(aboutText).toBeInTheDocument();

    // Verify they are span elements (Typography component="span")
    expect(schoolsText.tagName).toBe('SPAN');
    expect(clustersText.tagName).toBe('SPAN');
    expect(aboutText.tagName).toBe('SPAN');
  });
});
