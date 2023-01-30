import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useEffect, useRef } from 'react';


const Map = (props) => {
    const mapContainerRef = useRef(null);
    mapboxgl.accessToken = '';
    useEffect(() => {
        mapContainerRef.current = new mapboxgl.Map({
            container: 'map-container',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [props.element.lon, props.element.lat],
            zoom: 19
        });
        // map.on('move', () => {
        //     setLng(map.getCenter().lng.toFixed(4));
        //     setLat(map.getCenter().lat.toFixed(4));
        //     setZoom(map.getZoom().toFixed(2));
        // });
        return () => mapContainerRef.current.remove();
    }
        , []);
    // Add marker on the mapContainerRef
    useEffect(() => {
        new mapboxgl.Marker()
            .setLngLat([props.element.lon, props.element.lat])
            .addTo(mapContainerRef.current);
    }, []);
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
