import { useSchool } from 'hooks/use-school';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import { DetailsCard } from './cards/DetailsCard';
import { MiscellaneousCard } from './cards/MiscellaneousCard';
import { ContactCard } from './cards/ContactCard';
import { EnrolmentsCard } from './cards/EnrolmentsCard';
import { MapCard } from './cards/MapCard';

export const SchoolPage = () => {

  const { schoolId } = useParams() as { schoolId: string };
  const [school, schoolError, schoolPending] = useSchool(schoolId);

  return (
    <Container component="section">
      <Typography variant="h4" component="h1" mt={3} mb={3}>{school?.orgName || 'Loading School...'}</Typography>

      {schoolPending && (
        <Stack height="50vh" direction="column" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      )}

      {!!schoolError && (
        <Container>
          <Typography color="error" fontWeight="bold">{JSON.stringify(schoolError)}</Typography>
        </Container>
      )}

      {!schoolPending && !schoolError && <Box>
        <Grid container spacing={4}>
          <Grid item md={5} sm={12}>
            <Stack direction="column" spacing={4}>
              <DetailsCard school={school!} />
              <MiscellaneousCard school={school!} />
              <ContactCard school={school!} />
            </Stack>
          </Grid >
          <Grid item md={7} sm={12}>
            <Stack direction="column" spacing={4}>
              <EnrolmentsCard school={school!} />
              <MapCard school={school!} />
            </Stack>
          </Grid>
        </Grid >
      </Box >}
    </Container >
  );
}