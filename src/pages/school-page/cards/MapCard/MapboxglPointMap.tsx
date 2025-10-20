import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

// NOTE: Mapbox GL JS has incomplete TypeScript definitions. These suppressions are temporary
// and will be removed when we migrate to react-map-gl (which has better type support).

interface MapboxGLPointMapProps {
  lng: number;
  lat: number;
  zoom: number;
  height: CSSProperties['height'];
  width: CSSProperties['width'];
  ariaLabel?: string;
}

export const MapboxGLPointMap: React.FC<MapboxGLPointMapProps> = ({ lat, lng, zoom, width, height, ariaLabel }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [markerPos, setMarkerPos] = useState<string>('');

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY as string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initializeMap = ({ setMap, mapContainer }: any) => {
      const map = new mapboxgl.Map({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
        center: [lng, lat],
        zoom,
      });
      map.on('load', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        setMap(map);
        map.resize();
        addMarker(map);
      });
      // Disable all interactions - this is a static informational map showing location only
      map.dragPan.disable();
      map.keyboard.disable();
      map.scrollZoom.disable();
      map.touchZoomRotate.disable();
      map.doubleClickZoom.disable();
    };

    const addMarker = (map: mapboxgl.Map) => {
      const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
      setMarker(marker);
      setMarkerPos(`${lat.toString()},${lng.toString()}`);
    };
    if (map && marker && markerPos !== `${lat.toString()},${lng.toString()}`) {
      marker.remove();
      addMarker(map);
    }

    if (!map) {
      initializeMap({ setMap, mapContainer });
    }
  }, [map, lat, lng, zoom, marker, markerPos]);

  return (
    <div
      className="mapboxgl-container"
      ref={mapContainer}
      style={{ height, width }}
      role="img"
      aria-label={ariaLabel ?? `Map showing location at coordinates ${lat.toFixed(4)}, ${lng.toFixed(4)}`}
    />
  );
};
