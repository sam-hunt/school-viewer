import { useParams, useNavigate } from 'react-router';
import { useSchool } from '../../hooks/useSchool/useSchool';
import { Button, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import { DetailsCard } from './cards/DetailsCard';
import { MiscellaneousCard } from './cards/MiscellaneousCard';
import { ContactCard } from './cards/ContactCard';
import { EnrolmentsCard } from './cards/EnrolmentsCard';
import { MapCard } from './cards/MapCard';

export const SchoolPage = () => {
  const { schoolId } = useParams() as { schoolId: string };
  const navigate = useNavigate();
  const { data: school, error, isPending } = useSchool(schoolId);
  const title = isPending ? 'Loading School...' : error ? 'Unable to Load School' : school?.orgName;

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
        <Stack spacing={2} alignItems="flex-start">
          <Typography color="text.secondary">
            We're having trouble loading this school's information. This could be due to a network issue or the school may not exist in our database.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outlined" onClick={() => navigate('/schools')}>
              Browse All Schools
            </Button>
          </Stack>
        </Stack>
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
