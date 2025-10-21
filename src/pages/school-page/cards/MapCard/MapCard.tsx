import { Box } from '@mui/material';
import { MapboxGLPointMap } from './MapboxglPointMap';
import { School } from '../../../../models/School';
import { useMemo, useState } from 'react';

// NOTE: Mapbox-related type suppressions are temporary and will be removed
// when we migrate to react-map-gl (which has better type support).

interface MapCardProps {
  school: School;
}

export const MapCard = ({ school }: MapCardProps) => {
  const [mapContainerEl, setMapContainerEl] = useState<HTMLDivElement>();

  const [width, height] = useMemo(() => {
    const parentWidth = mapContainerEl?.clientWidth ?? 0;
    const parentHeight = mapContainerEl?.clientHeight ?? 0;
    return [parentWidth, parentHeight];
  }, [mapContainerEl?.clientWidth, mapContainerEl?.clientHeight]);

  return (
    <Box ref={(el: HTMLDivElement) => setMapContainerEl(el)} sx={{ minHeight: '450px', maxHeight: '600px' }}>
      <MapboxGLPointMap
        width={width}
        height={height}
        lat={school.latitude}
        lng={school.longitude}
        zoom={6.5}
        ariaLabel={`Map showing the location of ${school.orgName}`}
      />
    </Box>
  );
};
