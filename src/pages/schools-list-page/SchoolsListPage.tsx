import SearchIcon from '@mui/icons-material/Search';
import { useMemo, useState } from 'react';
import { useSchoolList } from 'hooks/use-school';
import { Box, Stack, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { PaginatedSchoolsTable } from './PaginatedSchoolsTable';

export const SchoolsListPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [schoolsList, schoolsListError, schoolsListPending] = useSchoolList();

  const schoolsMap = useMemo(() => schoolsList?.reduce((acc, school) => acc.set(school.schoolId, school), new Map()), [schoolsList]);

  // Memoize optimized search strings so we don't have to do it on each key press
  const optimizedSchoolsList = useMemo(() => schoolsList?.map((school, index) => ({
    id: school.schoolId,
    i: index,
    name: school.name.replace(/[.,/#!$%^&*;:{}=\-_'`~()]/g, "").toLowerCase(),
  })), [schoolsList]);
  const optimizedSearchValue = useMemo(() => searchTerm.replace(/[.,/#!$%^&*;:{}=\-_'`~()]/g, "").toLowerCase(), [searchTerm]);

  const filteredSchoolsList = useMemo(
    () => optimizedSchoolsList?.filter(s => s.name.includes(optimizedSearchValue)).map(optimizedSchoolItem => schoolsMap?.get(optimizedSchoolItem.id)),
    [optimizedSchoolsList, optimizedSearchValue, schoolsMap],
  );

  return (
    <section id="schools-list-section">
      <Container>
        <Stack direction="row" my={3} alignItems="center">
          <Typography variant="h4" component="h1">Find a school</Typography>
          <Box flexGrow={1} />
          <TextField
            value={searchTerm}
            onChange={v => {
              setSearchTerm(v.target.value.toLowerCase());
            }}
            sx={{ minWidth: 300 }}
            placeholder="Search"
            InputProps={{
              startAdornment:
                <SearchIcon sx={{ mr: 1 }} />,
            }}
          />
        </Stack>
        {!!schoolsListError && <Typography variant="h3" color="error">{schoolsListError.toString()}</Typography>}
        {filteredSchoolsList && filteredSchoolsList.length > 0 && <PaginatedSchoolsTable schools={filteredSchoolsList!} />}
        {schoolsListPending && (
          <Stack height="50vh" direction="column" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Stack>
        )}
      </Container>
    </section >
  );
}
