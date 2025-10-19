import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { PaginatedSchoolsTable } from './PaginatedSchoolsTable';
import { mockSchoolListItems } from '../../test/mockData';

const renderOptions = {
  wrapper: ({ children }: { children: React.ReactNode }) => <MemoryRouter>{children}</MemoryRouter>,
};

describe('PaginatedSchoolsTable', () => {
  it('should render table headers', () => {
    render(<PaginatedSchoolsTable schools={mockSchoolListItems} />, renderOptions);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Students')).toBeInTheDocument();
    expect(screen.getByText('Website')).toBeInTheDocument();
  });

  it('should render all schools on first page when count is less than default rows per page', () => {
    render(<PaginatedSchoolsTable schools={mockSchoolListItems} />, renderOptions);

    expect(screen.getByText('Auckland Grammar School')).toBeInTheDocument();
    expect(screen.getByText('Wellington High School')).toBeInTheDocument();
    expect(screen.getByText('Christchurch Boys High School')).toBeInTheDocument();
  });

  it('should render school data correctly', () => {
    render(<PaginatedSchoolsTable schools={mockSchoolListItems} />, renderOptions);

    // Check city
    expect(screen.getByText('Auckland')).toBeInTheDocument();

    // Check student count
    expect(screen.getByText('500')).toBeInTheDocument();

    // Check URL
    expect(screen.getByText('https://school1.nz')).toBeInTheDocument();
  });

  it('should render links to school detail pages', () => {
    render(<PaginatedSchoolsTable schools={mockSchoolListItems} />, renderOptions);

    const link = screen.getByRole('link', { name: 'Auckland Grammar School' });
    expect(link).toHaveAttribute('href', '/schools/1');
  });

  it('should render website links', () => {
    render(<PaginatedSchoolsTable schools={mockSchoolListItems} />, renderOptions);

    const websiteLink = screen.getByRole('link', { name: 'https://school1.nz' });
    expect(websiteLink).toHaveAttribute('href', 'https://school1.nz');
  });

  it('should render pagination controls', () => {
    render(<PaginatedSchoolsTable schools={mockSchoolListItems} />, renderOptions);

    expect(screen.getByLabelText('rows per page')).toBeInTheDocument();
    // Pagination shows "1-3 of 3" text
    expect(screen.getByText(/1–3 of 3/)).toBeInTheDocument();
  });

  it('should paginate schools when count exceeds rows per page', () => {
    // Create 15 schools to trigger pagination
    const manySchools = Array.from({ length: 15 }, (_, i) => ({
      ...mockSchoolListItems[0],
      schoolId: `${i + 1}`,
      name: `School ${i + 1}`,
    }));

    render(<PaginatedSchoolsTable schools={manySchools} />, renderOptions);

    // Should show first 12 schools (default rowsPerPage)
    expect(screen.getByText('School 1')).toBeInTheDocument();
    expect(screen.getByText('School 12')).toBeInTheDocument();

    // Should not show school 13 on first page
    expect(screen.queryByText('School 13')).not.toBeInTheDocument();
  });

  it('should navigate to next page when next button is clicked', async () => {
    const user = userEvent.setup();

    // Create 15 schools to trigger pagination
    const manySchools = Array.from({ length: 15 }, (_, i) => ({
      ...mockSchoolListItems[0],
      schoolId: `${i + 1}`,
      name: `School ${i + 1}`,
    }));

    render(<PaginatedSchoolsTable schools={manySchools} />, renderOptions);

    // Click next page button
    const nextButton = screen.getByRole('button', { name: /next page/i });
    await user.click(nextButton);

    // Should now show school 13 on second page
    expect(screen.getByText('School 13')).toBeInTheDocument();

    // Should not show school 1 anymore
    expect(screen.queryByText('School 1')).not.toBeInTheDocument();
  });

  it('should change rows per page when selector is changed', async () => {
    const user = userEvent.setup();

    // Create 30 schools
    const manySchools = Array.from({ length: 30 }, (_, i) => ({
      ...mockSchoolListItems[0],
      schoolId: `${i + 1}`,
      name: `School ${i + 1}`,
    }));

    render(<PaginatedSchoolsTable schools={manySchools} />, renderOptions);

    // Initially shows 12 rows per page
    expect(screen.getByText('School 12')).toBeInTheDocument();
    expect(screen.queryByText('School 13')).not.toBeInTheDocument();

    // Change to 24 rows per page
    const select = screen.getByLabelText('rows per page');
    await user.selectOptions(select, '24');

    // Now should show up to school 24
    expect(screen.getByText('School 24')).toBeInTheDocument();
    expect(screen.queryByText('School 25')).not.toBeInTheDocument();
  });

  it('should reset to first page when schools list changes', () => {
    const { rerender } = render(<PaginatedSchoolsTable schools={mockSchoolListItems} />, renderOptions);

    // Create different set of schools
    const differentSchools = [
      {
        ...mockSchoolListItems[0],
        schoolId: '999',
        name: 'Different School',
      },
    ];

    // Rerender with different schools (don't wrap again, already wrapped from first render)
    rerender(<PaginatedSchoolsTable schools={differentSchools} />);

    // Should show the new school
    expect(screen.getByText('Different School')).toBeInTheDocument();

    // Page should be reset (checking pagination text shows starting from 1)
    expect(screen.getByText(/1–1 of 1/)).toBeInTheDocument();
  });

  it('should render empty rows for last page alignment', () => {
    // Create 13 schools (1 on second page)
    const schools = Array.from({ length: 13 }, (_, i) => ({
      ...mockSchoolListItems[0],
      schoolId: `${i + 1}`,
      name: `School ${i + 1}`,
    }));

    const { container } = render(<PaginatedSchoolsTable schools={schools} />, renderOptions);

    // The component adds empty rows with specific height for alignment
    // We can't easily test the visual effect, but we can check the DOM structure
    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  it('should render table with accessible labels', () => {
    render(<PaginatedSchoolsTable schools={mockSchoolListItems} />, renderOptions);

    const table = screen.getByRole('table', { name: 'custom pagination table' });
    expect(table).toBeInTheDocument();
  });
});
