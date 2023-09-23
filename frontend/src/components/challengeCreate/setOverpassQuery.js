import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import { fetchLocalJSONAPI } from "../../utills/fetch";
import { MAX_FEATURE_COUNT } from "../../config";
import popularTags from "../../assets/json/popular_tags.json";

const ElementButtons = ({ setOverpassQuery, overpass_query }) => {
  const [selectedTag, setSelectedTag] = useState();
  const [customTag, setCustomTag] = useState();
  const [customTagError, setCustomTagError] = useState(false);
  const [subTag, setSubTag] = useState();
  const [elementType, setElementType] = useState("node");

  useEffect(() => {
    overpass_query && generateQuery(subTag);
    // eslint-disable-next-line
  }, [elementType, overpass_query, subTag]);

  const onCustomTagChange = (e) => {
    // Validate custom tag is in key=value or key format using regex
    const regex = /^([a-z0-9_]+)(=[a-z0-9_]+)?$/;
    const value = e.target.value;
    if (value === "" || regex.test(value)) {
      setCustomTagError(false);
      setCustomTag(e.target.value);
    } else {
      setCustomTagError(true);
    }
  };

  const onTagClick = (tag) => {
    setSubTag("");
    setSelectedTag(tag);
  };

  const generateQuery = (sub_tag) => {
    let query = "";
    // const type = popularTags[selectedTag]["type"];
    setSubTag(sub_tag);

    if (elementType === "node") {
      sub_tag === "*"
        ? (query = `(${elementType}[${selectedTag}]({{bbox}}););out;`)
        : (query = `(${elementType}[${selectedTag}=${sub_tag}]({{bbox}}););out;`);
    } else {
      sub_tag === "*"
        ? (query = `(${elementType}[${selectedTag}]({{bbox}});>;);out;`)
        : (query = `(${elementType}[${selectedTag}=${sub_tag}]({{bbox}});>;);out;`);
    }
    setOverpassQuery(query);
  };

  const generateCustomQuery = () => {
    let query = "";
    const [tag, sub_tag] = customTag.split("=");
    if (elementType === "node") {
      sub_tag
        ? (query = `(${elementType}[${tag}=${sub_tag}]({{bbox}}););out;`)
        : (query = `(${elementType}[${tag}]({{bbox}}););out;`);
    } else {
      sub_tag
        ? (query = `(${elementType}[${tag}=${sub_tag}]({{bbox}});>;);out;`)
        : (query = `(${elementType}[${tag}]({{bbox}});>;);out;`);
    }
    setOverpassQuery(query);
  };

  const onElementTypeChange = (e) => {
    console.log(overpass_query);
    setElementType(e.value);
  };

  const tagOptions = Object.keys(popularTags).map((tag) => {
    return { value: tag, label: tag };
  });

  const subTagOptions = selectedTag
    ? popularTags[selectedTag]["values"].map((sub_tag) => {
      return { value: sub_tag, label: sub_tag };
    })
    : [];

  return (
    <div>
      <p className="fw-bold text-dark mb-1">
        Select a tag in key=value format:
      </p>
      <div className="row d-flex align-items-center mb-4">
        <div className="col-5">
          <Select
            className="fs-6"
            options={tagOptions}
            placeholder="Select a key"
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            onChange={(e) => onTagClick(e.value)}
            isClearable={true}
            value={{ value: selectedTag, label: selectedTag }}
            isSearchable={true}
          />
        </div>
        <div className="col-1 fw-bold">=</div>
        <div className="col-5">
          <Select
            className="fs-6"
            options={subTagOptions}
            placeholder="Select a value"
            onChange={(e) => generateQuery(e.value)}
            value={subTag ? { value: subTag, label: subTag } : null}
            isDisabled={!selectedTag}
          />
        </div>
      </div>
      <div>
        <div className="mb-4 mt-3">
          <p className="fw-bold text-dark mb-1">Or add your custom tag here:</p>
          <div className="d-flex align-items-center">
            <input
              className={`btn btn-sm mb-2 bg-white text-dark rounded-end-0 ${customTagError ? "btn-outline-danger" : "btn-outline-primary"
                }`}
              type="text"
              placeholder="Add tag in key=value format"
              onChange={onCustomTagChange}
              // Also generate query on enter
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  !customTagError
                    ? generateCustomQuery()
                    : console.log("Invalid custom tag");
                }
              }}
            />
            <button
              className="btn btn-sm btn-secondary me-2 mb-2 rounded-start-0"
              onClick={() => {
                !customTagError
                  ? generateCustomQuery()
                  : console.log("Invalid custom tag");
              }}
            >
              Add
              {/* <i className="ms-2 fa fa-plus"></i> */}
            </button>
            <div data-tooltip-id="tooltip">
              <i className="fa fa-question-circle ms-1 fs-5 text-muted"></i>
              <Tooltip
                id="tooltip"
                place="top"
                className="bg-secondary text-white"
              >
                <p className="mb-0">
                  Add a tag in key=value format or just key to include all the
                  values of the tag.
                </p>
                <p className="mb-0">
                  For example, amenity=restaurant or just amenity to include all
                  the amenities.
                </p>
              </Tooltip>
            </div>
          </div>
          <div className="col-4 mt-3">
            <p className="mb-0 fw-bold">Select element type:</p>
            <Select
              className="fs-6"
              options={[
                { value: "node", label: "Node" },
                { value: "way", label: "Way" },
                { value: "relation", label: "Relation" },
              ]}
              placeholder="Select element type"
              onChange={(e) => onElementTypeChange(e)}
              value={{ value: elementType, label: elementType }}
              isClearable={false}
              isSearchable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const OverpassQuery = ({ challenge, setChallenge, step, setStep }) => {
  const [src, setSrc] = useState("https://overpass-turbo.eu/map.html");
  const [isTested, setIsTested] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [featureCount, setFeatureCount] = useState(0);

  const setOverpassQuery = (query) => {
    setChallenge({
      ...challenge,
      overpass_query: query,
    });
    setIsTested(false);
  };

  const onNext = () => {
    isTested
      ? setStep(step + 1)
      : alert("Please run the query before proceeding to the next step");
  };

  const onBack = () => {
    setStep(step - 1);
  };

  const onTest = () => {
    setIsTestLoading(true);
    const bbox = challenge.bbox;
    // Replace {{bbox}} with bbox and set bbox to lng, lat form lat, lng to test query on overpass turbo
    const new_bbox = bbox[1] + "," + bbox[0] + "," + bbox[3] + "," + bbox[2];
    const bboxQuery = challenge.overpass_query.replace("{{bbox}}", new_bbox);

    // Set src of iframe to run query on overpass turbo
    setSrc(
      "https://overpass-turbo.eu/map.html?Q=" + encodeURIComponent(bboxQuery)
    );

    // Check if feature count is less than 1000
    fetchLocalJSONAPI(
      "challenge/get-feature-count-query/?overpassQuery=" + bboxQuery
    ).then((res) => {
      setFeatureCount(res.count);
      setIsTested(true);
      setIsTestLoading(false);
    });
  };

  return (
    <div>
      <div className="modal modal-xl fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <p className="modal-title fs-5 title text-dark fw-semibold">
                {" "}
                Step 2: Select tags to localize
              </p>
            </div>
            <div className="modal-body">
              <div className="row" style={{ height: "70vh" }}>
                <div className="col-5">
                  <div className="mb-2">
                    <p className="text-dark" style={{ fontSize: "0.9rem" }}>
                      Select tags you want to localize in this challenge. You
                      can use the pre-defined tags or add your own.
                    </p>
                  </div>
                  <ElementButtons
                    setOverpassQuery={setOverpassQuery}
                    overpass_query={challenge.overpass_query}
                  />
                  <div className="mt-4">
                    <label className="form-label fw-bold text-dark">
                      Overpass query
                    </label>
                    <textarea
                      className="form-control rounded-0"
                      name="overpass_query"
                      type="text"
                      placeholder="Overpass query"
                      value={challenge.overpass_query}
                      onChange={(e) => setOverpassQuery(e.target.value)}
                      rows="3"
                      disabled={true}
                    />
                  </div>
                  <div>
                    <button className="btn btn-primary mt-3" onClick={onTest}>
                      <i className="me-2 fa fa-play"></i>
                      Run query
                    </button>
                    {isTested && (
                      <div className="mt-3">
                        <div className="d-flex flex-auto">
                          <span className="mb-0 fw-bold">Total Features:</span>
                          <span className="mb-0">{featureCount}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-7">
                  <iframe
                    title="Overpass query generator"
                    width="100%"
                    height="100%"
                    src={src}
                  ></iframe>
                </div>
              </div>
            </div>
            <div className="modal-footer d-flex align-items-center justify-content-between">
              <div>
                {featureCount > MAX_FEATURE_COUNT && (
                  <div className="text-white bg-danger text-center p-1">
                    <i className="fa fa-exclamation-triangle me-2"></i>
                    <span>
                      Feature count is greater than {MAX_FEATURE_COUNT}.
                      Please refine your query or reduce the area.
                    </span>
                  </div>
                )}
              </div>
              <div>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    onBack();
                  }}
                >
                  Back
                </button>
                <button
                  className={`btn btn-primary ms-2`}
                  disabled={isTestLoading || featureCount > MAX_FEATURE_COUNT}
                  onClick={() => {
                    onNext();
                  }}
                >
                  Next
                  {isTestLoading && (
                    <span
                      className="spinner-border spinner-border-sm ms-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};
