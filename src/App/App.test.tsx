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
  it('should redirect from "/" to "/schools"', async () => {
    renderAtRoute('/');
    expect(await screen.findByText('SchoolsListPage')).toBeInTheDocument();
  });

  it('should render SchoolsListPage at "/schools"', async () => {
    renderAtRoute('/schools');
    expect(await screen.findByText('SchoolsListPage')).toBeInTheDocument();
  });

  it('should render SchoolPage at "/schools/:schoolId"', async () => {
    renderAtRoute('/schools/123');
    expect(await screen.findByText('SchoolPage')).toBeInTheDocument();
  });

  it('should render ClustersPage at "/clusters"', async () => {
    renderAtRoute('/clusters');
    expect(await screen.findByText('ClustersPage')).toBeInTheDocument();
  });

  it('should render AboutPage at "/about"', async () => {
    renderAtRoute('/about');
    expect(await screen.findByText('AboutPage')).toBeInTheDocument();
  });

  it('should render NotFound for unknown routes', () => {
    renderAtRoute('/unknown-route');
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to home page' })).toBeInTheDocument();
  });

  it('should render Layout with Header for all routes', async () => {
    renderAtRoute('/schools');
    expect(screen.getByText('Header')).toBeInTheDocument();
    // Wait for the lazy-loaded page to render
    await screen.findByText('SchoolsListPage');
  });

  it('should render footer with copyright', async () => {
    renderAtRoute('/schools');
    expect(screen.getByText(`Sam Hunt ${new Date().getFullYear().toString()}`)).toBeInTheDocument();
    // Wait for the lazy-loaded page to render
    await screen.findByText('SchoolsListPage');
  });
});
