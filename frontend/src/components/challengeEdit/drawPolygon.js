import React, { useRef, useEffect } from "react";
import mapboxGl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import bbox from "@turf/bbox";
// import bboxPolygon from "@turf/bbox-polygon";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";


import { MAPBOX_ACCESS_TOKEN } from "../../config";

export const DrawPolygon = (props)=>{
    // Add a map container and let users draw a polygon in the map and return polygon geojson
    const mapContainerRef = useRef(null);
    mapboxGl.accessToken = MAPBOX_ACCESS_TOKEN;
    useEffect(() => {
        mapContainerRef.current = new mapboxGl.Map({
            container: 'map-container',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [85.3240, 27.7172],
            zoom: 3
        });
        var draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
            },
            defaultMode: 'draw_polygon'
        });
        mapContainerRef.current.addControl(draw);
        return () => mapContainerRef.current && mapContainerRef.current.remove();
    }, []);

    useEffect(() => {
        mapContainerRef.current.on('draw.create', updateArea);
        mapContainerRef.current.on('draw.delete', updateArea);
        mapContainerRef.current.on('draw.update', updateArea);

        function updateArea(e) {
            var data = e.features[0].geometry;
            props.onChange(bbox(data));
        }
    }, [props]);

    // useEffect(() => {
    //     mapContainerRef.current.on('load', function () {
    //     if (props.bbox) {
    //         // Add a new layer to the map with aoi which can change if aoi chnage just update the layer
    //         if (mapContainerRef.current.getLayer('aoi')) {
    //             mapContainerRef.current.removeLayer('aoi');
    //             mapContainerRef.current.removeSource('aoi');
    //         }
    //         mapContainerRef.current.addLayer({
    //             'id': 'aoi',
    //             'type': 'fill',
    //             'source': {
    //                 'type': 'geojson',
    //                 'data': bboxPolygon(props.bbox)
    //             },
    //             'layout': {},
    //             'paint': {
    //                 'fill-color': '#088',
    //                 'fill-opacity': 0.8
    //             }
    //         });
    //         const screenWidth = window.innerWidth;
    //         mapContainerRef.current.fitBounds(props.bbox, { padding: screenWidth / 12, animate: false })
    //     }});
    // }, [props.bbox]);

    return (
        <div>
            < p className="form-label fw-bold text-secondary">Bounding Box</p>
            <div
                id="map-container"
                className='map-container'
                style={{ height: "40vh", width: "100%" }}
            />
        </div>
    );
}
