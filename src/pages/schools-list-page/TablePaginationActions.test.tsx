import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TablePaginationActions } from './TablePaginationActions';

describe('TablePaginationActions', () => {
  const mockOnPageChange = vi.fn();

  const defaultProps = {
    count: 100,
    page: 2,
    rowsPerPage: 10,
    onPageChange: mockOnPageChange,
  };

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('should render all four navigation buttons', () => {
    render(<TablePaginationActions {...defaultProps} />);

    expect(screen.getByLabelText('first page')).toBeInTheDocument();
    expect(screen.getByLabelText('previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('next page')).toBeInTheDocument();
    expect(screen.getByLabelText('last page')).toBeInTheDocument();
  });

  it('should call onPageChange with 0 when first page button is clicked', async () => {
    const user = userEvent.setup();
    render(<TablePaginationActions {...defaultProps} />);

    const firstPageButton = screen.getByLabelText('first page');
    await user.click(firstPageButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(expect.any(Object), 0);
  });

  it('should call onPageChange with page - 1 when previous button is clicked', async () => {
    const user = userEvent.setup();
    render(<TablePaginationActions {...defaultProps} />);

    const previousButton = screen.getByLabelText('previous page');
    await user.click(previousButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(expect.any(Object), 1);
  });

  it('should call onPageChange with page + 1 when next button is clicked', async () => {
    const user = userEvent.setup();
    render(<TablePaginationActions {...defaultProps} />);

    const nextButton = screen.getByLabelText('next page');
    await user.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(expect.any(Object), 3);
  });

  it('should call onPageChange with last page index when last page button is clicked', async () => {
    const user = userEvent.setup();
    render(<TablePaginationActions {...defaultProps} />);

    const lastPageButton = screen.getByLabelText('last page');
    await user.click(lastPageButton);

    // Last page index = Math.ceil(100 / 10) - 1 = 9
    expect(mockOnPageChange).toHaveBeenCalledWith(expect.any(Object), 9);
  });

  it('should disable first and previous buttons when on first page', () => {
    render(<TablePaginationActions {...defaultProps} page={0} />);

    expect(screen.getByLabelText('first page')).toBeDisabled();
    expect(screen.getByLabelText('previous page')).toBeDisabled();
    expect(screen.getByLabelText('next page')).not.toBeDisabled();
    expect(screen.getByLabelText('last page')).not.toBeDisabled();
  });

  it('should disable next and last buttons when on last page', () => {
    render(<TablePaginationActions {...defaultProps} page={9} />);

    expect(screen.getByLabelText('first page')).not.toBeDisabled();
    expect(screen.getByLabelText('previous page')).not.toBeDisabled();
    expect(screen.getByLabelText('next page')).toBeDisabled();
    expect(screen.getByLabelText('last page')).toBeDisabled();
  });

  it('should handle edge case with single page of results', () => {
    render(<TablePaginationActions count={5} page={0} rowsPerPage={10} onPageChange={mockOnPageChange} />);

    // All navigation should be disabled on a single page
    expect(screen.getByLabelText('first page')).toBeDisabled();
    expect(screen.getByLabelText('previous page')).toBeDisabled();
    expect(screen.getByLabelText('next page')).toBeDisabled();
    expect(screen.getByLabelText('last page')).toBeDisabled();
  });

  it('should calculate last page correctly with partial last page', async () => {
    const user = userEvent.setup();
    render(<TablePaginationActions count={95} page={0} rowsPerPage={10} onPageChange={mockOnPageChange} />);

    const lastPageButton = screen.getByLabelText('last page');
    await user.click(lastPageButton);

    // Last page index = Math.ceil(95 / 10) - 1 = 9
    expect(mockOnPageChange).toHaveBeenCalledWith(expect.any(Object), 9);
  });

  it('should enable all buttons when on middle page', () => {
    render(<TablePaginationActions {...defaultProps} page={5} />);

    expect(screen.getByLabelText('first page')).not.toBeDisabled();
    expect(screen.getByLabelText('previous page')).not.toBeDisabled();
    expect(screen.getByLabelText('next page')).not.toBeDisabled();
    expect(screen.getByLabelText('last page')).not.toBeDisabled();
  });

  it('should render correct icons based on theme direction', () => {
    const { container } = render(<TablePaginationActions {...defaultProps} />);

    // Check that icons are rendered (default ltr direction)
    const icons = container.querySelectorAll('.MuiSvgIcon-root');
    expect(icons.length).toBe(4);
  });

  it('should handle empty results gracefully', () => {
    render(<TablePaginationActions count={0} page={0} rowsPerPage={10} onPageChange={mockOnPageChange} />);

    // All buttons should be disabled with no results
    expect(screen.getByLabelText('first page')).toBeDisabled();
    expect(screen.getByLabelText('previous page')).toBeDisabled();
    expect(screen.getByLabelText('next page')).toBeDisabled();
    expect(screen.getByLabelText('last page')).toBeDisabled();

    // Verify onPageChange hasn't been called (disabled buttons can't be clicked)
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  it('should handle very large datasets', async () => {
    const user = userEvent.setup();
    render(<TablePaginationActions count={10000} page={0} rowsPerPage={10} onPageChange={mockOnPageChange} />);

    const lastPageButton = screen.getByLabelText('last page');
    await user.click(lastPageButton);

    // Last page = Math.ceil(10000 / 10) - 1 = 999
    expect(mockOnPageChange).toHaveBeenCalledWith(expect.any(Object), 999);
  });
});
