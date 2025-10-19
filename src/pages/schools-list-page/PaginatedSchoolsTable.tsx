import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { TableHead, Typography } from '@mui/material';

import { TablePaginationActions } from './TablePaginationActions';
import { SchoolListItem } from '../../models/school-list-item.interface';

interface PaginatedSchoolsTableProps {
  schools: SchoolListItem[];
}

const noWrapCss = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

export const PaginatedSchoolsTable = ({ schools }: PaginatedSchoolsTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  // Reset to first page when filtering changes
  useEffect(() => setPage(0), [schools]);

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
    <Table sx={{ minWidth: 300, p: 0 }} aria-label="custom pagination table">
      <TableHead>
        <TableRow>
          <TableCell align="left">Name</TableCell>
          <TableCell align="left">City</TableCell>
          <TableCell align="right">Students</TableCell>
          <TableCell align="right">Website</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(rowsPerPage > 0 ? schools.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : schools).map(school => (
          <TableRow key={school.schoolId}>
            <TableCell sx={{ width: 300 }} scope="row">
              <Link to={'/schools/' + school.schoolId} key={school.schoolId} className="school-list-item">
                <Typography sx={noWrapCss}>{school.name}</Typography>
              </Link>
            </TableCell>
            <TableCell sx={{ width: 100 }} scope="row">
              <Typography sx={noWrapCss}>{school.city}</Typography>
            </TableCell>
            <TableCell sx={{ width: 100 }} align="right">
              {school.total}
            </TableCell>
            <TableCell sx={{ width: 100 }} align="right">
              <Typography sx={noWrapCss}>
                <a href={school.url}>{school.url}</a>
              </Typography>
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
            // TODO: Migrate to slotProps API
            SelectProps={{
              inputProps: { 'aria-label': 'rows per page' },
              native: true,
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
};
