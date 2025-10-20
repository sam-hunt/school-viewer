import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Layout } from './Layout';
import { PropsWithChildren } from 'react';

const renderOptions = {
  wrapper: ({ children }: PropsWithChildren) => <MemoryRouter>{children}</MemoryRouter>,
};

describe('Layout', () => {
  it('should render main landmark with correct id', () => {
    render(<Layout />, renderOptions);

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');
  });

  it('should render footer with contentinfo role', () => {
    render(<Layout />, renderOptions);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer.tagName.toLowerCase()).toBe('footer');
  });

  it('should render skip link for keyboard navigation', () => {
    render(<Layout />, renderOptions);

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(skipLink).toHaveClass('skip-link');
  });

  it('should render header component', () => {
    render(<Layout />, renderOptions);

    // Header contains the app title
    expect(screen.getByText('School Viewer')).toBeInTheDocument();
  });

  it('should render footer with copyright text', () => {
    render(<Layout />, renderOptions);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`Sam Hunt ${currentYear.toString()}`)).toBeInTheDocument();
  });

  it('should have proper document structure for screen readers', () => {
    const { container } = render(<Layout />, renderOptions);

    // Verify proper landmark structure
    const main = container.querySelector('main');
    const footer = container.querySelector('footer');
    const header = container.querySelector('header');

    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(footer).toBeInTheDocument();

    // Verify they're in the correct order in the DOM
    const allElements = Array.from(container.querySelectorAll('header, main, footer'));
    expect(allElements[0].tagName.toLowerCase()).toBe('header');
    expect(allElements[1].tagName.toLowerCase()).toBe('main');
    expect(allElements[2].tagName.toLowerCase()).toBe('footer');
  });
});
