import React, { CSSProperties, useEffect, useState } from 'react';
import { Feature, FeatureCollection, Point } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

interface IMapboxGLMapProps<T = any> {
  lng: number;
  lat: number;
  zoom: number;
  height: CSSProperties['height'];
  width: CSSProperties['width'];
  features: FeatureCollection;
  onFeatureClick?: (feature: Feature<Point, T>) => void;
  clusterByProperty: keyof T & string;
}

export const MapboxGLClusteredMap: React.FC<IMapboxGLMapProps> = ({
  lat,
  lng,
  zoom,
  width,
  height,
  features,
  onFeatureClick,
  clusterByProperty,
}) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [mapContainerEl, setMapContainerEl] = useState<HTMLDivElement>();

  useEffect(() => {
    if (!mapContainerEl) return;
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY as string;
    const initializeMap = ({ setMap, mapContainerEl }: any) => {
      const map = new mapboxgl.Map({
        container: mapContainerEl,
        style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
        center: [lng, lat],
        zoom,
      });
      map.on('load', () => {
        setMap(map);
        map.resize();
        initLayers(map);
      });
      // Add nav control
      const nav = new mapboxgl.NavigationControl();
      map.addControl(nav, 'top-right');
    };

    const initLayers = (map: mapboxgl.Map) => {
      if (map && features !== null) {
        map.addSource('points', {
          type: 'geojson',
          data: features,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
          clusterProperties: { [clusterByProperty]: ['+', ['get', clusterByProperty]] },
        });
        const total = features?.features.map((f: any) => f.properties[clusterByProperty as string]).reduce((acc, val) => acc + val, 0);
        const c = Math.log(total) - 7;
        const clusterCircleSizeSteps = [10, 20 * c, 15, 50 * c, 25, 125 * c, 30, 250 * c, 35, 500 * c, 40, 750 * c, 45, 1500 * c, 50];
        // const clusterCircleSizeSteps = [10, 20, 15, 50, 25, 125, 30, 250, 35, 500, 40, 750, 45, 1500, 50];
        map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'points',
          filter: ['has', 'point_count'],
          paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with steps to implement each type of circle:
            //   * 10px circles when point count is less than 25
            //   * 15px circles when point count is between 20 and 50
            //   * 25px circles when point count is between 50 and 250
            //   * 30px circles when point count is between 250 and 500
            //   * 45px circles when point count is greater than or equal to 750
            'circle-color': '#CB9EFF',
            'circle-radius': ['step', ['get', clusterByProperty], ...clusterCircleSizeSteps],
          },
        });
        map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'points',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': `{${clusterByProperty?.toString()}}`,
            'text-font': ['Arial Unicode MS Bold'],
            'text-size': 14,
          },
        });
        map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'points',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#CB9EFF',
            'circle-radius': ['step', ['get', clusterByProperty], ...clusterCircleSizeSteps],
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
          },
        });
        map.addLayer({
          id: 'unclustered-count',
          type: 'symbol',
          source: 'points',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'text-field': `{${clusterByProperty?.toString()}}`,
            'text-font': ['Arial Unicode MS Bold'],
            'text-size': 14,
          },
        });
        // inspect a cluster on click
        map.on('click', 'clusters', function (e) {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters'],
          });
          const clusterId = (features[0] as any).properties.cluster_id;
          (map.getSource('points') as any).getClusterExpansionZoom(clusterId, function (err: any, zoom: number) {
            if (err) return;

            map.easeTo({
              center: (features[0].geometry as any).coordinates,
              zoom: zoom,
            });
          });
        });
        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on('mouseover', 'unclustered-point', function (e) {
          const coordinates = (e as any).features[0].geometry.coordinates.slice();
          const name = (e as any).features[0].properties.name;

          // Ensure that if the map is zoomed out such that
          // multiple copies of the feature are visible, the
          // popup appears over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup().setLngLat(coordinates).setHTML(`<strong><h3>${name}</h3></strong>`).addTo(map);
        });
        if (onFeatureClick) {
          map.on('click', 'unclustered-point', e => {
            onFeatureClick((e as any).features[0]);
          });
        }
        map.on('mouseenter', 'clusters', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', () => {
          map.getCanvas().style.cursor = '';
        });
        map.on('mouseenter', 'unclustered-point', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'unclustered-point', () => {
          map.getCanvas().style.cursor = '';
        });
      }
    };
    if (map) {
      map.removeLayer('clusters');
      map.removeLayer('cluster-count');
      map.removeLayer('unclustered-point');
      map.removeLayer('unclustered-count');
      map.removeSource('points');
      initLayers(map);
    }

    if (!map) {
      initializeMap({ setMap, mapContainerEl });
    }
  }, [map, lat, lng, zoom, features, onFeatureClick, clusterByProperty, mapContainerEl]);

  return (
    <div
      className="mapboxgl-container"
      ref={el => {
        setMapContainerEl(el!);
      }}
      style={{ height, width }}
    />
  );
};
