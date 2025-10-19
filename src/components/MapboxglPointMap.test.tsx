import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MapboxGLPointMap } from './MapboxglPointMap';

// Mock mapbox-gl
const mockMap = {
  on: vi.fn((event: string, callback: () => void) => {
    if (event === 'load') {
      // Immediately invoke load callback for testing
      setTimeout(callback, 0);
    }
  }),
  resize: vi.fn(),
  dragPan: { disable: vi.fn() },
  keyboard: { disable: vi.fn() },
  scrollZoom: { disable: vi.fn() },
  touchZoomRotate: { disable: vi.fn() },
  doubleClickZoom: { disable: vi.fn() },
  addControl: vi.fn(),
};

const mockMarker = {
  setLngLat: vi.fn().mockReturnThis(),
  addTo: vi.fn().mockReturnThis(),
  remove: vi.fn(),
};

vi.mock('mapbox-gl', () => ({
  default: {
    accessToken: '',
    Map: vi.fn(() => mockMap),
    Marker: vi.fn(() => mockMarker),
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

describe('MapboxGLPointMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render map container', () => {
    const { container } = render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} width={500} height={400} />);

    const mapContainer = container.querySelector('.mapboxgl-container');
    expect(mapContainer).toBeInTheDocument();
  });

  it('should set container dimensions from props', () => {
    const { container } = render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} width={600} height={450} />);

    const mapContainer = container.querySelector('.mapboxgl-container');
    expect(mapContainer).toHaveStyle({ width: '600px', height: '450px' });
  });

  it('should initialize map with correct center coordinates', async () => {
    const mapboxgl = await import('mapbox-gl');

    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} width={500} height={400} />);

    // Wait for map initialization
    await waitFor(() => {
      expect(mapboxgl.default.Map).toHaveBeenCalled();
    });

    expect(mapboxgl.default.Map).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [174.7762, -41.2865],
        zoom: 10,
      })
    );
  });

  it('should set mapbox access token', async () => {
    const mapboxgl = await import('mapbox-gl');

    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} width={500} height={400} />);

    await waitFor(() => {
      expect(mapboxgl.default.Map).toHaveBeenCalled();
    });

    // Just verify the token is set (will be real env variable in tests)
    expect(mapboxgl.default.accessToken).toBeTruthy();
  });

  it('should disable map interactions', async () => {
    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} width={500} height={400} />);

    await waitFor(() => {
      expect(mockMap.dragPan.disable).toHaveBeenCalled();
    });

    expect(mockMap.keyboard.disable).toHaveBeenCalled();
    expect(mockMap.scrollZoom.disable).toHaveBeenCalled();
    expect(mockMap.touchZoomRotate.disable).toHaveBeenCalled();
    expect(mockMap.doubleClickZoom.disable).toHaveBeenCalled();
  });

  it('should add navigation control', async () => {
    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} width={500} height={400} />);

    await waitFor(() => {
      expect(mockMap.addControl).toHaveBeenCalled();
    });
  });

  it('should add marker at correct position', async () => {
    const mapboxgl = await import('mapbox-gl');

    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} width={500} height={400} />);

    await waitFor(() => {
      expect(mockMarker.addTo).toHaveBeenCalled();
    });

    expect(mapboxgl.default.Marker).toHaveBeenCalled();
    expect(mockMarker.setLngLat).toHaveBeenCalledWith([174.7762, -41.2865]);
    expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
  });

  it('should handle different coordinate values', async () => {
    render(<MapboxGLPointMap lat={-36.8485} lng={174.7633} zoom={12} width={500} height={400} />);

    await waitFor(() => {
      expect(mockMarker.setLngLat).toHaveBeenCalled();
    });

    expect(mockMarker.setLngLat).toHaveBeenCalledWith([174.7633, -36.8485]);
  });

  it('should use dark map style', async () => {
    const mapboxgl = await import('mapbox-gl');

    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} width={500} height={400} />);

    await waitFor(() => {
      expect(mapboxgl.default.Map).toHaveBeenCalled();
    });

    expect(mapboxgl.default.Map).toHaveBeenCalledWith(
      expect.objectContaining({
        style: 'mapbox://styles/mapbox/dark-v10',
      })
    );
  });
});
