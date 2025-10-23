/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MapboxGLPointMap } from './MapboxglPointMap';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock react-map-gl components
vi.mock('react-map-gl/maplibre', () => ({
  default: vi.fn(({ children, ...props }) => (
    <div data-testid="mock-map" data-map-props={JSON.stringify(props)}>
      {children}
    </div>
  )),
  Marker: vi.fn((props) => <div data-testid="mock-marker" data-marker-props={JSON.stringify(props)} />),
}));

// Mock maplibre-gl CSS import
vi.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));

// Mock environment variable
vi.stubGlobal('import.meta', {
  env: {
    VITE_MAPTILER_KEY: 'test-maptiler-key',
  },
});

describe('MapboxGLPointMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render map component', () => {
    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} />);

    const map = screen.getByTestId('mock-map');
    expect(map).toBeInTheDocument();
  });

  it('should render Map component with correct initial view state', () => {
    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} />);

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    expect(mapProps.initialViewState).toEqual({
      longitude: 174.7762,
      latitude: -41.2865,
      zoom: 10,
    });
  });

  it('should use MapTiler style URL with correct JSON format', () => {
    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} />);

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    // Verify MapTiler URL has proper style.json endpoint (not just the style name)
    // This ensures we get JSON response, not HTML
    expect(mapProps.mapStyle).toContain('/style.json?key=');
    // Should use either light or dark theme depending on the current theme
    expect(mapProps.mapStyle).toMatch(/^https:\/\/api\.maptiler\.com\/maps\/streets-v2-(dark|light)\/style\.json\?key=.+$/);
  });

  it('should set map as non-interactive (static display)', () => {
    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} />);

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    expect(mapProps.interactive).toBe(false);
  });

  it('should render with accessible aria-label', () => {
    render(
      <MapboxGLPointMap
        lat={-41.2865}
        lng={174.7762}
        zoom={10}
        ariaLabel="Map showing school location"
      />,
    );

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    expect(mapProps['aria-label']).toBe('Map showing school location');
  });

  it('should render with default aria-label when not provided', () => {
    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} />);

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    expect(mapProps['aria-label']).toBe('Map showing location at coordinates -41.2865, 174.7762');
  });

  it('should render Marker at correct position', () => {
    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} />);

    const marker = screen.getByTestId('mock-marker');
    const markerProps = JSON.parse(marker.getAttribute('data-marker-props') || '{}');

    expect(markerProps.longitude).toBe(174.7762);
    expect(markerProps.latitude).toBe(-41.2865);
  });

  it('should render Marker with purple color', () => {
    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} />);

    const marker = screen.getByTestId('mock-marker');
    const markerProps = JSON.parse(marker.getAttribute('data-marker-props') || '{}');

    expect(markerProps.color).toBe('#CB9EFF');
  });

  it('should handle different coordinate values', () => {
    render(<MapboxGLPointMap lat={-36.8485} lng={174.7633} zoom={12} />);

    const marker = screen.getByTestId('mock-marker');
    const markerProps = JSON.parse(marker.getAttribute('data-marker-props') || '{}');

    expect(markerProps.longitude).toBe(174.7633);
    expect(markerProps.latitude).toBe(-36.8485);
  });

  it('should handle different zoom levels', () => {
    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={15} />);

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    expect(mapProps.initialViewState.zoom).toBe(15);
  });

  it('should enable attribution control', () => {
    render(<MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} />);

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    expect(mapProps.attributionControl).toEqual({ compact: false });
  });

  it('should use dark map style when theme is dark', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });

    render(
      <ThemeProvider theme={darkTheme}>
        <MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} />
      </ThemeProvider>,
    );

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    expect(mapProps.mapStyle).toContain('streets-v2-dark');
  });

  it('should use light map style when theme is light', () => {
    const lightTheme = createTheme({ palette: { mode: 'light' } });

    render(
      <ThemeProvider theme={lightTheme}>
        <MapboxGLPointMap lat={-41.2865} lng={174.7762} zoom={10} />
      </ThemeProvider>,
    );

    const map = screen.getByTestId('mock-map');
    const mapProps = JSON.parse(map.getAttribute('data-map-props') || '{}');

    expect(mapProps.mapStyle).toContain('streets-v2-light');
  });
});
