import { Box } from '@mui/material';
import { MapboxGLPointMap } from '../../../components/MapboxglPointMap';
import { useWindowSize } from '../../../hooks/use-window-size';
import { School } from '../../../models/school.interface';
import { useMemo, useState } from 'react';

interface MapCardProps {
  school: School;
}

export const MapCard = ({ school }: MapCardProps) => {
  const [mapContainerEl, setMapContainerEl] = useState<HTMLDivElement>();
  const size = useWindowSize();

  const [width, height] = useMemo(() => {
    if (!size) return [0, 0];
    const parentWidth = mapContainerEl?.clientWidth || 0;
    const parentHeight = mapContainerEl?.clientHeight || 0;
    return [parentWidth, parentHeight];
  }, [mapContainerEl?.clientWidth, mapContainerEl?.clientHeight, size]);

  return (
    <Box ref={(el: any) => setMapContainerEl(el)} sx={{ minHeight: '450px', maxHeight: '600px' }}>
      <MapboxGLPointMap width={width} height={height} lat={school!.latitude} lng={school!.longitude} zoom={6.5} />
    </Box>
  );
};
