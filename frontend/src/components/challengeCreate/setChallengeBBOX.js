import React from "react";

export const OverpassQuery = ({ defaultValue, onChange }) => {
  const onQueryTest = () => {
    console.log("Query test");
  };

  return (
    <div className="mt-4">
      <label className="form-label fw-bold text-dark">Overpass query</label>
      <textarea
        className="form-control rounded-0"
        name="overpass_query"
        type="text"
        placeholder="Overpass query"
        defaultValue={defaultValue}
        onChange={(e) => onChange(e)}
        rows="3"
      />
      <div className="text-body fst-italic mt-3">
        <button
          className="btn btn-sm btn-secondary d-block mb-2"
          onClick={onQueryTest}
          disabled={true}
        >
          Test query
        </button>
        <span className="">
          Please use {`{{bbox}}`} inplace of bounding box value. The bbox will
          be replaced with the bounding box of the challenge area. For example,
          to select all schools in the challenge area, use the following query:{" "}
          <br />
          <code>(node[amenity=school]({"{{bbox}}"}));out</code>
        </span>
      </div>
    </div>
  );
};

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
      <OverpassQuery
        defaultValue={challenge.overpass_query}
        onChange={onChange}
      />
    </div>
  );
};

export default SetChallengeBBBOX;
