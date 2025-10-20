import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router';
import { NotFound } from './NotFound';

describe('NotFound', () => {
  it('should render the "Page Not Found" heading', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument();
  });

  it('should render descriptive error message', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>,
    );

    expect(screen.getByText(/The page you're looking for doesn't exist or has been moved/i)).toBeInTheDocument();
  });

  it('should render "Return Home" link', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>,
    );

    const link = screen.getByRole('link', { name: 'Return to home page' });
    expect(link).toBeInTheDocument();
  });

  it('should have "Return Home" link pointing to home page', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>,
    );

    const link = screen.getByRole('link', { name: 'Return to home page' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('should set dynamic page title for accessibility', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>,
    );

    expect(document.title).toBe('Page Not Found - Schools Viewer');
  });

  it('should use main landmark for semantic HTML', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>,
    );

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('should have focusable heading with proper accessibility attributes', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>,
    );

    const heading = screen.getByRole('heading', { name: 'Page Not Found' });
    expect(heading).toHaveAttribute('tabIndex', '-1');
  });

  it('should have descriptive aria-label on action link', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>,
    );

    const link = screen.getByRole('link', { name: 'Return to home page' });
    expect(link).toHaveAttribute('aria-label', 'Return to home page');
  });
});
