import { Link } from 'react-router';
import { Container, Typography, Button, Stack } from '@mui/material';
import { useDocumentTitle } from '../hooks/useDocumentTitle/useDocumentTitle';

export const NotFound = () => {
  useDocumentTitle('Page Not Found - Schools Viewer');

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
      <Stack spacing={3} alignItems="flex-start">
        <Typography variant="h4" component="h1" tabIndex={-1} sx={{ outline: 'none' }}>
          Page Not Found
        </Typography>
        <Typography variant="body1">
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          aria-label="Return to home page"
        >
          Return Home
        </Button>
      </Stack>
    </Container>
  );
};
