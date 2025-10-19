import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MiscellaneousCard } from './MiscellaneousCard';
import { mockSchool } from '../../../test/mockData';

describe('MiscellaneousCard', () => {
  it('should render the Miscellaneous heading', () => {
    render(<MiscellaneousCard school={mockSchool} />);
    expect(screen.getByRole('heading', { name: 'Miscellaneous' })).toBeInTheDocument();
  });

  it('should render all school miscellaneous data', () => {
    render(<MiscellaneousCard school={mockSchool} />);

    expect(screen.getByText('Full Primary')).toBeInTheDocument(); // definition
    expect(screen.getByText('2024-01-01')).toBeInTheDocument(); // rollDate
    expect(screen.getByText('Medium')).toBeInTheDocument(); // eqiIndex
    expect(screen.getByText('Low')).toBeInTheDocument(); // isolationIndex
    expect(screen.getByText('Co-Ed')).toBeInTheDocument(); // coEdStatus
    expect(screen.getByText('Wellington')).toBeInTheDocument(); // educationRegion
    expect(screen.getByText('Wellington Central')).toBeInTheDocument(); // generalElectorate
    expect(screen.getByText('Te Tai Tonga')).toBeInTheDocument(); // maoriElectorate
    expect(screen.getByText('Yes')).toBeInTheDocument(); // schoolDonations
    expect(screen.getByText('State')).toBeInTheDocument(); // authority
  });

  it('should render all table headers', () => {
    render(<MiscellaneousCard school={mockSchool} />);

    expect(screen.getByRole('rowheader', { name: 'Definition' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Roll Date' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Equity Index' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Isolation Index' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'CoEducation Status' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Education Region' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'General Electorate' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Māori Electorate' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'School Donations' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Authority' })).toBeInTheDocument();
  });
});
