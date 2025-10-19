import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DetailsCard } from './DetailsCard';
import { mockSchool } from '../../../../test/mockData';

describe('DetailsCard', () => {
  it('should render the Details heading', () => {
    render(<DetailsCard school={mockSchool} />);
    expect(screen.getByRole('heading', { name: 'Details' })).toBeInTheDocument();
  });

  it('should render organisation type', () => {
    render(<DetailsCard school={mockSchool} />);
    expect(screen.getByText('Primary School')).toBeInTheDocument();
  });

  it('should render address 1 details', () => {
    render(<DetailsCard school={mockSchool} />);
    expect(screen.getByText('123 Test Street')).toBeInTheDocument();
    expect(screen.getAllByText('Thorndon').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Wellington').length).toBeGreaterThan(0);
  });

  it('should render address 2 details', () => {
    render(<DetailsCard school={mockSchool} />);
    expect(screen.getByText('PO Box 456')).toBeInTheDocument();
    expect(screen.getByText('6011')).toBeInTheDocument();
  });

  it('should render geolocation coordinates', () => {
    render(<DetailsCard school={mockSchool} />);
    expect(screen.getByText('-41.2865, 174.7762')).toBeInTheDocument();
  });

  it('should render all table headers', () => {
    render(<DetailsCard school={mockSchool} />);
    expect(screen.getByRole('rowheader', { name: 'Organisation Type' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Address 1' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Address 2' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Geolocation' })).toBeInTheDocument();
  });
});
