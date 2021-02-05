import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Feature, FeatureCollection, Point } from 'geojson';

interface IMapboxGLMapProps<T = any> {
    lng: number;
    lat: number;
    zoom: number;
    height: CSSProperties['height'];
    width: CSSProperties['width'];
};

const MapboxGLPointMap: React.FC<IMapboxGLMapProps> = ({ lat, lng, zoom, width, height }) => {

    const mapContainer = useRef(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [marker, setMarker ] = useState<mapboxgl.Marker | null>(null);

    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY as string;
        const initializeMap = ({ setMap, mapContainer }: any) => {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
                center: [lng, lat],
                zoom,
            });
            map.on('load', () => {
                setMap(map);
                map.resize();
                addMarker(map);
            });
            // Disable panning and scroll zoom
            map.dragPan.disable();
            map.keyboard.disable();
            map.scrollZoom.disable();
            map.touchZoomRotate.disable();
            map.doubleClickZoom.disable();
            const nav = new mapboxgl.NavigationControl();
            map.addControl(nav, 'top-right');

        };

        const addMarker = (map: mapboxgl.Map) => {
            const marker = new mapboxgl.Marker()
                .setLngLat([lng, lat])
                .addTo(map);
            setMarker(marker);
        };
        if (map && marker) {
            marker.remove();
            addMarker(map);
        }

        if (!map) {
            initializeMap({ setMap, mapContainer });
        }
    }, [map, lat, lng, zoom]);

    return <div className="mapboxgl-container" ref={el => ((mapContainer as any).current = el)} style={{ height, width }} />;
};

export default MapboxGLPointMap;
