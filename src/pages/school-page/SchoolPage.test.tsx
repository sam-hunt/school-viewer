import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import { SchoolPage } from './SchoolPage';
import { mockSchool } from '../../test/mockData';

// Mock the useSchool hook
vi.mock('../../hooks/useSchool/useSchool');

// Mock all the card components
vi.mock('./cards/DetailsCard', () => ({
  DetailsCard: () => <div data-testid="details-card">DetailsCard</div>,
}));

vi.mock('./cards/MiscellaneousCard', () => ({
  MiscellaneousCard: () => <div data-testid="miscellaneous-card">MiscellaneousCard</div>,
}));

vi.mock('./cards/ContactCard', () => ({
  ContactCard: () => <div data-testid="contact-card">ContactCard</div>,
}));

vi.mock('./cards/EnrolmentsCard', () => ({
  EnrolmentsCard: () => <div data-testid="enrolments-card">EnrolmentsCard</div>,
}));

vi.mock('./cards/MapCard', () => ({
  MapCard: () => <div data-testid="map-card">MapCard</div>,
}));

// Helper to create render options with router wrapper
const createRenderOptions = (schoolId: string = '123') => ({
  wrapper: ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[`/schools/${schoolId}`]}>
      <Routes>
        <Route path="/schools/:schoolId" element={children} />
      </Routes>
    </MemoryRouter>
  ),
});

describe('SchoolPage', () => {

  it('should render loading state', async () => {
    const { useSchool } = await import('../../hooks/useSchool/useSchool');
    vi.mocked(useSchool).mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    });

    render(<SchoolPage />, createRenderOptions());

    expect(screen.getByRole('heading', { name: 'Loading School...' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByTestId('details-card')).not.toBeInTheDocument();
  });

  it('should render error state', async () => {
    const { useSchool } = await import('../../hooks/useSchool/useSchool');
    const error = new Error('School not found');
    vi.mocked(useSchool).mockReturnValue({
      data: undefined,
      error,
      isPending: false,
    });

    render(<SchoolPage />, createRenderOptions());

    expect(screen.getByRole('heading', { name: 'Error loading school' })).toBeInTheDocument();
    // Error is displayed as JSON.stringify(error) which is "{}" for Error objects
    // Just verify that we're not showing loading or the cards
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('details-card')).not.toBeInTheDocument();
  });

  it('should render school data with all cards', async () => {
    const { useSchool } = await import('../../hooks/useSchool/useSchool');
    vi.mocked(useSchool).mockReturnValue({
      data: mockSchool,
      error: null,
      isPending: false,
    });

    render(<SchoolPage />, createRenderOptions());

    expect(screen.getByRole('heading', { name: mockSchool.orgName })).toBeInTheDocument();
    expect(screen.getByTestId('details-card')).toBeInTheDocument();
    expect(screen.getByTestId('miscellaneous-card')).toBeInTheDocument();
    expect(screen.getByTestId('contact-card')).toBeInTheDocument();
    expect(screen.getByTestId('enrolments-card')).toBeInTheDocument();
    expect(screen.getByTestId('map-card')).toBeInTheDocument();
  });

  it('should pass schoolId from params to useSchool hook', async () => {
    const { useSchool } = await import('../../hooks/useSchool/useSchool');

    vi.mocked(useSchool).mockReturnValue({
      data: mockSchool,
      error: null,
      isPending: false,
    });

    render(<SchoolPage />, createRenderOptions('456'));

    expect(useSchool).toHaveBeenCalledWith('456');
  });

  it('should render cards in correct layout grid', async () => {
    const { useSchool } = await import('../../hooks/useSchool/useSchool');
    vi.mocked(useSchool).mockReturnValue({
      data: mockSchool,
      error: null,
      isPending: false,
    });

    const { container } = render(<SchoolPage />, createRenderOptions());

    // Check that Grid container exists
    const gridContainer = container.querySelector('.MuiGrid-container');
    expect(gridContainer).toBeInTheDocument();

    // Check that all cards are rendered
    expect(screen.getByTestId('details-card')).toBeInTheDocument();
    expect(screen.getByTestId('miscellaneous-card')).toBeInTheDocument();
    expect(screen.getByTestId('contact-card')).toBeInTheDocument();
    expect(screen.getByTestId('enrolments-card')).toBeInTheDocument();
    expect(screen.getByTestId('map-card')).toBeInTheDocument();
  });

  it('should not render cards when loading', async () => {
    const { useSchool } = await import('../../hooks/useSchool/useSchool');
    vi.mocked(useSchool).mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    });

    render(<SchoolPage />, createRenderOptions());

    expect(screen.queryByTestId('details-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('miscellaneous-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('contact-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('enrolments-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('map-card')).not.toBeInTheDocument();
  });

  it('should not render cards when error', async () => {
    const { useSchool } = await import('../../hooks/useSchool/useSchool');
    vi.mocked(useSchool).mockReturnValue({
      data: undefined,
      error: new Error('Failed'),
      isPending: false,
    });

    render(<SchoolPage />, createRenderOptions());

    expect(screen.queryByTestId('details-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('miscellaneous-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('contact-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('enrolments-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId('map-card')).not.toBeInTheDocument();
  });
});
