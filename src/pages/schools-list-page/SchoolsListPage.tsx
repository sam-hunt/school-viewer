import { useMemo, useState } from 'react';
import { Box, Stack, CircularProgress, Container, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { useSchoolList } from '../../hooks/use-school';
import { SchoolListItem } from '../../models/school-list-item.interface';
import { PaginatedSchoolsTable } from './PaginatedSchoolsTable';

export const SchoolsListPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data: schools, error, isPending } = useSchoolList();

  const schoolsMap = useMemo(() => schools?.reduce((acc, school) => acc.set(school.schoolId, school), new Map()), [schools]);

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

  const optimizedSearchValue = useMemo(() => searchTerm.replace(/[.,/#!$%^&*;:{}=\-_'`~()]/g, '').toLowerCase(), [searchTerm]);

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
    <section id="schools-list-section">
      <Container>
        <Stack direction="row" my={3} alignItems="center">
          <Typography variant="h4" component="h1">
            Find a school
          </Typography>
          <Box flexGrow={1} />
          <TextField
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value.toLowerCase())}
            sx={{ minWidth: 300 }}
            placeholder="Search"
            // TODO: Migrate to slotProps API
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
            size="small"
          />
        </Stack>
        {error && (
          <Typography variant="h3" color="error">
            {error.toString()}
          </Typography>
        )}
        {filteredSchoolsList.length > 0 && <PaginatedSchoolsTable schools={filteredSchoolsList} />}
        {isPending && (
          <Stack height="50vh" direction="column" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}
      </Container>
    </section>
  );
};
