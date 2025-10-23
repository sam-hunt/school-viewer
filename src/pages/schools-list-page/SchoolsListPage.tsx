import { useDeferredValue, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Container,
  TextField,
  Typography,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import { useSchoolList } from '../../hooks/useSchoolList/useSchoolList';
import { SchoolListItem } from '../../models/SchoolListItem';
import { PaginatedSchoolsTable } from './PaginatedSchoolsTable';
import { useFocusOnNavigation } from '../../hooks/useFocusOnNavigation/useFocusOnNavigation';
import { useDocumentTitle } from '../../hooks/useDocumentTitle/useDocumentTitle';

export const SchoolsListPage = () => {
  const headingRef = useFocusOnNavigation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  // Defer the search term to avoid blocking the input while filtering
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const { data: schools, error, isPending } = useSchoolList();

  useDocumentTitle('Find a School - Schools Viewer');

  const schoolsMap = useMemo(
    () => schools?.reduce((acc, school) => acc.set(school.schoolId, school), new Map<SchoolListItem['schoolId'], SchoolListItem>()),
    [schools],
  );

  // Memoize optimized search strings so we don't have to do it on each key press
  const optimizedSchoolsList = useMemo(
    () =>
      schools?.map((school, index) => ({
        id: school.schoolId,
        i: index,
        name: school.name.replace(/[.,/#!$%^&*;:{}=\-_'`~()]/g, '').toLowerCase(),
      })) ?? [],
    [schools],
  );

  // Use deferred search term for the expensive filtering operation
  const optimizedSearchValue = useMemo(
    () =>
      deferredSearchTerm
        .trim()
        .toLocaleLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_'`~()]/g, ''),
    [deferredSearchTerm],
  );

  // Memoize filtered schools list so we don't have to do it on each key press
  const filteredSchoolsList = useMemo(
    () =>
      optimizedSchoolsList
        .filter(school => school.name.includes(optimizedSearchValue))
        .map(optimizedSchoolItem => schoolsMap?.get(optimizedSchoolItem.id))
        .filter((school): school is SchoolListItem => school !== undefined),
    [optimizedSchoolsList, optimizedSearchValue, schoolsMap],
  );

  return (
    <Container id="schools-list-section" component="section" maxWidth="xl">
      <Stack direction={{ xs: 'column', sm: 'row' }} my={3} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
        <Typography variant="h4" component="h1" ref={headingRef} tabIndex={-1} sx={{ outline: 'none' }}>
          Find a school
        </Typography>
        <Box flexGrow={1} sx={{ display: { xs: 'none', sm: 'block' } }} />
        <TextField
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)}
          sx={{ minWidth: { xs: '100%', sm: 300 } }}
          label="Search schools"
          slotProps={{
            input: {
              endAdornment: searchTerm ? (
                <IconButton aria-label="Clear search" onClick={() => setSearchTerm('')} edge="end" size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              ) : (
                <SearchIcon />
              ),
            },
          }}
          size="small"
        />
      </Stack>
      {error && (
        <Stack spacing={2} alignItems="flex-start" mb={3} role="alert">
          <Typography variant="h6" color="error">
            Unable to Load Schools
          </Typography>
          <Typography color="text.secondary">
            We're having trouble connecting to the schools database. Please check your internet connection and try again.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Stack>
      )}
      {!isPending && !error && filteredSchoolsList.length > 0 && <PaginatedSchoolsTable schools={filteredSchoolsList} />}
      {!isPending && !error && filteredSchoolsList.length === 0 && deferredSearchTerm && (
        <Stack spacing={2} alignItems="center" py={6}>
          <Typography variant="h6" color="text.secondary">
            No schools found
          </Typography>
          <Typography color="text.secondary">
            No schools match your search for "{deferredSearchTerm}". Try a different search term.
          </Typography>
        </Stack>
      )}
      {isPending && (
        <TableContainer component={Paper} role="status" aria-live="polite" aria-label="Loading schools data">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Skeleton data-testid="skeleton-schools-table-header-name" variant="text" width="60%" />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  <Skeleton data-testid="skeleton-schools-table-header-city" variant="text" width="80%" />
                </TableCell>
                <TableCell>
                  <Skeleton data-testid="skeleton-schools-table-header-students" variant="text" width="40%" />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>
                  <Skeleton data-testid="skeleton-schools-table-header-website" variant="text" width="50%" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 13 }, (_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton data-testid={`skeleton-schools-table-row-${index.toString()}-name`} variant="text" />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Skeleton data-testid={`skeleton-schools-table-row-${index.toString()}-city`} variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton data-testid={`skeleton-schools-table-row-${index.toString()}-students`} variant="text" />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'none', md: 'table-cell' } }}>
                    <Skeleton data-testid={`skeleton-schools-table-row-${index.toString()}-website`} variant="text" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};
