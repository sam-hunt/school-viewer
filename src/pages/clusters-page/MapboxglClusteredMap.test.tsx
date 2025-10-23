/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MapboxGLClusteredMap } from './MapboxglClusteredMap';
import { FeatureCollection } from 'geojson';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock react-map-gl components
vi.mock('react-map-gl/maplibre', () => ({
  default: vi.fn(({ children, ...props }) => (
    <div data-testid="mock-map" data-map-props={JSON.stringify(props)}>
      {children}
    </div>
  )),
  Source: vi.fn(({ children, ...props }) => (
    <div data-testid="mock-source" data-source-props={JSON.stringify(props)}>
      {children}
    </div>
  )),
  Layer: vi.fn((props) => <div data-testid="mock-layer" data-layer-props={JSON.stringify(props)} />),
  NavigationControl: vi.fn((props) => <div data-testid="mock-nav-control" data-nav-props={JSON.stringify(props)} />),
}));

// Mock maplibre-gl CSS import
vi.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));

// Mock environment variable
vi.stubGlobal('import.meta', {
  env: {
    VITE_MAPTILER_KEY: 'test-maptiler-key',
  },
});

const mockFeatures: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [174.76, -36.86],
      },
      properties: {
        schoolId: '1',
        name: 'Auckland Grammar School',
        count: 1,
        total: 500,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [174.77, -41.28],
      },
      properties: {
        schoolId: '2',
        name: 'Wellington High School',
        count: 1,
        total: 400,
      },
    },
  ],
};

describe('MapboxGLClusteredMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render map component', () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        features={mockFeatures}
        clusterByProperty="count"
      />,
    );

    const map = screen.getByTestId('mock-map');
    expect(map).toBeInTheDocument();
  });

  it('should render Map component with correct initial view state', () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        features={mockFeatures}
        clusterByProperty="count"
      />,
    );

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    expect(mapProps.initialViewState).toEqual({
      longitude: 174.7762,
      latitude: -41.2865,
      zoom: 5,
    });
  });

  it('should use MapTiler style URL with correct JSON format', () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        features={mockFeatures}
        clusterByProperty="count"
      />,
    );

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    // Verify MapTiler URL has proper style.json endpoint (not just the style name)
    // This ensures we get JSON response, not HTML
    expect(mapProps.mapStyle).toContain('/style.json?key=');
    // Should use either light or dark theme depending on the current theme
    expect(mapProps.mapStyle).toMatch(/^https:\/\/api\.maptiler\.com\/maps\/dataviz-(dark|light)\/style\.json\?key=.+$/);
  });

  it('should render navigation control', () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        features={mockFeatures}
        clusterByProperty="count"
      />,
    );

    const navControl = screen.getByTestId('mock-nav-control');
    expect(navControl).toBeInTheDocument();

    const navProps = JSON.parse(navControl.getAttribute('data-nav-props') || '{}');
    expect(navProps.position).toBe('top-right');
  });

  it('should render Source component with clustering configuration', () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        features={mockFeatures}
        clusterByProperty="count"
      />,
    );

    const source = screen.getByTestId('mock-source');
    const sourceProps = JSON.parse(source.getAttribute('data-source-props') || '{}');

    expect(sourceProps.id).toBe('schools');
    expect(sourceProps.type).toBe('geojson');
    expect(sourceProps.cluster).toBe(true);
    expect(sourceProps.clusterMaxZoom).toBe(14);
    expect(sourceProps.clusterRadius).toBe(50);
  });

  it('should configure clustering by specified property', () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        features={mockFeatures}
        clusterByProperty="total"
      />,
    );

    const source = screen.getByTestId('mock-source');
    const sourceProps = JSON.parse(source.getAttribute('data-source-props') || '{}');

    expect(sourceProps.clusterProperties).toEqual({
      total: ['+', ['get', 'total']],
    });
  });

  it('should render four map layers (clusters, cluster-count, unclustered-point, unclustered-count)', () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        features={mockFeatures}
        clusterByProperty="count"
      />,
    );

    const layers = screen.getAllByTestId('mock-layer');
    expect(layers).toHaveLength(4);

    const layerIds = layers.map((layer) => {
      const props = JSON.parse(layer.getAttribute('data-layer-props') || '{}');
      return props.id;
    });

    expect(layerIds).toContain('clusters');
    expect(layerIds).toContain('cluster-count');
    expect(layerIds).toContain('unclustered-point');
    expect(layerIds).toContain('unclustered-count');
  });

  it('should configure cluster circle layers with correct paint properties', () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        features={mockFeatures}
        clusterByProperty="count"
      />,
    );

    const layers = screen.getAllByTestId('mock-layer');
    const clusterLayer = layers.find((layer) => {
      const props = JSON.parse(layer.getAttribute('data-layer-props') || '{}');
      return props.id === 'clusters';
    });

    expect(clusterLayer).toBeDefined();
    const clusterProps = JSON.parse(clusterLayer!.getAttribute('data-layer-props') || '{}');

    expect(clusterProps.type).toBe('circle');
    expect(clusterProps.paint['circle-color']).toBe('#CB9EFF');
  });

  it('should set interactive layer IDs', () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        features={mockFeatures}
        clusterByProperty="count"
      />,
    );

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    expect(mapProps.interactiveLayerIds).toEqual(['clusters', 'unclustered-point']);
  });

  it('should handle empty feature collection', () => {
    const emptyFeatures: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        features={emptyFeatures}
        clusterByProperty="count"
      />,
    );

    const source = screen.getByTestId('mock-source');
    expect(source).toBeInTheDocument();
  });

  it('should accept onFeatureClick callback', () => {
    const onFeatureClick = vi.fn();

    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        features={mockFeatures}
        clusterByProperty="count"
        onFeatureClick={onFeatureClick}
      />,
    );

    const map = screen.getByTestId('mock-map');
    expect(map).toBeInTheDocument();
    // The onClick handler is passed but we can't easily test it with mocked components
  });

  it('should handle different zoom levels', () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={12}
        features={mockFeatures}
        clusterByProperty="count"
      />,
    );

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    expect(mapProps.initialViewState.zoom).toBe(12);
  });

  it('should use dark map style when theme is dark', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });

    render(
      <ThemeProvider theme={darkTheme}>
        <MapboxGLClusteredMap
          lat={-41.2865}
          lng={174.7762}
          zoom={5}
          features={mockFeatures}
          clusterByProperty="count"
        />
      </ThemeProvider>,
    );

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    expect(mapProps.mapStyle).toContain('dataviz-dark');
  });

  it('should use light map style when theme is light', () => {
    const lightTheme = createTheme({ palette: { mode: 'light' } });

    render(
      <ThemeProvider theme={lightTheme}>
        <MapboxGLClusteredMap
          lat={-41.2865}
          lng={174.7762}
          zoom={5}
          features={mockFeatures}
          clusterByProperty="count"
        />
      </ThemeProvider>,
    );

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    expect(mapProps.mapStyle).toContain('dataviz-light');
  });
});
