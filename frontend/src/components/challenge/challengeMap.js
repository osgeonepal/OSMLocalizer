import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import bbox from "@turf/bbox";

import "maplibre-gl/dist/maplibre-gl.css";

import { OSM_STYLE } from "../../utills/mapStyle";
import { fetchLocalJSONAPI } from "../../utills/fetch";
import marker from "../../assets/icons/marker.png";

let markerIcon = new Image(40, 40);
markerIcon.src = marker;

export const ChallengeMap = (props) => {
  const [features, setFeatures] = useState({});
  const [isFeaturesLoaded, setIsFeaturesLoaded] = useState(false);
  useEffect(() => {
    fetchLocalJSONAPI(`challenge/${props.challenge.id}/features/`).then(
      (data) => {
        setFeatures(data);
        setIsFeaturesLoaded(true);
      }
    );
  }, [props.challenge.id]);

  const mapContainerRef = useRef(null);
  useEffect(() => {
    mapContainerRef.current = new maplibregl.Map({
      container: "map-container",
      style: OSM_STYLE,
      center: [85.324, 27.7172],
      zoom: 3,
    }).addControl(new maplibregl.NavigationControl(), "top-right");
    return () => mapContainerRef.current && mapContainerRef.current.remove();
  }, [props.challenge.id]);

  useEffect(() => {
    mapContainerRef.current.on("load", function () {
      if (mapContainerRef.current.getLayer("challenge-polygon")) {
        mapContainerRef.current.removeLayer("challenge-polygon");
        mapContainerRef.current.removeSource("challenge-polygon");
        mapContainerRef.current.removeImage("mapMarker");
      }
      mapContainerRef.current.addImage("mapMarker", markerIcon, {
        width: 25,
        height: 25,
        data: markerIcon,
      });
      mapContainerRef.current.addLayer({
        id: "challenge-polygon",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: props.challenge.bbox,
          },
        },
        layout: {},
        paint: {
          "line-color": "#088",
          "line-width": 2,
          "line-dasharray": [2, 1],
        },
      });
      props.challenge &&
        mapContainerRef.current.fitBounds(bbox(props.challenge.bbox), {
          padding: 80,
          animate: false,
        });
    });
  }, [props.challenge]);

  // Add challenge features to map
  useEffect(() => {
    isFeaturesLoaded &&
      mapContainerRef.current.on("load", function () {
        if (mapContainerRef.current.getLayer("clusters")) {
          mapContainerRef.current.removeLayer("clusters");
          mapContainerRef.current.removeLayer("cluster-count");
          mapContainerRef.current.removeLayer("unclustered-point");
          mapContainerRef.current.removeSource("features");
        }
        mapContainerRef.current.addSource("features", {
          type: "geojson",
          data: features,
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
        });
        // Add cluster layer with features
        mapContainerRef.current.addLayer({
          id: "clusters",
          type: "circle",
          source: "features",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6",
              100,
              "#f1f075",
              750,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        });
        // Add cluster layer with features
        mapContainerRef.current.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "features",
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });
        mapContainerRef.current.addLayer({
          id: "unclustered-point",
          type: "symbol",
          source: "features",
          filter: ["!", ["has", "point_count"]],
          layout: {
            "icon-image": "mapMarker",
            "text-field": "#{id}",
            "text-offset": [0, 0.6],
            "text-anchor": "top",
          },
          paint: {
            "text-color": "#2c3038",
            "text-halo-width": 1,
            "text-halo-color": "#fff",
          },
        });
      });
  }, [features, isFeaturesLoaded]);

  return (
    <div
      id="map-container"
      className="map-container"
      style={{ height: props.height || "35vh", width: "100%" }}
    />
  );
};
