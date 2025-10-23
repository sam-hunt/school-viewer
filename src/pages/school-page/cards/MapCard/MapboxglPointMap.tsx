import Map, { Marker } from 'react-map-gl/maplibre';
import { useTheme } from '@mui/material';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapboxGLPointMapProps {
  lng: number;
  lat: number;
  zoom: number;
  ariaLabel?: string;
}

export const MapboxGLPointMap: React.FC<MapboxGLPointMapProps> = ({ lat, lng, zoom, ariaLabel }) => {
  const theme = useTheme();
  const mapTilerKey = import.meta.env.VITE_MAPTILER_KEY as string;
  const mapStyleName = theme.palette.mode === 'dark' ? 'streets-v2-dark' : 'streets-v2-light';
  const mapStyle = `https://api.maptiler.com/maps/${mapStyleName}/style.json?key=${mapTilerKey}`;

  return (
    <Map
      initialViewState={{
        longitude: lng,
        latitude: lat,
        zoom,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle={mapStyle}
      interactive={false}
      attributionControl={{ compact: false }}
      aria-label={ariaLabel ?? `Map showing location at coordinates ${lat.toFixed(4)}, ${lng.toFixed(4)}`}
    >
      <Marker longitude={lng} latitude={lat} color="#CB9EFF" />
    </Map>
  );
};
