import { CSSProperties, useCallback, useRef, useState } from 'react';
import { Feature, FeatureCollection, Point } from 'geojson';
import Map, { Layer, NavigationControl, Source } from 'react-map-gl/maplibre';
import type { MapRef, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import type { GeoJSONSource } from 'maplibre-gl';
import { useTheme } from '@mui/material';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapboxGLClusteredMapProps<T extends object = object> {
  lng: number;
  lat: number;
  zoom: number;
  height: CSSProperties['height'];
  width: CSSProperties['width'];
  features: FeatureCollection;
  onFeatureClick?: (feature: Feature<Point, T>) => void;
  clusterByProperty: keyof T & string;
}

export const MapboxGLClusteredMap = <T extends object = object>({
  lat,
  lng,
  zoom,
  width,
  height,
  features,
  onFeatureClick,
  clusterByProperty,
}: MapboxGLClusteredMapProps<T>) => {
  const mapRef = useRef<MapRef>(null);
  const theme = useTheme();
  const mapTilerKey = import.meta.env.VITE_MAPTILER_KEY as string;
  const mapStyleName = theme.palette.mode === 'dark' ? 'streets-v2-dark' : 'streets-v2-light';
  const mapStyle = `https://api.maptiler.com/maps/${mapStyleName}/style.json?key=${mapTilerKey}`;

  // Track cursor state for grab/grabbing/pointer
  const [cursor, setCursor] = useState<string>('grab');
  const [isDragging, setIsDragging] = useState(false);

  // Calculate circle size steps based on total of clustering property
  const total = features.features.reduce((acc, f) => {
    const props = f.properties;
    if (!props) return acc;
    const value = props[clusterByProperty] as unknown;
    return acc + (typeof value === 'number' ? value : 0);
  }, 0);
  const c = Math.log(total) - 7;
  const clusterCircleSizeSteps = [10, 20 * c, 15, 50 * c, 25, 125 * c, 30, 250 * c, 35, 500 * c, 40, 750 * c, 45, 1500 * c, 50] as const;

  const handleMouseEnter = useCallback(() => {
    setCursor('pointer');
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCursor(isDragging ? 'grabbing' : 'grab');
  }, [isDragging]);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
    setCursor('grabbing');
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setCursor('grab');
  }, []);

  const handleMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      if (!feature) return;

      const mapInstance = mapRef.current;
      if (!mapInstance) return;

      // Handle cluster click
      if (feature.properties.cluster_id !== undefined) {
        const clusterId = feature.properties.cluster_id as number;
        const source = mapInstance.getSource('schools');

        if (!source) return;

        (source as GeoJSONSource)
          .getClusterExpansionZoom(clusterId)
          .then((zoom: number) => {
            if (feature.geometry.type !== 'Point') return;

            mapInstance.easeTo({
              center: feature.geometry.coordinates as [number, number],
              zoom,
              duration: 500,
            });
          })
          .catch(() => {
            // Silently fail if cluster expansion fails
          });
      }
      // Handle unclustered point click
      else if (onFeatureClick) {
        onFeatureClick(feature as unknown as Feature<Point, T>);
      }
    },
    [onFeatureClick],
  );

  return (
    <div style={{ height, width }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        interactiveLayerIds={['clusters', 'unclustered-point']}
        onClick={handleMapClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        cursor={cursor}
      >
        <NavigationControl position="top-right" />

        <Source
          id="schools"
          type="geojson"
          data={features}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
          clusterProperties={
            {
              [clusterByProperty]: ['+', ['get', clusterByProperty]],
            } as Record<string, [string, unknown[]]>
          }
        >
          {/* Clustered circles */}
          <Layer
            id="clusters"
            type="circle"
            filter={['has', 'point_count']}
            paint={{
              'circle-color': '#CB9EFF',
              'circle-radius': ['step', ['get', clusterByProperty], ...clusterCircleSizeSteps],
            }}
          />

          {/* Cluster count labels */}
          <Layer
            id="cluster-count"
            type="symbol"
            filter={['has', 'point_count']}
            layout={{
              'text-field': `{${clusterByProperty}}`,
              'text-font': ['Noto Sans Regular'],
              'text-size': 14,
            }}
          />

          {/* Unclustered points */}
          <Layer
            id="unclustered-point"
            type="circle"
            filter={['!', ['has', 'point_count']]}
            paint={{
              'circle-color': '#CB9EFF',
              'circle-radius': ['step', ['get', clusterByProperty], ...clusterCircleSizeSteps],
              'circle-stroke-width': 1,
              'circle-stroke-color': '#fff',
            }}
          />

          {/* Unclustered point labels */}
          <Layer
            id="unclustered-count"
            type="symbol"
            filter={['!', ['has', 'point_count']]}
            layout={{
              'text-field': `{${clusterByProperty}}`,
              'text-font': ['Noto Sans Regular'],
              'text-size': 14,
            }}
          />
        </Source>
      </Map>
    </div>
  );
};
