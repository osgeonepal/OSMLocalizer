import bbox from "@turf/bbox";
import React, { useState } from "react";
import popularTags from "../../assets/json/popular_tags.json";

const ElementButtons = ({ onChange }) => {
  const [selectedTag, setSelectedTag] = useState();
  const [customTag, setCustomTag] = useState();
  const [subTag, setSubTag] = useState();

  const onCustomTagChange = (e) => {
    setCustomTag(e.target.value);
  };

  const onTagClick = (tag) => {
    setSubTag("");
    setSelectedTag(tag);
  };

  const generateQuery = (type, tag, sub_tag) => {
    setSubTag(sub_tag);
    if (sub_tag === "*") {
      return `(${type}["${tag}"]({{bbox}}););out;`;
    }
    return `(${type}["${tag}"="${sub_tag}"]({{bbox}}););out;`;
  };

  // const excludeFromQuery = (type, tag, exclude_subtag) => {
  //     if (subTag === "*") {
  //         return `(${type}[${tag}][!~"${exclude_subtag}"]({{bbox}}););out;`
  //     }
  //     return `(${type}[${tag}=${subTag}][!~"${exclude_subtag}"]({{bbox}}););out;`
  // }

  return (
    <div>
      {selectedTag ? (
        // Display subtags for selected tag if any tag is selected
        <div>
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
                onChange({
                  target: {
                    name: "overpass_query",
                    value: generateQuery(
                      popularTags[selectedTag]["type"],
                      selectedTag,
                      sub_tag
                    ),
                  },
                });
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
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Custom tag"
              aria-label="Custom tag"
              aria-describedby="button-addon2"
              value={customTag}
              onChange={onCustomTagChange}
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
              onClick={() => {
                onChange({
                  target: {
                    name: "overpass_query",
                    value: generateQuery("node", customTag, "*"),
                  },
                });
              }}
            >
              Generate
            </button>
          </div>
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
      )}
    </div>
  );
};

export const OverpassQuery = ({ challenge, setChallenge, step, setStep }) => {
  const [src, setSrc] = useState("https://overpass-turbo.eu/map.html");
  const [isTested, setIsTested] = useState(false);

  const onChange = (e) => {
    setIsTested(false);
    setChallenge({
      ...challenge,
      [e.target.name]: e.target.value,
    });
  };

  const onNext = () => {
    setStep(step + 1);
  };

  const onBack = () => {
    setStep(step - 1);
  };

  const onTest = () => {
    const bbox = challenge.bbox;
    // Replace {{bbox}} with bbox and set bbox to lng, lat form lat, lng to test query on overpass turbo
    const new_bbox = bbox[1] + "," + bbox[0] + "," + bbox[3] + "," + bbox[2];
    const bboxQuery = challenge.overpass_query.replace("{{bbox}}", new_bbox);
    setSrc(
      "https://overpass-turbo.eu/map.html?Q=" + encodeURIComponent(bboxQuery)
    );
    setIsTested(true);
  };

  const onClick = () => {
    isTested ? onNext() : onTest();
  };

  return (
    <div>
      <div
        className="modal modal-xl fade show"
        style={{
          display: "block",
          backgroundColor: "transparent",
          zIndex: "9999",
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Overpass query generator</h1>
            </div>
            <div className="modal-body">
              <div className="row" style={{ height: "70vh" }}>
                <div className="col-5">
                  <div>
                    <p className="text-dark" style={{ fontSize: "0.9rem" }}>
                      Select elements to be included in the challenge. You can
                      use the pre-defined tags or add your own.
                    </p>
                  </div>
                  <ElementButtons onChange={onChange} />
                  <label className="form-label fw-bold text-dark">
                    Overpass query
                  </label>
                  <textarea
                    className="form-control rounded-0"
                    name="overpass_query"
                    type="text"
                    placeholder="Overpass query"
                    value={challenge.overpass_query}
                    onChange={(e) => onChange(e)}
                    rows="3"
                    disabled={true}
                  />
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
                    className="btn btn-primary"
                    onClick={() => {
                        onClick();
                    }}
                >
                    {isTested ? "Next" : "Test"}
                </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

// const QueryGenerator = ({setShowQueryGenerator, bbox, onChange, overpassQuery}) => {
//     const [src, setSrc] = useState("https://overpass-turbo.eu/map.html")

//     const onGenerateQuery = () => {
//         // Replace {{bbox}} with bbox and set bbox to lng, lat form lat, lng
//         const new_bbox = bbox[1] + "," + bbox[0] + "," + bbox[3] + "," + bbox[2]
//         const bboxQuery = overpassQuery.replace("{{bbox}}", new_bbox)
//         setSrc("https://overpass-turbo.eu/map.html?Q=" + encodeURIComponent(bboxQuery))
//     }

//     return (
//     <div>
//         <div
//         className="modal modal-xl fade show"
//         style={{ display: "block", backgroundColor: "transparent", zIndex: "9999" }}
//         >
//       <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h1 className="modal-title fs-5">Overpass query generator</h1>
//           </div>
//           <div className="modal-body">
//             <div className="row" style={{height: "70vh"}}>
//                 <div className="col-5">
//                     <div>
//                     <p className="text-dark" style={{ fontSize: "0.9rem" }}>
//                         Select elements to be included in the challenge. You can use the
//                         pre-defined tags or add your own.
//                     </p>
//                     </div>
//                     <ElementButtons onChange={onChange}/>
//                     <label className="form-label fw-bold text-dark">Overpass query</label>
//                     <textarea
//                         className="form-control rounded-0"
//                         name="overpass_query"
//                         type="text"
//                         placeholder="Overpass query"
//                         defaultValue={overpassQuery}
//                         onChange={(e) => onChange(e)}
//                         rows="3"
//                         disabled={true}
//                     />
//                 </div>
//                 <div className="col-7">
//                     <iframe
//                         title="Overpass query generator"
//                         width="100%"
//                         height="100%"
//                         src={src}
//                     ></iframe>
//                 </div>
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button
//               className="btn btn-secondary"
//               onClick={() => { setShowQueryGenerator(false) }}
//             >
//               Close
//             </button>
//             <button
//               className="btn btn-primary"
//               onClick = {onGenerateQuery}
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//     <div className="modal-backdrop fade show"></div>
//   </div>)
// }

// export default QueryGenerator;
