import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import mapboxgl from "mapbox-gl";
import bbox from "@turf/bbox";
import Area from "@turf/area";

import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl/dist/mapbox-gl.css";

import SetChallengeBBBOX from "../components/challengeCreate/setChallengeBBOX";
import { MetadataForm } from "../components/challengeCreate/setChallengeMetdata";
import { MAPBOX_ACCESS_TOKEN } from "../config";


const StepButtons = ({ step, setStep }) => {

  const onNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const onBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  return (
    <div className="d-flex justify-content-end p-2 pb-4">
      {step > 1 && (
        <button
          className="btn btn-outline-primary rounded-0 me-2"
          onClick={() => onBack()}
        >
          <i className="fa fa-arrow-left me-2"></i>
          Back
        </button>
      )}
      {step < 3 && (
        <button
          className="btn btn-primary rounded-0 me-4"
          onClick={() => onNext()}
        >
          Next
          <i className="fa fa-arrow-right ms-2"></i>
        </button>
      )
      }
      {step === 3 && (
        <button
          className="btn btn-primary rounded-0 me-4"
          onClick={() => console.log("Create")}
        >
          Create
          <i className="fa fa-arrow-right ms-2"></i>
        </button>
      )
      }
    </div>
  );
};


const HandleSteps = ({ step, addDrawHandler, removeDrawHandler, challenge, onChange }) => {
  switch (step) {
    case 1:
      return <SetChallengeBBBOX
        addDrawHandler={addDrawHandler}
        removeDrawHandler={removeDrawHandler}
        challenge={challenge}
        onChange={onChange}
      />;
    case 2:
      return <MetadataForm
        challenge={challenge}
        onChange={onChange}
      />;
    case 3:
      return <div>Review</div>;
    default:
      return <SetChallengeBBBOX
        addDrawHandler={addDrawHandler}
        removeDrawHandler={removeDrawHandler}
        challenge={challenge}
        onChange={onChange}
      />;
  }
};




const AlternateChallengeCreate = () => {
  const mapContainer = useRef(null);
  const [mapObject, setMapObject] = useState({
    map: null,
    draw: new MapboxDraw({
      displayControlsDefault: false
    }),
  });
  const [challenge, setChallenge] = useState({});
  const [bboxArea, setBboxArea] = useState(null);
  const [step, setStep] = useState(1);

  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 2,
    }).addControl(new mapboxgl.NavigationControl(), "top-right");
    newMap.on("load", () => {
      setMapObject({
        ...mapObject,
        map: newMap,
      });
    });
  }, []);

  useLayoutEffect(() => {
    if (mapObject.map) {
      mapObject.map.addControl(mapObject.draw);

      mapObject.map.on("draw.create", onDrawUpdate);
      mapObject.map.on("draw.update", onDrawUpdate);
      mapObject.map.on("draw.delete", onDrawUpdate);
    }
    function onDrawUpdate() {
      const data = mapObject.draw.getAll();
      if (data.features.length > 0) {
        const polygon = data.features[0];
        const bboxPolygon = bbox(polygon);
        // Calculate area in square kilometers
        const areaPolygon = Math.floor(Area(polygon) / 1000000)
        setBboxArea(areaPolygon);
        const bboxString = bboxPolygon.join(", ");
        onChange("bbox", bboxString);
      }
    };

    return () => {
      if (mapObject.map) {
        mapObject.map.off("draw.create", onDrawUpdate);
        mapObject.map.off("draw.update", onDrawUpdate);
        mapObject.map.off("draw.delete", onDrawUpdate);
      }
    };

  }, [mapObject]);

  const addDrawHandler = () => {
    mapObject.draw.changeMode("draw_polygon");
  };

  const removeDrawHandler = () => {
    mapObject.draw.deleteAll();
    onChange("bbox", null);
    setBboxArea(null);
  };

  const onChange = (key, value) => {
    setChallenge({ ...challenge, [key]: value })
  }


  return (
    <div>
      <div
        ref={mapContainer}
        className="mapContainer"
        style={{ height: "90vh", width: "100%" }}
      >
        <div
          className="position-absolute top-0 start-0 d-flex flex-column justify-content-between"
          style={{
            zIndex: 999,
            height: "90vh",
            width: "500px",
            background: "rgba(234, 234, 234, 0.9)",
          }}
        >
          <div>
            <HandleSteps
              step={step}
              addDrawHandler={addDrawHandler}
              removeDrawHandler={removeDrawHandler}
              challenge={challenge}
              onChange={onChange}
            />
          </div>
          <div>
            <StepButtons step={step} setStep={setStep} />
          </div>
        </div>
        <div>
          {
            bboxArea && (
              <div className="position-absolute bottom-0 end-0 p-4" style={{ zIndex: 999 }}>
                <span className="bg-white p-2 fw-semibold">Area: {bboxArea} ㎢</span>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default AlternateChallengeCreate;
