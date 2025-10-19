import { Feature, FeatureCollection, Point } from 'geojson';
import { useNavigate } from 'react-router';
import { useSchoolList } from '../../hooks/use-school';
import { SchoolListItem } from '../../models/school-list-item.interface';
import { MapboxGLClusteredMap } from './MapboxglClusteredMap';
import { useMemo, useState } from 'react';
import { FormControl, Box, InputLabel, MenuItem, Select, Stack, Typography, Container, CircularProgress, Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

type SchoolFeature = Feature<Point, { schoolId: string; name: string; total: number }>;

export const ClustersPage: React.FC = () => {
  const [mapGrouping, setMapGrouping] = useState<keyof SchoolListItem>('count');
  const [schoolsList, schoolsListError, schoolsListPending] = useSchoolList();
  const [mapContainerEl, setMapContainerEl] = useState<HTMLDivElement>();
  const navigate = useNavigate();

  const onFeatureClick = (feature: SchoolFeature) => navigate(`/schools/${feature.properties.schoolId}`);

  const features: FeatureCollection = useMemo(() => {
    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    if (!schoolsListPending && !schoolsListError && schoolsList) {
      featureCollection.features = schoolsList!
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
        );
    }
    return featureCollection;
  }, [schoolsList, schoolsListPending, schoolsListError]);

  const mapHeight = `calc(${mapContainerEl?.clientHeight || '85vh'} - 50px)`;
  const mapWidth = mapContainerEl?.clientWidth ? mapContainerEl?.clientWidth - 16 : '95vw';

  return (
    <Stack id="home-section" component="section">
      <Container>
        <Stack direction="row" alignItems="center" my={3}>
          <Typography variant="h4" component="h1" flex="1">
            NZ Schools Directory
          </Typography>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Cluster Metric</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
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
          <Box ml={3}>
            <Tooltip title={<Typography>Select a school or cluster for more information</Typography>}>
              <HelpIcon sx={{ width: '32px', height: '32px' }} />
            </Tooltip>
          </Box>
        </Stack>
      </Container>

      {schoolsListPending && (
        <Stack height="50vh" direction="column" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      )}

      {!!schoolsListError && (
        <Container>
          <Typography color="error" fontWeight="bold">
            {JSON.stringify(schoolsListError)}
          </Typography>
        </Container>
      )}

      {!schoolsListPending && !schoolsListError && (
        <Box ref={(el: any) => setMapContainerEl(el)} px={2} py={0}>
          <MapboxGLClusteredMap
            width={mapWidth}
            height={mapHeight}
            lat={-41}
            lng={173}
            zoom={5}
            features={features}
            onFeatureClick={onFeatureClick}
            clusterByProperty={mapGrouping}
          />
        </Box>
      )}
    </Stack>
  );
};
