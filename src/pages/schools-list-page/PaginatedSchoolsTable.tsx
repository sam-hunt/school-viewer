import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { TableHead, Typography, Link } from '@mui/material';

import { TablePaginationActions } from './TablePaginationActions';
import { SchoolListItem } from '../../models/SchoolListItem';
import LaunchIcon from '@mui/icons-material/Launch';

interface PaginatedSchoolsTableProps {
  schools: SchoolListItem[];
}

const noWrapCss = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' };
const websiteLinkSx = { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, ...noWrapCss };

export const PaginatedSchoolsTable = ({ schools }: PaginatedSchoolsTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [prevSchools, setPrevSchools] = useState(schools);

  // Reset to first page when filtering changes
  if (schools !== prevSchools) {
    setPrevSchools(schools);
    setPage(0);
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - schools.length) : 0;

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Table sx={{ 'p': 0, '& .MuiTableCell-root': { px: { xs: 1, sm: 2 } } }} aria-label="Searchable list of New Zealand schools">
      <TableHead>
        <TableRow>
          <TableCell align="left" sx={{ width: '100%' }}>
            Name
          </TableCell>
          <TableCell align="left" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
            City
          </TableCell>
          <TableCell align="right">Students</TableCell>
          <TableCell align="right" sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>
            Website
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(rowsPerPage > 0 ? schools.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : schools).map(school => (
          <TableRow key={school.schoolId}>
            <TableCell sx={{ width: '100%', maxWidth: 0 }} scope="row">
              <Link href={`/schools/${school.schoolId}`} key={school.schoolId} className="school-list-item">
                <Typography sx={noWrapCss}>{school.name}</Typography>
              </Link>
            </TableCell>
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} scope="row">
              <Typography sx={noWrapCss}>{school.city}</Typography>
            </TableCell>
            <TableCell align="right">{school.total}</TableCell>
            <TableCell sx={{ ...noWrapCss, display: { xs: 'none', sm: 'none', md: 'table-cell' } }} align="right">
              {school.url ? (
                <Link href={school.url} target="_blank" rel="noopener noreferrer" sx={websiteLinkSx}>
                  {school.url}
                  <LaunchIcon sx={{ fontSize: '1rem' }} />
                </Link>
              ) : (
                <Typography fontSize="small" color="text.secondary" sx={noWrapCss}>
                  No website available
                </Typography>
              )}
            </TableCell>
          </TableRow>
        ))}
        {emptyRows > 0 && (
          <TableRow style={{ height: 53 * emptyRows }}>
            <TableCell colSpan={6} />
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[12, 24]}
            colSpan={4}
            count={schools.length}
            rowsPerPage={rowsPerPage}
            page={page}
            slotProps={{
              select: {
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              },
              actions: TablePaginationActions,
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
};
