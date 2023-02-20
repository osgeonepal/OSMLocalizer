import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { MAPBOX_ACCESS_TOKEN } from '../../config';

// const osm_style = {
//     version: 8,
//     sources: {
//         osm: {
//             type: 'raster',
//             tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
//             tileSize: 256,
//             attribution: ('Map tiles by <a target="_top" rel="noopener" href="https://tile.openstreetmap.org/">OpenStreetMap tile servers</a>,' +
//                 'under the <a target="_top" rel="noopener" href="https://operations.osmfoundation.org/policies/tiles/">tile usage policy</a>.' +
//                 'Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>')
//         }
//     },
//     layers: [{
//         id: 'osm',
//         type: 'raster',
//         source: 'osm',
//     }],
// }

const Map = (props) => {
    const mapContainerRef = useRef(null);
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    useEffect(() => {
        mapContainerRef.current = new mapboxgl.Map({
            container: 'map-container',
            style: "mapbox://styles/mapbox/streets-v12",
            center: [props.element.lon, props.element.lat],
            zoom: 19,
        });
        return () => mapContainerRef.current.remove();
    }
        , [props.element]);
    // Add marker on the mapContainerRef
    useEffect(() => {
        // Remove marker if it already exists
        if (mapContainerRef.current.getLayer('marker')) {
            mapContainerRef.current.removeLayer('marker');
            mapContainerRef.current.removeSource('marker');
        }
        new mapboxgl.Marker()
            .setLngLat([props.element.lon, props.element.lat])
            .addTo(mapContainerRef.current);
    }, [props.element]);
    return (
        <div>
            <div
                id="map-container"
                className='map-container'
                style={{ height: "35vh", width: "100%" }}
            />

        </div>
    );
};
export default Map;
