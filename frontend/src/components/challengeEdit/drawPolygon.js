import React, { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import bbox from "@turf/bbox";

import "maplibre-gl/dist/maplibre-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

import { OSM_STYLE } from "../../utills/mapStyle";

export const DrawPolygon = (props) => {
  const mapContainerRef = useRef(null);
  useEffect(() => {
    mapContainerRef.current = new maplibregl.Map({
      container: "map-container",
      style: OSM_STYLE,
      center: [85.324, 27.7172],
      zoom: 3,
    });
    var draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: "draw_polygon",
    });
    mapContainerRef.current.addControl(draw);
    return () => mapContainerRef.current && mapContainerRef.current.remove();
  }, []);

  useEffect(() => {
    mapContainerRef.current.on("draw.create", updateArea);
    mapContainerRef.current.on("draw.delete", updateArea);
    mapContainerRef.current.on("draw.update", updateArea);

    function updateArea(e) {
      var data = e.features[0].geometry;
      props.onChange(bbox(data));
    }
  }, [props]);

  return (
    <div>
      <p className="form-label fw-bold text-secondary">Bounding Box</p>
      <div
        id="map-container"
        className="map-container"
        style={{ height: "40vh", width: "100%" }}
      ></div>
    </div>
  );
};
