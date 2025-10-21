import { useParams, useNavigate } from 'react-router';
import { useSchool } from '../../hooks/useSchool/useSchool';
import { Button, Card, Container, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { DetailsCard } from './cards/DetailsCard/DetailsCard';
import { MiscCard } from './cards/MiscCard/MiscCard';
import { EnrolmentsCard } from './cards/EnrolmentsCard/EnrolmentsCard';
import { MapCard } from './cards/MapCard/MapCard';
import { useFocusOnNavigation } from '../../hooks/useFocusOnNavigation/useFocusOnNavigation';
import { useDocumentTitle } from '../../hooks/useDocumentTitle/useDocumentTitle';

export const SchoolPage = () => {
  const headingRef = useFocusOnNavigation();
  const { schoolId } = useParams() as { schoolId: string };
  const navigate = useNavigate();
  const { data: school, error, isPending } = useSchool(schoolId);
  const title = isPending ? 'Loading School...' : error ? 'Unable to Load School' : school?.orgName;

  useDocumentTitle(school ? `${school.orgName} - Schools Viewer` : undefined);

  return (
    <Container component="section" maxWidth="xl">
      <Typography variant="h4" component="h1" mt={3} mb={3} ref={headingRef} tabIndex={-1} sx={{ outline: 'none' }}>
        {title}
      </Typography>

      {isPending && (
        <Grid container spacing={4} role="status" aria-live="polite" aria-label="Loading school data">
          <Grid size={{ md: 6, sm: 12 }}>
            <Stack direction="column" spacing={4}>
              <Card sx={{ p: 2 }}>
                <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={300} />
              </Card>
              <Card sx={{ p: 2 }}>
                <Skeleton variant="rectangular" height={400} />
              </Card>
            </Stack>
          </Grid>
          <Grid size={{ md: 6, sm: 12 }}>
            <Stack direction="column" spacing={4}>
              <Card sx={{ p: 2 }}>
                <Skeleton variant="text" width="50%" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={300} />
              </Card>
              <Card sx={{ p: 2 }}>
                <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={300} />
              </Card>
            </Stack>
          </Grid>
        </Grid>
      )}

      {error && (
        <Stack spacing={2} alignItems="flex-start" role="alert">
          <Typography color="text.secondary">
            We're having trouble loading this school's information. This could be due to a network issue or the school may not exist in our
            database.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outlined" onClick={() => void navigate('/schools')}>
              Browse All Schools
            </Button>
          </Stack>
        </Stack>
      )}

      {school && (
        <Grid container spacing={4}>
          <Grid size={{ md: 6, sm: 12 }}>
            <Stack direction="column" spacing={4}>
              <DetailsCard school={school} />
              <MapCard school={school} />
            </Stack>
          </Grid>
          <Grid size={{ md: 6, sm: 12 }}>
            <Stack direction="column" spacing={4} sx={{ height: '100%' }}>
              <EnrolmentsCard school={school} />
              <MiscCard school={school} />
            </Stack>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};
