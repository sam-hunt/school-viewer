import { Stack, CircularProgress, Typography } from '@mui/material';

export const LazyLoadingFallback = () => (
  <Stack minHeight="90vh" direction="column" spacing={2} justifyContent="center" alignItems="center">
    <Typography variant="h5" component="h1">
      Loading...
    </Typography>
    <CircularProgress />
  </Stack>
);
