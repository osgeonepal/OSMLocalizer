import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import popularTags from "../../assets/json/popular_tags.json";

const ElementButtons = ({ setOverpassQuery }) => {
  const [selectedTag, setSelectedTag] = useState();
  const [customTag, setCustomTag] = useState();
  const [customTagError, setCustomTagError] = useState(false);
  const [subTag, setSubTag] = useState();

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
    const type = popularTags[selectedTag]["type"];

    setSubTag(sub_tag);

    if (type === "node") {
      sub_tag === "*"
        ? (query = `(${type}[${selectedTag}]({{bbox}}););out;`)
        : (query = `(${type}[${selectedTag}=${sub_tag}]({{bbox}}););out;`);
    } else {
      sub_tag === "*"
        ? (query = `(${type}[${selectedTag}]({{bbox}});>;);out;`)
        : (query = `(${type}[${selectedTag}=${sub_tag}]({{bbox}});>;);out;`);
    }
    setOverpassQuery(query);
  };

  const generateCustomQuery = () => {
    let query = "";
    const type = "node";
    const [tag, sub_tag] = customTag.split("=");
    if (sub_tag) {
      query = `(${type}[${tag}=${sub_tag}]({{bbox}}););out;`;
    } else {
      query = `(${type}[${tag}]({{bbox}});>;);out;`;
    }
    setOverpassQuery(query);
  };

  // const excludeFromQuery = (type, tag, exclude_subtag) => {
  //     if (subTag === "*") {
  //         return `(${type}[${tag}][!~"${exclude_subtag}"]({{bbox}}););out;`
  //     }
  //     return `(${type}[${tag}=${subTag}][!~"${exclude_subtag}"]({{bbox}}););out;`
  // }

  return (
    <div>
      <p className="fw-bold text-dark mb-1">Predefined tags</p>
      {selectedTag ? (
        // Display subtags for selected tag if any tag is selected
        <div className="mb-4">
          <div>
            <button
              className="btn btn-sm btn-primary me-2 mb-2"
              onClick={() => {
                setSelectedTag(null);
              }}
            >
              <i
                className="fa fa-arrow-left me-2"
                style={{ fontSize: "0.6rem" }}
              ></i>
              {selectedTag}
            </button>
          </div>
          {popularTags[selectedTag]["values"].map((sub_tag) => (
            <button
              key={sub_tag}
              className={
                `btn btn-sm me-2 mb-2 ` +
                (sub_tag === subTag ? "btn-success" : "btn-outline-success")
              }
              onClick={() => {
                generateQuery(sub_tag);
              }}
            >
              {sub_tag}
            </button>
          ))}
          {/* <div className="mt-3">
                        <button className="btn btn-sm btn-outline-danger me-2 mb-2" onClick={() => {
                            onChange({
                                target: {
                                    name: "overpass_query",
                                    value: excludeFromQuery(popularTags[selectedTag]["type"], selectedTag, ".*")
                                }
                            })
                        }}>
                            Exclude all
                        </button>
                        <button className="btn btn-sm btn-outline-danger me-2 mb-2" onClick={() => {
                            onChange({
                                target: {
                                    name: "overpass_query",
                                    value: excludeFromQuery(popularTags[selectedTag]["type"], selectedTag, ".*_name")
                                }
                            })
                        }}>
                            Exclude names
                        </button>
                        <button className="btn btn-sm btn-outline-danger me-2 mb-2" onClick={() => {
                            onChange({
                                target: {
                                    name: "overpass_query",
                                    value: excludeFromQuery(popularTags[selectedTag]["type"], selectedTag, ".*_ref")

                                }
                            })
                        }}>
                            Exclude refs
                        </button>
                    </div> */}
        </div>
      ) : (
        <div>
          <div className="mb-2">
            {Object.keys(popularTags).map((tag) => (
              <button
                key={tag}
                className="btn btn-sm btn-outline-primary me-2 mb-2"
                onClick={() => {
                  onTagClick(tag);
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="mb-4 mt-3">
            <p className="fw-bold text-dark mb-1">Add custom tag here</p>
            <div className="d-flex align-items-center">
              <input
                className={`btn btn-sm mb-2 bg-white text-dark rounded-end-0 ${
                  customTagError ? "btn-outline-danger" : "btn-outline-primary"
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
                className="btn btn-sm btn-primary me-2 mb-2 rounded-start-0"
                onClick={() => {
                  !customTagError
                    ? generateCustomQuery()
                    : console.log("Invalid custom tag");
                }}
              >
                <i className="fa fa-plus"></i>
              </button>
              <div data-tooltip-id="tooltip">
                <i className="fa fa-question-circle ms-1 fs-5 text-muted"></i>
                <Tooltip id="tooltip" place="top" className="bg-info text-dark">
                  <p className="mb-0">
                    Add a tag in key=value format or just key to include all the
                    values of the tag.
                  </p>
                  <p className="mb-0">
                    For example, amenity=restaurant or just amenity to include
                    all the amenities.
                  </p>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const OverpassQuery = ({ challenge, setChallenge, step, setStep }) => {
  const [src, setSrc] = useState("https://overpass-turbo.eu/map.html");
  const [isTested, setIsTested] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);

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
      : alert("Please test the query before proceeding to the next step");
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
    setSrc(
      "https://overpass-turbo.eu/map.html?Q=" + encodeURIComponent(bboxQuery)
    );
    // Add some delay to set isTested to true so that the iframe is loaded
    setTimeout(() => {
      setIsTested(true);
      setIsTestLoading(false);
    }, 5000); // 5 seconds
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
                  <ElementButtons setOverpassQuery={setOverpassQuery} />
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
                      Test query
                    </button>
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
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  onBack();
                }}
              >
                Back
              </button>
              <button
                className={`btn btn-primary`}
                disabled={isTestLoading}
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
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};
