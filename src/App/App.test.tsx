import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock all page components
vi.mock('../pages/about-page/AboutPage', () => ({ AboutPage: () => <div>AboutPage</div> }));
vi.mock('../pages/clusters-page/ClustersPage', () => ({ ClustersPage: () => <div>ClustersPage</div> }));
vi.mock('../pages/school-page/SchoolPage', () => ({ SchoolPage: () => <div>SchoolPage</div> }));
vi.mock('../pages/schools-list-page/SchoolsListPage', () => ({ SchoolsListPage: () => <div>SchoolsListPage</div> }));

// Mock the Header component to simplify rendering
vi.mock('../components/Header', () => ({ Header: () => <div>Header</div> }));

// Helper function to render the app at a specific route
const renderAtRoute = (route: string) => {
  window.history.pushState({}, 'Test', route);
  return render(<App />);
};

describe('App route resolution', () => {
  it('should redirect from "/" to "/schools"', () => {
    renderAtRoute('/');
    expect(screen.getByText('SchoolsListPage')).toBeInTheDocument();
  });

  it('should render SchoolsListPage at "/schools"', () => {
    renderAtRoute('/schools');
    expect(screen.getByText('SchoolsListPage')).toBeInTheDocument();
  });

  it('should render SchoolPage at "/schools/:schoolId"', () => {
    renderAtRoute('/schools/123');
    expect(screen.getByText('SchoolPage')).toBeInTheDocument();
  });

  it('should render ClustersPage at "/clusters"', () => {
    renderAtRoute('/clusters');
    expect(screen.getByText('ClustersPage')).toBeInTheDocument();
  });

  it('should render AboutPage at "/about"', () => {
    renderAtRoute('/about');
    expect(screen.getByText('AboutPage')).toBeInTheDocument();
  });

  it('should render NotFound for unknown routes', () => {
    renderAtRoute('/unknown-route');
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Get me home' })).toBeInTheDocument();
  });

  it('should render Layout with Header for all routes', () => {
    renderAtRoute('/schools');
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('should render footer with copyright', () => {
    renderAtRoute('/schools');
    expect(screen.getByText(`Sam Hunt ${new Date().getFullYear()}`)).toBeInTheDocument();
  });
});
