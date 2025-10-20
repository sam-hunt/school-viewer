import { useDeferredValue, useMemo, useState } from 'react';
import { Box, Button, Stack, CircularProgress, Container, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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
    () => schools?.reduce(
      (acc, school) => acc.set(school.schoolId, school),
      new Map<SchoolListItem['schoolId'], SchoolListItem>()
    ),
    [schools]
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
    () => deferredSearchTerm.replace(/[.,/#!$%^&*;:{}=\-_'`~()]/g, '').toLowerCase(),
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
      <Stack direction="row" my={3} alignItems="center">
        <Typography variant="h4" component="h1" ref={headingRef} tabIndex={-1} sx={{ outline: 'none' }}>
          Find a school
        </Typography>
        <Box flexGrow={1} />
        <TextField
          value={searchTerm}
          onChange={event => setSearchTerm(event.target.value.toLowerCase())}
          sx={{ minWidth: 300 }}
          label="Search schools"
          slotProps={{ input: { startAdornment: <SearchIcon sx={{ mr: 1 }} /> } }}
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
      {filteredSchoolsList.length > 0 && <PaginatedSchoolsTable schools={filteredSchoolsList} />}
      {isPending && (
        <Stack
          height="50vh"
          direction="column"
          alignItems="center"
          justifyContent="center"
          role="status"
          aria-live="polite"
          aria-label="Loading data"
        >
          <CircularProgress />
        </Stack>
      )}
    </Container>
  );
};
