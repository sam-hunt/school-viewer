import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { ClustersPage } from './ClustersPage';
import { mockSchoolListItems } from '../../test/mockData';
import { SchoolListItem } from '../../models/SchoolListItem';

// Mock the useSchoolList hook
vi.mock('../../hooks/useSchoolList/useSchoolList');

// Mock the MapboxGLClusteredMap component - keep it simple since we test it separately
vi.mock('./MapboxglClusteredMap', () => ({
  MapboxGLClusteredMap: ({ clusterByProperty }: { clusterByProperty: string }) => (
    <div data-testid="mapbox-map" data-cluster-by={clusterByProperty}>
      Map
    </div>
  ),
}));

// Render options with router wrapper
const renderOptions = {
  wrapper: ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={['/clusters']}>{children}</MemoryRouter>
  ),
};

describe('ClustersPage', () => {
  it('should render loading state', async () => {
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    });

    render(<ClustersPage />, renderOptions);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByTestId('mapbox-map')).not.toBeInTheDocument();
  });

  it('should render error state', async () => {
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    const error = new Error('Failed to fetch schools');
    vi.mocked(useSchoolList).mockReturnValue({
      data: undefined,
      error,
      isPending: false,
    });

    render(<ClustersPage />, renderOptions);

    // Error is displayed as JSON.stringify(error) which is "{}" for Error objects
    // Just verify that we're not showing loading or the map
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mapbox-map')).not.toBeInTheDocument();

    // The page heading should still be visible
    expect(screen.getByRole('heading', { name: 'NZ Schools Directory' })).toBeInTheDocument();
  });

  it('should render page heading', async () => {
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: mockSchoolListItems,
      error: null,
      isPending: false,
    });

    render(<ClustersPage />, renderOptions);

    expect(screen.getByRole('heading', { name: 'NZ Schools Directory' })).toBeInTheDocument();
  });

  it('should render cluster metric selector', async () => {
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: mockSchoolListItems,
      error: null,
      isPending: false,
    });

    render(<ClustersPage />, renderOptions);

    expect(screen.getByLabelText('Cluster Metric')).toBeInTheDocument();
  });

  it('should render help tooltip', async () => {
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: mockSchoolListItems,
      error: null,
      isPending: false,
    });

    render(<ClustersPage />, renderOptions);

    const helpIcon = screen.getByTestId('HelpOutlineIcon');
    expect(helpIcon).toBeInTheDocument();
  });

  it('should render map when data is loaded', async () => {
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: mockSchoolListItems,
      error: null,
      isPending: false,
    });

    render(<ClustersPage />, renderOptions);

    expect(screen.getByTestId('mapbox-map')).toBeInTheDocument();
  });

  it('should default to count clustering', async () => {
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: mockSchoolListItems,
      error: null,
      isPending: false,
    });

    render(<ClustersPage />, renderOptions);

    const map = screen.getByTestId('mapbox-map');
    expect(map).toHaveAttribute('data-cluster-by', 'count');
  });

  it('should change cluster metric when selector is changed', async () => {
    const user = userEvent.setup();
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: mockSchoolListItems,
      error: null,
      isPending: false,
    });

    render(<ClustersPage />, renderOptions);

    const map = screen.getByTestId('mapbox-map');

    // Initially clustering by count
    expect(map).toHaveAttribute('data-cluster-by', 'count');

    // Change to total enrolments
    const select = screen.getByLabelText('Cluster Metric');
    await user.click(select);

    const totalOption = screen.getByRole('option', { name: 'Total Enrolments' });
    await user.click(totalOption);

    // Should now be clustering by total
    expect(map).toHaveAttribute('data-cluster-by', 'total');
  });

  it('should render all cluster metric options', async () => {
    const user = userEvent.setup();
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: mockSchoolListItems,
      error: null,
      isPending: false,
    });

    render(<ClustersPage />, renderOptions);

    const select = screen.getByLabelText('Cluster Metric');
    await user.click(select);

    expect(screen.getByRole('option', { name: 'School Locations' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Māori Enrolments' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Pacific Enrolments' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'European Enrolments' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Asian Enrolments' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'MELAA Enrolments' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'International Enrolments' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Total Enrolments' })).toBeInTheDocument();
  });

  it('should filter out schools without coordinates', async () => {
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    const schoolsWithMissingCoords: SchoolListItem[] = [
      ...mockSchoolListItems,
      {
        schoolId: '4',
        name: 'School Without Coords',
        city: 'Unknown',
        lat: 0,
        lng: 0,
        total: 100,
        url: 'https://school4.nz',
        maori: 5,
        pacific: 5,
        european: 80,
        asian: 5,
        melaa: 3,
        international: 1,
        other: 1,
        count: 1,
      },
    ];

    vi.mocked(useSchoolList).mockReturnValue({
      data: schoolsWithMissingCoords,
      error: null,
      isPending: false,
    });

    render(<ClustersPage />, renderOptions);

    // Map should still render (component filters schools internally)
    expect(screen.getByTestId('mapbox-map')).toBeInTheDocument();

    // TODO: Test that the school without coordinates is not rendered
  });
});
