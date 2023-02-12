import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { MAPBOX_ACCESS_TOKEN } from '../../config';

const Map = (props) => {
    const mapContainerRef = useRef(null);
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    useEffect(() => {
        mapContainerRef.current = new mapboxgl.Map({
            container: 'map-container',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [props.element.lon, props.element.lat],
            zoom: 19
        });
        return () => mapContainerRef.current.remove();
    }
        , [props.element]);
    // Add marker on the mapContainerRef
    useEffect(() => {
        new mapboxgl.Marker()
            .setLngLat([props.element.lon, props.element.lat])
            .addTo(mapContainerRef.current);
    }, [props.element]);
    return (
        <div>
            <div
                id="map-container"
                className='map-container'
                style={{ height: "40vh", width: "100%" }}
            />

        </div>
    );
};
export default Map;
