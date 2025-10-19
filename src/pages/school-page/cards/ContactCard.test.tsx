import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContactCard } from './ContactCard';
import { mockSchool } from '../../../test/mockData';

describe('ContactCard', () => {
  it('should render the Contact heading', () => {
    render(<ContactCard school={mockSchool} />);
    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument();
  });

  it('should render contact name', () => {
    render(<ContactCard school={mockSchool} />);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should render phone number with tel link', () => {
    render(<ContactCard school={mockSchool} />);
    const phoneLink = screen.getByRole('link', { name: '04-123-4567' });
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute('href', 'tel:041234567');
  });

  it('should render email with mailto link', () => {
    render(<ContactCard school={mockSchool} />);
    const emailLink = screen.getByRole('link', { name: 'test@school.nz' });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:test@school.nz');
  });

  it('should render website URL with link', () => {
    render(<ContactCard school={mockSchool} />);
    const urlLink = screen.getByRole('link', { name: 'https://testschool.nz' });
    expect(urlLink).toBeInTheDocument();
    expect(urlLink).toHaveAttribute('href', 'https://testschool.nz');
  });

  it('should render all table headers', () => {
    render(<ContactCard school={mockSchool} />);
    expect(screen.getByRole('rowheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Phone' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Web' })).toBeInTheDocument();
  });
});
