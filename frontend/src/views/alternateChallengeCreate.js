import React, { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";

import SetChallengeBBBOX from "../components/challengeCreate/setChallengeBBOX";
import { MAPBOX_ACCESS_TOKEN } from "../config";

const AlternateChallengeCreate = () => {
  const mapContainer = useRef(null);
  const [draw, setDraw] = useState(null);
  const [map, setMap] = useState(null);
  const [draftChallenge, setDraftChallenge] = useState({});

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 2,
    }).addControl(new mapboxgl.NavigationControl(), "top-right");
    newMap.on("load", () => {
      setMap(newMap);
    });
  }, []);

  useEffect(() => {
    if (map) {
      const draw = new MapboxDraw({
        displayControlsDefault: false,
      });
      map.addControl(draw);
      setDraw(draw);
    }
  }, [map]);

  const addDrawHandler = () => {
    draw.changeMode("draw_polygon");
  };

  const removeDrawHandler = () => {
    draw.deleteAll();
  };

  return (
    <div>
      <div
        ref={mapContainer}
        className="mapContainer"
        style={{ height: "90vh", width: "100%" }}
      >
        <div
          className="position-absolute top-0 start-0"
          style={{
            zIndex: 999,
            height: "800px",
            width: "500px",
            background: "rgba(234, 234, 234, 0.9)",
          }}
        >
          <SetChallengeBBBOX
            draftChallenge={draftChallenge}
            setDraftChallenge={setDraftChallenge}
            addDrawHandler={addDrawHandler}
            removeDrawHandler={removeDrawHandler}
          />
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary rounded-0 me-4">
              Next
              <i className="fa fa-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternateChallengeCreate;
