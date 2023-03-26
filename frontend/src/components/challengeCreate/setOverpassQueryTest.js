// import React, { useState } from "react";
// import QueryGenerator from "./setOverpassQuery";

// import popularTags from "../../assets/json/popular_tags.json";
// export const OverpassQuery = ({ challenge, setChallenge, setp, setStep}) => {

//     const [showQueryGenerator, setShowQueryGenerator] = useState(false);

//     // const onQueryTest = () => {
//     //   console.log("Query test");
//     // };

//     return (
//       <div className="mt-4">
//         {/* <div>
//             <label className="form-label fw-bold text-dark">Overpass query</label>
//             <textarea
//             className="form-control rounded-0"
//             name="overpass_query"
//             type="text"
//             placeholder="Overpass query"
//             defaultValue={overpassQuery}
//             onChange={(e) => onChange(e)}
//             rows="3"
//             disabled={true}
//             />
//         </div> */}
//         <div className="text-body fst-italic mt-3">
//           {/* <div>
//             {showQueryGenerator && bbox && ( */}
//               <QueryGenerator
//                 bbox={bbox}
//                 setShowQueryGenerator={setShowQueryGenerator}
//                 onChange={onChange}
//                 overpassQuery={overpassQuery}
//               />
//               {/* )} */}
//               {/* <button
//                 className={`btn ${bbox ? "btn-primary" : "btn-secondary disabled"}`}
//                 disabled={!bbox}
//                 onClick={() => { setShowQueryGenerator(!showQueryGenerator) }}
//               >
//                 Use query generator
//                 <i className="fa fa-arrow-right ms-2" style={{ fontSize: "0.6rem" }}></i>
//               </button> */}
//           </div>
//           {/* <button
//             className="btn btn-sm btn-secondary d-block mb-2"
//             onClick={onQueryTest}
//             disabled={true}
//           >
//             Test query
//           </button> */}
//           {/* <span className="">
//             Please use {`{{bbox}}`} inplace of bounding box value. The bbox will
//             be replaced with the bounding box of the challenge area. For example,
//             to select all schools in the challenge area, use the following query:{" "}
//             <br />
//             <code>(node[amenity=school]({"{{bbox}}"}));out</code>
//           </span> */}
//         </div>
//     //   </div>
//     );
//   };
