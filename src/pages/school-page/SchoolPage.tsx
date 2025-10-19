import { useParams } from 'react-router';
import { useSchool } from '../../hooks/useSchool/useSchool';
import { CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import { DetailsCard } from './cards/DetailsCard';
import { MiscellaneousCard } from './cards/MiscellaneousCard';
import { ContactCard } from './cards/ContactCard';
import { EnrolmentsCard } from './cards/EnrolmentsCard';
import { MapCard } from './cards/MapCard';

export const SchoolPage = () => {
  const { schoolId } = useParams() as { schoolId: string };
  const { data: school, error, isPending } = useSchool(schoolId);
  const title = isPending ? 'Loading School...' : error ? 'Error loading school' : school?.orgName;

  return (
    <Container component="section" maxWidth="xl">
      <Typography variant="h4" component="h1" mt={3} mb={3}>
        {title}
      </Typography>

      {isPending && (
        <Stack height="50vh" direction="column" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      )}

      {error && (
        <Typography color="error" fontWeight="bold">
          {JSON.stringify(error)}
        </Typography>
      )}

      {school && (
        <Grid container spacing={4}>
          <Grid size={{ md: 5, sm: 12 }}>
            <Stack direction="column" spacing={4}>
              <DetailsCard school={school} />
              <MiscellaneousCard school={school} />
              <ContactCard school={school} />
            </Stack>
          </Grid>
          <Grid size={{ md: 7, sm: 12 }}>
            <Stack direction="column" spacing={4}>
              <EnrolmentsCard school={school} />
              <MapCard school={school} />
            </Stack>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};
