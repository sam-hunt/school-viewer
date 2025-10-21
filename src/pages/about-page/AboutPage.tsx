import { Container, Typography } from '@mui/material';
import { useFocusOnNavigation } from '../../hooks/useFocusOnNavigation/useFocusOnNavigation';
import { useDocumentTitle } from '../../hooks/useDocumentTitle/useDocumentTitle';

export const AboutPage = () => {
  const headingRef = useFocusOnNavigation();

  useDocumentTitle('About - Schools Viewer');

  return (
    <Container component="section" maxWidth="sm">
      <Typography variant="h4" component="h1" my={3} ref={headingRef} tabIndex={-1} sx={{ outline: 'none' }}>
        About
      </Typography>
      <Typography sx={{ my: 1 }}>
        A small visualiser for the{' '}
        <a href="https://www.educationcounts.govt.nz/directories/api-new-zealand-schools" target="_blank" rel="noopener noreferrer">
          Schooling Directory API
        </a>{' '}
        provided by the New Zealand Government.
      </Typography>
      <Typography>
        Built with <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">React</a>,{' '}
        <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">TypeScript</a>,{' '}
        <a href="https://mui.com/" target="_blank" rel="noopener noreferrer">MUI</a>,{' '}
        <a href="https://visgl.github.io/react-map-gl/" target="_blank" rel="noopener noreferrer">react-map-gl</a> with{' '}
        <a href="https://maplibre.org/" target="_blank" rel="noopener noreferrer">MapLibre GL</a>,{' '}
        <a href="https://www.maptiler.com/" target="_blank" rel="noopener noreferrer">MapTiler</a>, and{' '}
        <a href="https://nivo.rocks/" target="_blank" rel="noopener noreferrer">Nivo</a>.
      </Typography>
    </Container>
  );
};
