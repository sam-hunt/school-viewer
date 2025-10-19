import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { SchoolsListPage } from './SchoolsListPage';
import { SchoolListItem } from '../../models/SchoolListItem';
import { mockSchoolListItems } from '../../test/mockData';

// Mock the useSchoolList hook
vi.mock('../../hooks/useSchoolList/useSchoolList');

// Mock the PaginatedSchoolsTable component
vi.mock('./PaginatedSchoolsTable', () => ({
  PaginatedSchoolsTable: ({ schools }: { schools: SchoolListItem[] }) => (
    <div data-testid="paginated-table">
      {schools.map(school => (
        <div key={school.schoolId}>{school.name}</div>
      ))}
    </div>
  ),
}));

describe('SchoolsListPage', () => {
  it('should render loading state', async () => {
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    });

    render(<SchoolsListPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByTestId('paginated-table')).not.toBeInTheDocument();
  });

  it('should render error state', async () => {
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    const error = new Error('Failed to fetch schools');
    vi.mocked(useSchoolList).mockReturnValue({
      data: undefined,
      error,
      isPending: false,
    });

    render(<SchoolsListPage />);

    expect(screen.getByText('Unable to Load Schools')).toBeInTheDocument();
    expect(screen.getByText(/We're having trouble connecting to the schools database/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('should render schools list when data is loaded', async () => {
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: mockSchoolListItems,
      error: null,
      isPending: false,
    });

    render(<SchoolsListPage />);

    expect(screen.getByTestId('paginated-table')).toBeInTheDocument();
    expect(screen.getByText('Auckland Grammar School')).toBeInTheDocument();
    expect(screen.getByText('Wellington High School')).toBeInTheDocument();
    expect(screen.getByText('Christchurch Boys High School')).toBeInTheDocument();
  });

  it('should render page heading', async () => {
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: mockSchoolListItems,
      error: null,
      isPending: false,
    });

    render(<SchoolsListPage />);

    expect(screen.getByRole('heading', { name: 'Find a school' })).toBeInTheDocument();
  });

  it('should render search input', async () => {
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: mockSchoolListItems,
      error: null,
      isPending: false,
    });

    render(<SchoolsListPage />);

    const searchInput = screen.getByPlaceholderText('Search');
    expect(searchInput).toBeInTheDocument();
  });

  it('should filter schools based on search input', async () => {
    const user = userEvent.setup();
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: mockSchoolListItems,
      error: null,
      isPending: false,
    });

    render(<SchoolsListPage />);

    const searchInput = screen.getByPlaceholderText('Search');

    // Initially all schools should be visible
    expect(screen.getByText('Auckland Grammar School')).toBeInTheDocument();
    expect(screen.getByText('Wellington High School')).toBeInTheDocument();
    expect(screen.getByText('Christchurch Boys High School')).toBeInTheDocument();

    // Type "wellington" to filter
    await user.type(searchInput, 'wellington');

    // Only Wellington school should be visible
    expect(screen.queryByText('Auckland Grammar School')).not.toBeInTheDocument();
    expect(screen.getByText('Wellington High School')).toBeInTheDocument();
    expect(screen.queryByText('Christchurch Boys High School')).not.toBeInTheDocument();
  });

  it('should handle search with special characters', async () => {
    const user = userEvent.setup();
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: mockSchoolListItems,
      error: null,
      isPending: false,
    });

    render(<SchoolsListPage />);

    const searchInput = screen.getByPlaceholderText('Search');

    // Search with punctuation (should strip and match)
    await user.type(searchInput, 'auckland, grammar.');

    expect(screen.getByText('Auckland Grammar School')).toBeInTheDocument();
    expect(screen.queryByText('Wellington High School')).not.toBeInTheDocument();
  });

  it('should show no results when search matches nothing', async () => {
    const user = userEvent.setup();
    const { useSchoolList } = await import('../../hooks/useSchoolList/useSchoolList');
    vi.mocked(useSchoolList).mockReturnValue({
      data: mockSchoolListItems,
      error: null,
      isPending: false,
    });

    render(<SchoolsListPage />);

    const searchInput = screen.getByPlaceholderText('Search');

    await user.type(searchInput, 'nonexistent school name xyz');

    expect(screen.queryByTestId('paginated-table')).not.toBeInTheDocument();
  });
});
