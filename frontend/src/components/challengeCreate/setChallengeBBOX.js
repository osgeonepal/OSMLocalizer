import React, { useState } from "react";
// import popularTags from "../../assets/json/popular_tags.json";
// import QueryGenerator from "./setOverpassQuery";

// export const ElementButtons = ({ onChange, bbox }) => {
//   const [selectedTag, setSelectedTag] = useState();
//   const [customTag, setCustomTag] = useState();
//   const [subTag, setSubTag] = useState();
//   const [showQueryGenerator, setShowQueryGenerator] = useState(false);

//   const onCustomTagChange = (e) => {
//     setCustomTag(e.target.value);
//   };

//   const onTagClick = (tag) => {
//     setSubTag("")
//     setSelectedTag(tag);
//   };

//   const generateQuery = (type, tag, sub_tag) => {
//     setSubTag(sub_tag);
//     if (sub_tag === "*") {
//       return `(${type}[${tag}]({{bbox}}));out;`;
//     }
//     return `(${type}[${tag}=${sub_tag}]({{bbox}}));out;`;
//   };

//   const excludeFromQuery = (type, tag, exclude_subtag) => {
//     if (subTag === "*") {
//       return `(${type}[${tag}][!~"${exclude_subtag}"]({{bbox}}));out;`;
//     }
//     return `(${type}[${tag}=${subTag}][!~"${exclude_subtag}"]({{bbox}}));out;`;
//   };

//   return (
//     <div>
//       {selectedTag ? (
//         <div>
//           <div>
//             <button
//               className="btn btn-sm btn-primary me-2 mb-2"
//               onClick={() => {
//                 setSelectedTag(null);
//               }}
//             >
//               <i className="fa fa-arrow-left me-2" style={{ fontSize: "0.6rem" }}></i>
//               {selectedTag}
//             </button>
//           </div>
//           {popularTags[selectedTag]["values"].map((sub_tag) => (
//             <button
//               className={`btn btn-sm me-2 mb-2 ` + (sub_tag === subTag ? "btn-success" : "btn-outline-success")}
//               onClick={() => {
//                 onChange({
//                   target: {
//                     name: "overpass_query",
//                     value: generateQuery(popularTags[selectedTag]["type"], selectedTag, sub_tag),
//                   },
//                 });
//               }}
//             >
//               {`${selectedTag}=${sub_tag}`}
//             </button>
//           ))}
//           {subTag === "*" && (
//           <div>
//             <p>Exclude</p>
//             {popularTags[selectedTag]["values"].map((sub_tag) => (
//               sub_tag !== "*" && (<button
//                 className="btn btn-sm me-2 mb-2 btn-outline-danger"
//                 onClick={() => {
//                   onChange({
//                     target: {
//                       name: "overpass_query",
//                       value: excludeFromQuery(popularTags[selectedTag]['type'], selectedTag, sub_tag),
//                     },
//                   });
//                 }}
//               >
//                 {`${selectedTag}!=${sub_tag}`}
//               </button>)
//             ))}
//           </div>
//           )}
//        </div>

//       ) : (
//         <div>
//           {Object.keys(popularTags).map((tag) => (
//             <button
//               className="btn btn-sm btn-outline-primary me-2 mb-2"
//               onClick={() => onTagClick(tag)}
//             >
//               {tag}
//             </button>
//           ))}
//           <input
//             className="btn btn-sm btn-outline-primary mb-2 bg-white text-dark rounded-end-0"
//             type="text"
//             placeholder="Add tag in key=value format"
//             onChange={onCustomTagChange}
//           />
//           <button
//             className="btn btn-sm btn-primary me-2 mb-2 rounded-start-0"
//             onClick={() => {
//               onChange({
//                 target: {
//                   name: "overpass_query",
//                   value: `(node[${customTag}]({{bbox}}));out;`,
//                 },
//               });
//             }}
//           >
//             <i className="fa fa-plus"></i>
//           </button>
//           <div>
//             {showQueryGenerator && bbox && (
//             <QueryGenerator
//               bbox={bbox}
//               showQueryGenerator={showQueryGenerator}
//               setShowQueryGenerator={setShowQueryGenerator}
//               onChange={onChange}
//               overpassQuery={challenge.overpass_query}
//             /> )}
//              <button
//               className="btn btn-sm btn-outline-primary me-2 mb-2"
//               onClick={() => { setShowQueryGenerator(!showQueryGenerator) }}
//              >
//               Query Generator
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export const OverpassQuery = ({ overpassQuery, onChange, bbox }) => {

//   const [showQueryGenerator, setShowQueryGenerator] = useState(false);

//   // const onQueryTest = () => {
//   //   console.log("Query test");
//   // };

//   return (
//     <div className="mt-4">
//       <p className="text-dark" style={{ fontSize: "0.9rem" }}>
//         Select elements to be included in the challenge. You can use the
//         pre-defined tags or add your own.
//       </p>

//       {/* <div className="d-flex justify-content-between">
//         <ElementButtons onChange={onChange} bbox={bbox} />
//       </div> */}
//       <label className="form-label fw-bold text-dark">Overpass query</label>
//       <textarea
//         className="form-control rounded-0"
//         name="overpass_query"
//         type="text"
//         placeholder="Overpass query"
//         defaultValue={overpassQuery}
//         onChange={(e) => onChange(e)}
//         rows="3"
//         disabled={true}
//       />
//       <div className="text-body fst-italic mt-3">
//         <div>
//           {showQueryGenerator && bbox && (
//             <QueryGenerator
//               bbox={bbox}
//               setShowQueryGenerator={setShowQueryGenerator}
//               onChange={onChange}
//               overpassQuery={overpassQuery}
//             /> )}
//             <button
//               className={`btn ${bbox ? "btn-primary" : "btn-secondary disabled"}`}
//               disabled={!bbox}
//               onClick={() => { setShowQueryGenerator(!showQueryGenerator) }}
//             >
//               Use query generator
//               <i className="fa fa-arrow-right ms-2" style={{ fontSize: "0.6rem" }}></i>
//             </button>
//         </div>
//         {/* <button
//           className="btn btn-sm btn-secondary d-block mb-2"
//           onClick={onQueryTest}
//           disabled={true}
//         >
//           Test query
//         </button> */}
//         {/* <span className="">
//           Please use {`{{bbox}}`} inplace of bounding box value. The bbox will
//           be replaced with the bounding box of the challenge area. For example,
//           to select all schools in the challenge area, use the following query:{" "}
//           <br />
//           <code>(node[amenity=school]({"{{bbox}}"}));out</code>
//         </span> */}
//       </div>
//     </div>
//   );
// };

const SetChallengeBBBOX = ({
  addDrawHandler,
  removeDrawHandler,
  challenge,
  setChallenge,
}) => {
  const onChange = (e) => {
    setChallenge({
      ...challenge,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div>
        <p className="fs-5 title text-dark fw-semibold">
          {" "}
          Step 1: Select Challenge Area
        </p>
      </div>
      <div>
        <p className="text-dark" style={{ fontSize: "0.9rem" }}>
          A bounding box will be calculated from the area you draw.
        </p>
      </div>
      <button className="btn btn-outline-primary me-2" onClick={addDrawHandler}>
        Draw
      </button>
      <button className="btn btn-outline-secondary" onClick={removeDrawHandler}>
        Reset
      </button>
      {/* <OverpassQuery
        overpassQuery={challenge.overpass_query}
        bbox={challenge.bbox}
        onChange={onChange}
      /> */}
    </div>
  );
};

export default SetChallengeBBBOX;
