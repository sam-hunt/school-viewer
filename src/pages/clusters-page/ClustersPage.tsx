import { Feature, FeatureCollection, Point } from 'geojson';
import { useNavigate } from 'react-router';
import { useSchoolList } from '../../hooks/useSchoolList/useSchoolList';
import { SchoolListItem } from '../../models/SchoolListItem';
import { MapboxGLClusteredMap } from './MapboxglClusteredMap';
import { useMemo, useState } from 'react';
import { Button, FormControl, Box, InputLabel, MenuItem, Select, Stack, Typography, Container, Skeleton, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useFocusOnNavigation } from '../../hooks/useFocusOnNavigation/useFocusOnNavigation';
import { useDocumentTitle } from '../../hooks/useDocumentTitle/useDocumentTitle';

type SchoolFeature = Feature<Point, SchoolListItem>;

export const ClustersPage: React.FC = () => {
  const headingRef = useFocusOnNavigation();
  const [mapGrouping, setMapGrouping] = useState<keyof SchoolListItem>('count');
  const { data: schoolsList, error, isPending } = useSchoolList();
  const [mapContainerEl, setMapContainerEl] = useState<HTMLDivElement>();
  const navigate = useNavigate();

  useDocumentTitle('School Clusters Map - Schools Viewer');

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

  // TODO: Better way to do this, or maybe react-map-gl can handle this?
  const mapHeight = `calc(${mapContainerEl?.clientHeight ? `${mapContainerEl.clientHeight.toString()}px` : '85vh'} - 50px)`;
  const mapWidth = mapContainerEl?.clientWidth ? `${mapContainerEl.clientWidth.toString()}px` : '95vw';

  return (
    <Container id="home-section" component="section" maxWidth="xl">
      <Stack direction="row" alignItems="center" my={3} gap={2}>
        <Typography variant="h4" component="h1" flexGrow="1" ref={headingRef} tabIndex={-1} sx={{ outline: 'none' }}>
          NZ Schools Directory
        </Typography>
        <FormControl>
          <InputLabel id="map-grouping-select-label">Cluster Metric</InputLabel>
          <Select
            labelId="map-grouping-select-label"
            id="map-grouping-select"
            value={mapGrouping}
            label="Cluster Metric"
            onChange={event => setMapGrouping(event.target.value as keyof SchoolListItem)}
            IconComponent={ExpandMoreIcon}
            sx={{ width: 250 }}
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
        <Tooltip title={<Typography>Select a school or cluster for more information</Typography>} enterDelay={0}>
          <HelpOutlineIcon sx={{ width: '28px', height: '28px', cursor: 'help' }} />
        </Tooltip>
      </Stack>

      {schoolsList && (
        <Box ref={(el: HTMLDivElement) => setMapContainerEl(el)}>
          <MapboxGLClusteredMap<SchoolListItem>
            width={mapWidth}
            height={mapHeight}
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
        <Box
          role="status"
          aria-live="polite"
          aria-label="Loading school map data"
          sx={{ width: '100%', height: '85vh' }}
        >
          <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 1 }} />
        </Box>
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
