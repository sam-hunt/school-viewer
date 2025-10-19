import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MapCard } from './MapCard';
import { mockSchool } from '../../../../test/mockData';

// Mock the MapboxGLPointMap component
vi.mock('./MapboxglPointMap', () => ({
  MapboxGLPointMap: ({ lat, lng, zoom, width, height }: any) => (
    <div data-testid="mapbox-point-map" data-lat={lat} data-lng={lng} data-zoom={zoom} data-width={width} data-height={height}>
      Map
    </div>
  ),
}));

// Mock the useWindowSize hook
vi.mock('../../../hooks/useWindowSize/useWindowSize', () => ({
  useWindowSize: () => ({ width: 1024, height: 768 }),
}));

describe('MapCard', () => {
  it('should render map container', () => {
    render(<MapCard school={mockSchool} />);

    const container = screen.getByTestId('mapbox-point-map').parentElement;
    expect(container).toBeInTheDocument();
  });

  it('should render MapboxGLPointMap component', () => {
    render(<MapCard school={mockSchool} />);

    expect(screen.getByTestId('mapbox-point-map')).toBeInTheDocument();
  });

  it('should pass school coordinates to map', () => {
    render(<MapCard school={mockSchool} />);

    const map = screen.getByTestId('mapbox-point-map');
    expect(map).toHaveAttribute('data-lat', mockSchool.latitude.toString());
    expect(map).toHaveAttribute('data-lng', mockSchool.longitude.toString());
  });

  it('should pass zoom level to map', () => {
    render(<MapCard school={mockSchool} />);

    const map = screen.getByTestId('mapbox-point-map');
    expect(map).toHaveAttribute('data-zoom', '6.5');
  });

  it('should set container min and max height', () => {
    const { container } = render(<MapCard school={mockSchool} />);

    const boxElement = container.querySelector('.MuiBox-root');
    expect(boxElement).toBeInTheDocument();
  });

  it('should handle different school coordinates', () => {
    const schoolWithDifferentCoords = {
      ...mockSchool,
      latitude: -36.8485,
      longitude: 174.7633,
    };

    render(<MapCard school={schoolWithDifferentCoords} />);

    const map = screen.getByTestId('mapbox-point-map');
    expect(map).toHaveAttribute('data-lat', '-36.8485');
    expect(map).toHaveAttribute('data-lng', '174.7633');
  });
});
