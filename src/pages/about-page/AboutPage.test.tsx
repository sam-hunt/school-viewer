import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AboutPage } from './AboutPage';

// Mock the useFocusOnNavigation hook
vi.mock('../../hooks/useFocusOnNavigation/useFocusOnNavigation', () => ({
  useFocusOnNavigation: vi.fn(() => ({ current: null })),
}));

describe('AboutPage', () => {
  it('should render the About heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
  });

  it('should use the focus navigation hook', async () => {
    const { useFocusOnNavigation } = await import('../../hooks/useFocusOnNavigation/useFocusOnNavigation');
    render(<AboutPage />);
    expect(useFocusOnNavigation).toHaveBeenCalled();
  });

  it('should attach ref to the main heading', () => {
    render(<AboutPage />);
    const heading = screen.getByRole('heading', { name: 'About' });
    expect(heading).toHaveAttribute('tabIndex', '-1');
  });

  it('should render description about the Schooling Directory API', () => {
    render(<AboutPage />);
    expect(screen.getByText(/A small visualiser for the/i)).toBeInTheDocument();
  });

  it('should render link to Schooling Directory API', () => {
    render(<AboutPage />);
    const link = screen.getByRole('link', { name: /Schooling Directory API/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      'https://www.educationcounts.govt.nz/directories/api-new-zealand-schools',
    );
  });

  it('should render links to major technologies used', () => {
    render(<AboutPage />);

    const reactLink = screen.getByRole('link', { name: 'React' });
    expect(reactLink).toHaveAttribute('href', 'https://reactjs.org/');

    const typescriptLink = screen.getByRole('link', { name: 'Typescript' });
    expect(typescriptLink).toHaveAttribute('href', 'https://www.typescriptlang.org/');

    const muiLink = screen.getByRole('link', { name: 'MUI' });
    expect(muiLink).toHaveAttribute('href', 'https://mui.com/');

    const mapboxLink = screen.getByRole('link', { name: 'Mapbox GLJS' });
    expect(mapboxLink).toHaveAttribute('href', 'https://www.mapbox.com/mapbox-gljs');

    const nivoLink = screen.getByRole('link', { name: 'Nivo' });
    expect(nivoLink).toHaveAttribute('href', 'https://nivo.rocks/');
  });

  it('should set dynamic page title for accessibility', () => {
    render(<AboutPage />);

    expect(document.title).toBe('About - Schools Viewer');
  });

  it('should have external links with security attributes', () => {
    render(<AboutPage />);

    // Get all external links (target="_blank")
    const apiLink = screen.getByRole('link', { name: /Schooling Directory API/i });
    expect(apiLink).toHaveAttribute('target', '_blank');
    expect(apiLink).toHaveAttribute('rel', 'noopener noreferrer');

    const reactLink = screen.getByRole('link', { name: 'React' });
    expect(reactLink).toHaveAttribute('target', '_blank');
    expect(reactLink).toHaveAttribute('rel', 'noopener noreferrer');

    const typescriptLink = screen.getByRole('link', { name: 'Typescript' });
    expect(typescriptLink).toHaveAttribute('target', '_blank');
    expect(typescriptLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
