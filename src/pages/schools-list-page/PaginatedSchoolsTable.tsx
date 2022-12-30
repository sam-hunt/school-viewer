import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { TableHead, Typography } from '@mui/material';
import { TablePaginationActions } from './TablePaginationActions';
import { ISchoolListItem } from 'models/school-list-item.interface';
import { Link } from 'react-router-dom';

interface IPaginatedSchoolsTableProps {
  schools: ISchoolListItem[];
}

const noWrapCss = {
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

export const PaginatedSchoolsTable = ({ schools }: IPaginatedSchoolsTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Reset to first page when filtering changes
  useEffect(() => setPage(0), [schools]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - schools.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer>
      <Table sx={{ minWidth: 500 }} aria-label='custom pagination table'>
        <TableHead>
          <TableRow>
            <TableCell align='left'>Name</TableCell>
            <TableCell align='left'>City</TableCell>
            <TableCell align='right'>Students</TableCell>
            <TableCell align='right'>Website</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? schools.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
            )
            : schools
          ).map((school) => (
            <TableRow key={school.schoolId}>
              <TableCell sx={{ width: 300 }} scope='row'>
                <Link
                  to={'/school/' + school.schoolId}
                  key={school.schoolId}
                  className="school-list-item"
                >
                  <Typography sx={noWrapCss}>{school.name}</Typography>
                </Link>
              </TableCell>
              <TableCell sx={{ width: 100 }} scope='row'>
                <Typography sx={noWrapCss}>{school.city}</Typography>
              </TableCell>
              <TableCell sx={{ width: 100 }} align='right'>
                {school.total}
              </TableCell>
              <TableCell sx={{ width: 100 }} align='right'>
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
              rowsPerPageOptions={[10, 25]}
              colSpan={4}
              count={schools.length}
              rowsPerPage={rowsPerPage}
              page={page}
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
    </TableContainer>
  );
};
