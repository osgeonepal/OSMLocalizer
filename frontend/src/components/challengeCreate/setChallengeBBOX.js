import React from "react";


const OverpassQuery = (props) => {
  return (
    <div className="pb-4 mt-4">
      <label className="form-label fw-bold text-dark">Overpass query</label>
      <textarea
        className="form-control rounded-0"
        name="overpass_query"
        type="text"
        placeholder="Overpass query"
        defaultValue={props.defaultValue}
        onChange={(e) => props.onChange(e)}
        rows="3"
      />
      <div className="text-body fst-italic mt-3">
        <button
          className="btn btn-sm btn-secondary d-block mb-2"
          onClick={props.onQueryTest}
        >
          Test query
        </button>
        <span className="">
          Please use {`{{bbox}}`} inplace of bounding box value. The bbox will
          be replaced with the bounding box of the challenge area. For example,
          to select all buildings in the challenge area, use the following
          query: <br />
          <code>
            (node["building"]({"{{} bbox }}"});way["building"]({"{{ bbox }}"});
            relation["building"]({"{ bbox }"}););out
          </code>
        </span>
      </div>
    </div>
  );
};



const SetChallengeBBBOX = ({
  addDrawHandler,
  removeDrawHandler,
  challenge,
  onChange
}) => {
  return (
    <div className="h-75 p-4">
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
      <OverpassQuery />
    </div>
  );
};

export default SetChallengeBBBOX;
