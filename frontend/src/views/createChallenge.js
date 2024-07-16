import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import maplibregl from "maplibre-gl";
import bbox from "@turf/bbox";
import Area from "@turf/area";
import { Tooltip } from "react-tooltip";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";

import "react-tooltip/dist/react-tooltip.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";


import { pushToLocalJSONAPI } from "../utills/fetch";
import SetChallengeBBBOX from "../components/challengeCreate/setChallengeBBOX";
import { MetadataForm } from "../components/challengeCreate/setChallengeMetdata";
import { TranslationForm } from "../components/challengeCreate/setChallengeTranslate";
import { OverpassQuery } from "../components/challengeCreate/setOverpassQuery";
import { LoadingModal } from "../components/loadingModal";
import { MAX_CHALLENGE_AREA } from "../config";
import { OSM_STYLE } from "../utills/mapStyle";
import { geocoderApi } from "../utills/geoCodeApi";

const StepButtons = ({
  step,
  setStep,
  onCreate,
  isNextDisabled,
  isLoading,
  bboxArea,
}) => {
  const disabledReason = () => {
    if (step === 1) {
      const errorMsg =
        bboxArea > MAX_CHALLENGE_AREA
          ? "Area is too large"
          : "Please draw a bounding box";
      return errorMsg;
    } else if (step === 2) {
      return "Please enter a valid overpass query";
    } else if (step === 3) {
      return "Please fill in all required fields marked with *";
    } else if (step === 4) {
      return "Please fill in all required fields marked with *";
    }
  };

  const onNext = () => {
    if (step < 4) {
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
      {step < 4 && (
        <div data-tooltip-id="tooltip" data-tooltip-content={disabledReason()}>
          <button
            disabled={isNextDisabled()}
            className="btn btn-primary rounded-0 me-4"
            onClick={() => onNext()}
          >
            Next
            <i className="fa fa-arrow-right ms-2"></i>
          </button>
        </div>
      )}
      {step === 4 && (
        <button
          className="btn btn-primary rounded-0 me-4"
          disabled={isLoading}
          onClick={() => onCreate()}
        >
          Create
          {isLoading ? (
            <i className="fa fa-spinner fa-spin ms-2"></i>
          ) : (
            <i className="fa fa-arrow-right ms-2"></i>
          )}
        </button>
      )}
      {isNextDisabled() && (
        <Tooltip
          place="top-right"
          className="bg-secondary"
          effect="solid"
          id="tooltip"
        />
      )}
    </div>
  );
};

const HandleSteps = ({
  step,
  setStep,
  addDrawHandler,
  removeDrawHandler,
  challenge,
  setChallenge,
  isLoaded,
}) => {
  switch (step) {
    case 1:
      return (
        <SetChallengeBBBOX
          addDrawHandler={addDrawHandler}
          removeDrawHandler={removeDrawHandler}
          challenge={challenge}
          setChallenge={setChallenge}
          isLoaded={isLoaded}
        />
      );
    case 2:
      return (
        <OverpassQuery
          challenge={challenge}
          setChallenge={setChallenge}
          step={step}
          setStep={setStep}
        />
      );
    case 3:
      return (
        <div>
          <p className="fs-5 title text-dark fw-semibold">
            Step 3: Set Challenge Metadata
          </p>
          <MetadataForm challenge={challenge} setChallenge={setChallenge} />
        </div>
      );
    case 4:
      return (
        <div>
          <p className="fs-5 title text-dark fw-semibold">
            Step 4: Set Challenge Translation Settings
          </p>
          <TranslationForm challenge={challenge} setChallenge={setChallenge} />
        </div>
      );
    default:
      return (
        <SetChallengeBBBOX
          addDrawHandler={addDrawHandler}
          removeDrawHandler={removeDrawHandler}
          challenge={challenge}
          setChallenge={setChallenge}
        />
      );
  }
};

const CreateChallenge = () => {
  const jwt_token = useSelector((state) => state.auth.jwtToken);

  const mapContainer = useRef(null);
  const [mapObject, setMapObject] = useState({
    map: null,
    draw: new MapboxDraw({
      displayControlsDefault: false,
    }),
  });
  const [challenge, setChallenge] = useState({ status: "PUBLISHED" });
  const [isLoading, setIsLoading] = useState(false);
  const [isChallengeCreated, setIsChallengeCreated] = useState(false);
  const [error, setError] = useState(null);

  const [bboxArea, setBboxArea] = useState(null);
  const [step, setStep] = useState(1);
  const [validationResult, setValidationResult] = useState({
    isValid: false,
    error: null,
  });


  useEffect(() => {
    const newMap = new maplibregl.Map({
      container: mapContainer.current,
      style: OSM_STYLE,
      center: [0, 0],
      zoom: 2,
    })
      .addControl(
        new MaplibreGeocoder(geocoderApi, {
          maplibregl: maplibregl
        }),
        "top-right"
      )
      .addControl(new maplibregl.NavigationControl(), "top-right");

    newMap.on("load", () => {
      setMapObject({
        draw: mapObject.draw,
        map: newMap,
      });
    });
  }, [mapObject.draw]);

  const updateBBBOX = (polygon) => {
    // Calculate area in square kilometers
    const bboxPolygon = bbox(polygon);
    const areaPolygon = Math.floor(Area(polygon) / 1000000);
    setBboxArea(areaPolygon);
    setChallenge({ ...challenge, bbox: bboxPolygon });
  };

  useLayoutEffect(() => {
    if (mapObject.map && mapObject.map.isStyleLoaded()) {
      mapObject.map.addControl(mapObject.draw);

      mapObject.map.on("draw.create", onDrawUpdate);
      mapObject.map.on("draw.update", onDrawUpdate);
      mapObject.map.on("draw.delete", onDrawUpdate);
    }
    function onDrawUpdate() {
      const data = mapObject.draw.getAll();
      if (data.features.length > 0) {
        const polygon = data.features[0];
        updateBBBOX(polygon);
      }
    }

    return () => {
      if (mapObject.map) {
        mapObject.map.off("draw.create", onDrawUpdate);
        mapObject.map.off("draw.update", onDrawUpdate);
        mapObject.map.off("draw.delete", onDrawUpdate);
      }
    };
    // eslint-disable-next-line
  }, [mapObject]);

  const addDrawHandler = () => {
    mapObject.draw.changeMode("draw_polygon");
  };

  const removeDrawHandler = () => {
    mapObject.draw.deleteAll();
    setChallenge({ ...challenge, bbox: null });
    setBboxArea(null);
  };

  const isNextDisabled = () => {
    if (step === 1) {
      return !challenge.bbox || bboxArea > MAX_CHALLENGE_AREA;
    }
    if (step === 2) {
      return !challenge.overpass_query;
    }
    if (step === 3) {
      return (
        !challenge.name ||
        !challenge.description ||
        !challenge.status ||
        !challenge.language_tags
      );
    }
    if (step === 4) {
      return !challenge.to_language;
    }
    return false;
  };

  const onCreate = () => {
    validateChallenge();
    if (validationResult.isValid) {
      setIsLoading(true);
      pushToLocalJSONAPI("challenge/", JSON.stringify(challenge), jwt_token)
        .then((response) => {
          if (response.success === true) {
            setIsChallengeCreated(true);
          }
        })
        .catch((error) => {
          setError("Error creating challenge");
        });
    }
  };

  const validateChallenge = () => {
    const requiredFields = [
      "name",
      "description",
      "feature_instructions",
      "status",
      "bbox",
      "overpass_query",
      "language_tags",
      "to_language",
    ];
    const missingFields = [];
    requiredFields.forEach((field) => {
      if (!challenge[field]) {
        missingFields.push(field);
      }
    });
    if (missingFields.length > 0) {
      setValidationResult({
        isValid: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
      return;
    }
    if (
      challenge.translate_engine &&
      challenge.translate_engine !== " " &&
      !challenge.api_key
    ) {
      setValidationResult({
        isValid: false,
        error: "Must provide an API key if using a translation engine",
      });
      return;
    }
    challenge.language_tags
      .split(",")
      .map((tag) => tag.trim())
      .forEach((element) => {
        if (!element.startsWith("name")) {
          setValidationResult({
            isValid: false,
            error: "Language tags must start with 'name'",
          });
          return;
        } else {
          setValidationResult({
            isValid: true,
            error: null,
          });
        }
      });
    return;
  };

  return (
    <div>
      <div
        ref={mapContainer}
        className="mapContainer"
        style={{ height: "90vh", width: "100%" }}
      >
        <div
          className="position-absolute top-0 start-0 d-flex flex-column justify-content-between overflow-auto"
          style={{
            zIndex: 999,
            height: "90vh",
            width: "500px",
            background: "rgba(234, 234, 234, 0.9)",
          }}
        >
          <div className="p-4">
            <HandleSteps
              step={step}
              setStep={setStep}
              addDrawHandler={addDrawHandler}
              removeDrawHandler={removeDrawHandler}
              challenge={challenge}
              setChallenge={setChallenge}
              isLoaded={mapObject.map && mapObject.map.isStyleLoaded()}
            />
          </div>
          <div>
            {!validationResult.error ? null : (
              <div className="alert alert-danger fw-bold ps-2 pe-2">
                {validationResult.error}
              </div>
            )}
            <StepButtons
              step={step}
              setStep={setStep}
              onCreate={onCreate}
              isNextDisabled={isNextDisabled}
              isLoading={isLoading}
              bboxArea={bboxArea}
            />
          </div>
          {isLoading && (
            <LoadingModal
              loadingMessage="Creating challenge... This may take a few minutes."
              successMessage="Challenge created successfully!"
              isSuccess={isChallengeCreated}
              error={error}
              setIsLoading={setIsLoading}
            />
          )}
        </div>
        <div>
          {bboxArea && (
            <div
              className="position-absolute bottom-0 end-0 p-4"
              style={{ zIndex: 999 }}
            >
              <span
                className={
                  bboxArea > MAX_CHALLENGE_AREA
                    ? "bg-danger p-2 fw-semibold"
                    : "bg-white p-2 fw-semibold"
                }
              >
                Area: {bboxArea} ㎢
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateChallenge;
