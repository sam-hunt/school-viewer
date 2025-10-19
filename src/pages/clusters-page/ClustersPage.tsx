import { Feature, FeatureCollection, Point } from 'geojson';
import { useNavigate } from 'react-router';
import { useSchoolList } from '../../hooks/useSchoolList/useSchoolList';
import { SchoolListItem } from '../../models/SchoolListItem';
import { MapboxGLClusteredMap } from './MapboxglClusteredMap';
import { useMemo, useState } from 'react';
import { FormControl, Box, InputLabel, MenuItem, Select, Stack, Typography, Container, CircularProgress, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

type SchoolFeature = Feature<Point, { schoolId: string; name: string; total: number }>;

export const ClustersPage: React.FC = () => {
  const [mapGrouping, setMapGrouping] = useState<keyof SchoolListItem>('count');
  const { data: schoolsList, error, isPending } = useSchoolList();
  const [mapContainerEl, setMapContainerEl] = useState<HTMLDivElement>();
  const navigate = useNavigate();

  const onFeatureClick = (feature: SchoolFeature) => navigate(`/schools/${feature.properties.schoolId}`);

  const featureCollection: FeatureCollection = useMemo(() => ({
    type: 'FeatureCollection',
    features: (schoolsList || [])
      .filter(school => school.lat && school.lng)
      .map(
        (school: SchoolListItem): SchoolFeature => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [+school.lng, +school.lat],
          },
          properties: school,
        }),
      ),
  }), [schoolsList]);

  // TODO: Better way to do this, or maybe react-map-gl can handle this?
  const mapHeight = `calc(${mapContainerEl?.clientHeight || '85vh'} - 50px)`;
  const mapWidth = mapContainerEl?.clientWidth ? mapContainerEl?.clientWidth : '95vw';

  return (
    <Container id="home-section" component="section" maxWidth="xl">
      <Stack direction="row" alignItems="center" my={3} gap={2}>
        <Typography variant="h4" component="h1" flexGrow="1">
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
        <Box ref={(el: any) => setMapContainerEl(el)}>
          <MapboxGLClusteredMap
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
        <Stack height="50vh" direction="column" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      )}

      {error && (
        <Typography color="error" fontWeight="bold">
          {JSON.stringify(error)}
        </Typography>
      )}
    </Container >
  );
};
