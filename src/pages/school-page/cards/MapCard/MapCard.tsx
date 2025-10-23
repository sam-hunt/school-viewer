import { Box, Card, useTheme } from '@mui/material';
import { MapboxGLPointMap } from './MapboxglPointMap';
import { School } from '../../../../models/School';
import { pointMapBgColorDark, pointMapBgColorLight } from './mapBgColors';

interface MapCardProps {
  school: School;
}

export const MapCard = ({ school }: MapCardProps) => {
  const theme = useTheme();
  const bgcolor = theme.palette.mode === 'dark' ? pointMapBgColorDark : pointMapBgColorLight;

  return (
    <Card>
      <Box sx={{ height: '500px', width: '100%', overflow: 'hidden', borderRadius: 1, bgcolor }}>
        <MapboxGLPointMap
          lat={school.latitude}
          lng={school.longitude}
          zoom={6.5}
          ariaLabel={`Map showing the location of ${school.orgName}`}
        />
      </Box>
    </Card>
  );
};
