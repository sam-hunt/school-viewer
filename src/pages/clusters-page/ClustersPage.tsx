import { Feature, FeatureCollection, Point } from 'geojson';
import { useNavigate } from 'react-router';
import { useSchoolList } from '../../hooks/useSchoolList/useSchoolList';
import { SchoolListItem } from '../../models/SchoolListItem';
import { MapboxGLClusteredMap } from './MapboxglClusteredMap';
import { useMemo, useState } from 'react';
import { Button, FormControl, Box, InputLabel, MenuItem, Select, Stack, Typography, Container, Skeleton, Tooltip, useTheme, Card } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useFocusOnNavigation } from '../../hooks/useFocusOnNavigation/useFocusOnNavigation';
import { useDocumentTitle } from '../../hooks/useDocumentTitle/useDocumentTitle';
import { grey } from '@mui/material/colors';

type SchoolFeature = Feature<Point, SchoolListItem>;

// Background colors that match MapTiler's dataviz tile backgrounds
// These eliminate the white/dark flash while tiles are loading
const MAP_BG_DARK = '#141414'; // Matches dataviz-dark tile background
const MAP_BG_LIGHT = '#e0e0e1'; // Matches dataviz-light tile background

export const ClustersPage: React.FC = () => {
  const headingRef = useFocusOnNavigation();
  const theme = useTheme();
  const [mapGrouping, setMapGrouping] = useState<keyof SchoolListItem>('count');
  const { data: schoolsList, error, isPending } = useSchoolList();
  const navigate = useNavigate();

  useDocumentTitle('School Clusters Map - Schools Viewer');

  const mapBackgroundColor = theme.palette.mode === 'dark' ? MAP_BG_DARK : MAP_BG_LIGHT;

  const onFeatureClick = (feature: SchoolFeature) => void navigate(`/schools/${feature.properties.schoolId}`);

  const featureCollection: FeatureCollection = useMemo(() => ({
    type: 'FeatureCollection',
    features: (schoolsList ?? [])
      .filter(school => school.lat && school.lng)
      .map(
        (school: SchoolListItem): SchoolFeature => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [school.lng, school.lat],
          },
          properties: school,
        }),
      ),
  }), [schoolsList]);

  return (
    <Container id="home-section" component="section" maxWidth="xl">
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} my={3} gap={2}>
        <Stack direction="row" alignItems="center" gap={1} flexGrow="1">
          <Typography variant="h4" component="h1" ref={headingRef} tabIndex={-1} sx={{ outline: 'none' }}>
            NZ Schools Directory
          </Typography>
          <Tooltip title={<Typography>Select a school or cluster for more information</Typography>} enterDelay={0}>
            <HelpOutlineIcon sx={{ width: '28px', height: '28px', cursor: 'help', color: grey[400] }} />
          </Tooltip>
        </Stack>
        <FormControl sx={{ minWidth: { xs: '100%', sm: 250 } }}>
          <InputLabel id="map-grouping-select-label">Cluster Metric</InputLabel>
          <Select
            labelId="map-grouping-select-label"
            id="map-grouping-select"
            value={mapGrouping}
            label="Cluster Metric"
            onChange={event => setMapGrouping(event.target.value as keyof SchoolListItem)}
            IconComponent={ExpandMoreIcon}
            size="small"
          >
            <MenuItem value="count">School Locations</MenuItem>
            <MenuItem value="maori">Māori Enrolments</MenuItem>
            <MenuItem value="pacific">Pacific Enrolments</MenuItem>
            <MenuItem value="european">European Enrolments</MenuItem>
            <MenuItem value="asian">Asian Enrolments</MenuItem>
            <MenuItem value="melaa">MELAA Enrolments</MenuItem>
            <MenuItem value="international">International Enrolments</MenuItem>
            <MenuItem value="other">Other Enrolments</MenuItem>
            <MenuItem value="total">Total Enrolments</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {schoolsList && (
        <Box sx={{ width: '100%', height: 'calc(85vh - 50px)', borderRadius: 1, overflow: 'hidden', backgroundColor: mapBackgroundColor }}>
          <MapboxGLClusteredMap<SchoolListItem>
            lat={-41}
            lng={173}
            zoom={5}
            features={featureCollection}
            onFeatureClick={onFeatureClick}
            clusterByProperty={mapGrouping}
          />
        </Box>
      )}

      {isPending && (
        <Card
          role="status"
          aria-live="polite"
          aria-label="Loading school map data"
          sx={{ width: '100%', height: '85vh', bgcolor: mapBackgroundColor }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            sx={{ borderRadius: 1, bgcolor: mapBackgroundColor }}
            data-testid="skeleton-clusters-map"
          />
        </Card>
      )}

      {error && (
        <Stack spacing={2} alignItems="flex-start" role="alert">
          <Typography variant="h6" color="error">
            Unable to Load Map
          </Typography>
          <Typography color="text.secondary">
            We're having trouble loading the schools data for the map. Please check your internet connection and try again.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Stack>
      )}
    </Container >
  );
};
