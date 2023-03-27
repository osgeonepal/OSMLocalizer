import React, { useEffect, useRef, useState } from "react";
import bbox from "@turf/bbox";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { MAPBOX_ACCESS_TOKEN } from "../../config";
import { fetchExternalJSONAPI } from "../../utills/fetch";

var osmtogeojson = require("osmtogeojson");

const osm_style = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        'Map tiles by <a target="_top" rel="noopener" href="https://tile.openstreetmap.org/">OpenStreetMap tile servers</a>,' +
        'under the <a target="_top" rel="noopener" href="https://operations.osmfoundation.org/policies/tiles/">tile usage policy</a>.' +
        'Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>',
    },
  },
  layers: [
    {

      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

const Map = (props) => {
  const [geojson, setGeojson] = useState({});
  const mapContainerRef = useRef(null);
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    const zoom = props.element.type === "node" ? 18 : 12;
    mapContainerRef.current = new mapboxgl.Map({
      container: "map-container",
      style: props.element.type === "node" ? osm_style : "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: zoom,
    });
    return () => mapContainerRef.current && mapContainerRef.current.remove();
  }, [props.element.type]);

  useEffect(() => {
    const getFullElement = async () => {
      const data = await fetchExternalJSONAPI(
        `https://api.openstreetmap.org/api/0.6/${props.element.type}/${props.element.id}/full.json`
      );
      setGeojson(osmtogeojson(data));
    };

    if (props.element.type === "way" || props.element.type === "relation") {
      getFullElement();
    }
  }, [props.element]);

  useEffect(() => {
    if (mapContainerRef.current.isStyleLoaded() ){

    if (props.element.type === "node") {
      var marker = new mapboxgl.Marker();
      props.element &&
        marker
          .setLngLat([props.element.lon, props.element.lat])
          .addTo(mapContainerRef.current);
      mapContainerRef.current.jumpTo({
        center: [props.element.lon, props.element.lat],
      });
      return () => marker && marker.remove();
    }

    else if (props.element.type === "way") {

      if( mapContainerRef.current.getSource("geojson")){
        mapContainerRef.current.removeSource("geojson");
        mapContainerRef.current.removeLayer("geojson");
      }
      console.log(geojson);
    geojson.features &&
      mapContainerRef.current.addSource("geojson", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: geojson.features[0].geometry.coordinates,
          },
        }
      });
    mapContainerRef.current.getSource("geojson") &&
      mapContainerRef.current.addLayer({
        id: "geojson",
        type: "line",
        source: "geojson",
        layout: {},
        paint: {
          "line-color": "#9000ff",
          "line-width": 3,
        },
      });
      mapContainerRef.current.fitBounds(
        (geojson.features) && bbox(geojson),
        {
          padding: 80,
          animate: false,
        }
      );
      return () => mapContainerRef.current.removeLayer("geojson") && mapContainerRef.current.removeSource("geojson");
    }
  }
  }, [props.element, geojson]);

  return (
    <div>
      <div
        id="map-container"
        className="map-container"
        style={{ height: "33vh", width: "100%" }}
      />
    </div>
  );
};
export default Map;
