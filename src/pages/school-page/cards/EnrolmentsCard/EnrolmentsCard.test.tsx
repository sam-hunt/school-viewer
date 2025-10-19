import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EnrolmentsCard } from './EnrolmentsCard';
import { mockSchool } from '../../../../test/mockData';
import { School } from '../../../../models/School';

// Mock the Nivo charts
vi.mock('@nivo/bar', () => ({ Bar: () => <div data-testid="bar-chart">Bar Chart</div> }));
vi.mock('@nivo/pie', () => ({ Pie: () => <div data-testid="pie-chart">Pie Chart</div> }));
// Mock useWindowSize hook
vi.mock('../../../../hooks/useWindowSize/useWindowSize', () => ({
  useWindowSize: () => ({ width: 1024, height: 768 }),
}));

describe('EnrolmentsCard', () => {
  beforeEach(() => {
    // Set window.innerWidth for responsive logic
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it('should render the Enrolments heading with total', () => {
    render(<EnrolmentsCard school={mockSchool} />);
    expect(screen.getByRole('heading', { name: 'Enrolments (255)' })).toBeInTheDocument();
  });

  it('should render pie chart when window width > 640', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });

    render(<EnrolmentsCard school={mockSchool} />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('should render bar chart when window width <= 640', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    render(<EnrolmentsCard school={mockSchool} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
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
});
