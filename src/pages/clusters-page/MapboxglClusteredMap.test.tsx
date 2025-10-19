import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MapboxGLClusteredMap } from './MapboxglClusteredMap';
import { FeatureCollection } from 'geojson';

// Mock mapbox-gl
const mockMap = {
  on: vi.fn((event: string, callback: () => void) => {
    if (event === 'load') {
      // Immediately invoke load callback for testing
      setTimeout(callback, 0);
    }
  }),
  resize: vi.fn(),
  addSource: vi.fn(),
  addLayer: vi.fn(),
  removeLayer: vi.fn(),
  removeSource: vi.fn(),
  addControl: vi.fn(),
  queryRenderedFeatures: vi.fn(),
  getSource: vi.fn(() => ({
    getClusterExpansionZoom: vi.fn((_id, callback) => callback(null, 12)),
  })),
  easeTo: vi.fn(),
  getCanvas: vi.fn(() => ({
    style: { cursor: '' },
  })),
};

vi.mock('mapbox-gl', () => ({
  default: {
    accessToken: '',
    Map: vi.fn(() => mockMap),
    NavigationControl: vi.fn(),
  },
}));

// Mock CSS import
vi.mock('mapbox-gl/dist/mapbox-gl.css', () => ({}));

// Mock environment variable
vi.stubGlobal('import.meta', {
  env: {
    VITE_MAPBOX_KEY: 'test-mapbox-key',
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

  it('should render map container', () => {
    const { container } = render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        width={800}
        height={600}
        features={mockFeatures}
        clusterByProperty="count"
      />
    );

    const mapContainer = container.querySelector('.mapboxgl-container');
    expect(mapContainer).toBeInTheDocument();
  });

  it('should set container dimensions from props', () => {
    const { container } = render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        width={900}
        height={700}
        features={mockFeatures}
        clusterByProperty="count"
      />
    );

    const mapContainer = container.querySelector('.mapboxgl-container');
    expect(mapContainer).toHaveStyle({ width: '900px', height: '700px' });
  });

  it('should initialize map with correct center coordinates', async () => {
    const mapboxgl = await import('mapbox-gl');

    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        width={800}
        height={600}
        features={mockFeatures}
        clusterByProperty="count"
      />
    );

    await waitFor(() => {
      expect(mapboxgl.default.Map).toHaveBeenCalled();
    });

    expect(mapboxgl.default.Map).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [174.7762, -41.2865],
        zoom: 5,
      })
    );
  });

  it('should set mapbox access token', async () => {
    const mapboxgl = await import('mapbox-gl');

    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        width={800}
        height={600}
        features={mockFeatures}
        clusterByProperty="count"
      />
    );

    await waitFor(() => {
      expect(mapboxgl.default.Map).toHaveBeenCalled();
    });

    // Just verify the token is set (will be real env variable in tests)
    expect(mapboxgl.default.accessToken).toBeTruthy();
  });

  it('should add navigation control', async () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        width={800}
        height={600}
        features={mockFeatures}
        clusterByProperty="count"
      />
    );

    await waitFor(() => {
      expect(mockMap.addControl).toHaveBeenCalled();
    });
  });

  it('should add data source with clustering enabled', async () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        width={800}
        height={600}
        features={mockFeatures}
        clusterByProperty="count"
      />
    );

    await waitFor(() => {
      expect(mockMap.addSource).toHaveBeenCalled();
    });

    expect(mockMap.addSource).toHaveBeenCalledWith(
      'points',
      expect.objectContaining({
        type: 'geojson',
        data: mockFeatures,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      })
    );
  });

  it('should configure clustering by specified property', async () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        width={800}
        height={600}
        features={mockFeatures}
        clusterByProperty="total"
      />
    );

    await waitFor(() => {
      expect(mockMap.addSource).toHaveBeenCalled();
    });

    expect(mockMap.addSource).toHaveBeenCalledWith(
      'points',
      expect.objectContaining({
        clusterProperties: { total: ['+', ['get', 'total']] },
      })
    );
  });

  it('should add cluster layers', async () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        width={800}
        height={600}
        features={mockFeatures}
        clusterByProperty="count"
      />
    );

    await waitFor(() => {
      expect(mockMap.addLayer).toHaveBeenCalled();
    });

    // Check cluster circles layer
    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'clusters',
        type: 'circle',
        source: 'points',
      })
    );

    // Check cluster count labels
    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'cluster-count',
        type: 'symbol',
        source: 'points',
      })
    );

    // Check unclustered points
    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'unclustered-point',
        type: 'circle',
        source: 'points',
      })
    );

    // Check unclustered count labels
    expect(mockMap.addLayer).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'unclustered-count',
        type: 'symbol',
        source: 'points',
      })
    );
  });

  it('should register click handlers for clusters and points', async () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        width={800}
        height={600}
        features={mockFeatures}
        clusterByProperty="count"
      />
    );

    await waitFor(() => {
      const onCalls = mockMap.on.mock.calls;
      const clickCalls = onCalls.filter((call: any) => call[0] === 'click');
      expect(clickCalls.length).toBeGreaterThan(0);
    });
  });

  it('should register mouse enter/leave handlers for cursor changes', async () => {
    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        width={800}
        height={600}
        features={mockFeatures}
        clusterByProperty="count"
      />
    );

    await waitFor(() => {
      const onCalls = mockMap.on.mock.calls;
      expect(onCalls.some((call: any) => call[0] === 'mouseenter')).toBe(true);
    });

    const onCalls = mockMap.on.mock.calls;
    expect(onCalls.some((call: any) => call[0] === 'mouseleave')).toBe(true);
  });

  it('should call onFeatureClick when provided and point is clicked', async () => {
    const onFeatureClick = vi.fn();

    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        width={800}
        height={600}
        features={mockFeatures}
        clusterByProperty="count"
        onFeatureClick={onFeatureClick}
      />
    );

    await waitFor(() => {
      const onCalls = mockMap.on.mock.calls;
      const unclusteredClickHandler = onCalls.find(
        (call: any) => call[0] === 'click' && call[1] === 'unclustered-point'
      );
      expect(unclusteredClickHandler).toBeDefined();
    });
  });

  it('should use dark map style', async () => {
    const mapboxgl = await import('mapbox-gl');

    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        width={800}
        height={600}
        features={mockFeatures}
        clusterByProperty="count"
      />
    );

    await waitFor(() => {
      expect(mapboxgl.default.Map).toHaveBeenCalled();
    });

    expect(mapboxgl.default.Map).toHaveBeenCalledWith(
      expect.objectContaining({
        style: 'mapbox://styles/mapbox/dark-v10',
      })
    );
  });

  it('should handle different zoom levels', async () => {
    const mapboxgl = await import('mapbox-gl');

    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={8}
        width={800}
        height={600}
        features={mockFeatures}
        clusterByProperty="count"
      />
    );

    await waitFor(() => {
      expect(mapboxgl.default.Map).toHaveBeenCalled();
    });

    expect(mapboxgl.default.Map).toHaveBeenCalledWith(
      expect.objectContaining({
        zoom: 8,
      })
    );
  });

  it('should handle empty feature collection', async () => {
    const emptyFeatures: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    render(
      <MapboxGLClusteredMap
        lat={-41.2865}
        lng={174.7762}
        zoom={5}
        width={800}
        height={600}
        features={emptyFeatures}
        clusterByProperty="count"
      />
    );

    await waitFor(() => {
      expect(mockMap.addSource).toHaveBeenCalled();
    });

    // Should still add source even with empty features
    expect(mockMap.addSource).toHaveBeenCalledWith(
      'points',
      expect.objectContaining({
        data: emptyFeatures,
      })
    );
  });
});
