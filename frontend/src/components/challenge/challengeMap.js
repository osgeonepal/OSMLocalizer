import React, { useRef, useEffect, useState } from "react";
import mapboxGl from "mapbox-gl";
import bbox from "@turf/bbox";

import { MAPBOX_ACCESS_TOKEN } from "../../config";
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


  const mapContainerRef = useRef(null);
  mapboxGl.accessToken = MAPBOX_ACCESS_TOKEN;
  useEffect(() => {
    mapContainerRef.current = new mapboxGl.Map({
      container: "map-container",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [85.324, 27.7172],
      zoom: 3,
    }).addControl(new mapboxGl.NavigationControl(), "top-right");
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
      style={{ height: "35vh", width: "100%" }}
    />
  );
};
