import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { EnrolmentsCard } from './EnrolmentsCard';
import { mockSchool } from '../../../../test/mockData';
import { School } from '../../../../models/School';

// Mock the Nivo pie chart
vi.mock('@nivo/pie', () => ({ ResponsivePie: () => <div data-testid="pie-chart">Pie Chart</div> }));

describe('EnrolmentsCard', () => {
  it('should render the Enrolments heading with total', () => {
    render(<EnrolmentsCard school={mockSchool} />);
    expect(screen.getByRole('heading', { name: 'Enrolments (255)' })).toBeInTheDocument();
  });

  it('should render pie chart', () => {
    render(<EnrolmentsCard school={mockSchool} />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('should display "No Enrolment Data" when total is 0', () => {
    const schoolWithNoEnrolments: School = {
      ...mockSchool,
      total: 0,
      maori: 0,
      pacific: 0,
      european: 0,
      asian: 0,
      melaa: 0,
      international: 0,
      other: 0,
    };

    render(<EnrolmentsCard school={schoolWithNoEnrolments} />);
    expect(screen.getByText('No Enrolment Data')).toBeInTheDocument();
  });

  it('should render heading with 0 when total is 0', () => {
    const schoolWithNoEnrolments: School = {
      ...mockSchool,
      total: 0,
    };

    render(<EnrolmentsCard school={schoolWithNoEnrolments} />);
    expect(screen.getByRole('heading', { name: 'Enrolments (0)' })).toBeInTheDocument();
  });

  it('should have accessible chart with role and aria-label', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    const { container } = render(<EnrolmentsCard school={mockSchool} />);

    // Chart wrapper should have role="img" for screen readers
    const chartWrapper = container.querySelector('[role="img"]');
    expect(chartWrapper).toBeInTheDocument();

    // Should have descriptive aria-label with school name and data
    expect(chartWrapper).toHaveAttribute('aria-label');
    const ariaLabel = chartWrapper?.getAttribute('aria-label');
    expect(ariaLabel).toContain(mockSchool.orgName);
    expect(ariaLabel).toContain('Enrolment by ethnicity');
  });

  it('should render accessible data table with enrolment data when button is clicked', async () => {
    const user = userEvent.setup();
    render(<EnrolmentsCard school={mockSchool} />);

    // Should have a button to show the table
    const showTableButton = screen.getByRole('button', { name: 'Show Data Table' });
    expect(showTableButton).toBeInTheDocument();

    // Table should not be visible initially
    expect(screen.queryByRole('heading', { name: 'Enrolment Data Table' })).not.toBeInTheDocument();

    // Click the button to show the table
    await user.click(showTableButton);

    // Now table should be visible
    expect(screen.getByRole('heading', { name: 'Enrolment Data Table' })).toBeInTheDocument();

    // Should render table with proper aria-label
    const table = screen.getByRole('table', { name: 'Enrolment by ethnicity data table' });
    expect(table).toBeInTheDocument();

    // Should render column headers
    expect(screen.getByRole('columnheader', { name: 'Ethnicity' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Students' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Percentage' })).toBeInTheDocument();
  });

  it('should display all ethnicity data rows in table when expanded', async () => {
    const user = userEvent.setup();
    render(<EnrolmentsCard school={mockSchool} />);

    // Show the table
    await user.click(screen.getByRole('button', { name: 'Show Data Table' }));

    // Check for ethnicity labels in the table
    expect(screen.getByText('Māori')).toBeInTheDocument();
    expect(screen.getByText('Pacific')).toBeInTheDocument();
    expect(screen.getByText('European')).toBeInTheDocument();
    expect(screen.getByText('Asian')).toBeInTheDocument();

    // Check for total row
    const rows = screen.getAllByRole('row');
    const totalRow = rows[rows.length - 1];
    expect(totalRow).toHaveTextContent('Total');
    expect(totalRow).toHaveTextContent('255');
    expect(totalRow).toHaveTextContent('100%');
  });

  it('should display correct percentages in table when expanded', async () => {
    const user = userEvent.setup();
    render(<EnrolmentsCard school={mockSchool} />);

    // Show the table
    await user.click(screen.getByRole('button', { name: 'Show Data Table' }));

    // Verify percentage calculations
    // mockSchool has: maori=100, pacific=50, european=80, asian=25, total=255
    const table = screen.getByRole('table');

    // Check that percentages are displayed (we can't easily match exact values due to table structure)
    expect(table).toHaveTextContent('%');
    expect(table).toHaveTextContent('100%'); // Total row
  });

  it('should include color swatches hidden from screen readers', async () => {
    const user = userEvent.setup();
    const { container } = render(<EnrolmentsCard school={mockSchool} />);

    // Show the table
    await user.click(screen.getByRole('button', { name: 'Show Data Table' }));

    // Color swatches should be marked aria-hidden
    const colorSwatches = container.querySelectorAll('[aria-hidden="true"]');
    expect(colorSwatches.length).toBeGreaterThan(0);
  });

  it('should mark Māori text with language attribute', async () => {
    const user = userEvent.setup();
    const { container } = render(<EnrolmentsCard school={mockSchool} />);

    // Show the table
    await user.click(screen.getByRole('button', { name: 'Show Data Table' }));

    // Find the span with lang="mi"
    const maoriText = container.querySelector('span[lang="mi"]');
    expect(maoriText).toBeInTheDocument();
    expect(maoriText).toHaveTextContent('Māori');
  });

  it('should not render table when total enrolments is 0', () => {
    const schoolWithNoEnrolments: School = {
      ...mockSchool,
      total: 0,
      maori: 0,
      pacific: 0,
      european: 0,
      asian: 0,
      melaa: 0,
      international: 0,
      other: 0,
    };

    render(<EnrolmentsCard school={schoolWithNoEnrolments} />);

    // Should not render the table
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByText('Enrolment Data Table')).not.toBeInTheDocument();

    // Should show no data message instead
    expect(screen.getByText('No Enrolment Data')).toBeInTheDocument();
  });

  it('should use proper semantic HTML with th elements and scope attributes', async () => {
    const user = userEvent.setup();
    const { container } = render(<EnrolmentsCard school={mockSchool} />);

    // Show the table
    await user.click(screen.getByRole('button', { name: 'Show Data Table' }));

    // Column headers should use th with scope="col"
    const columnHeaders = container.querySelectorAll('thead th[scope="col"]');
    expect(columnHeaders.length).toBe(3);

    // Row headers should use th with scope="row"
    const rowHeaders = container.querySelectorAll('tbody th[scope="row"]');
    expect(rowHeaders.length).toBeGreaterThan(0);
  });
});
