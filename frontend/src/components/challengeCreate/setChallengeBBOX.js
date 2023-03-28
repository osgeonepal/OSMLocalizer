const SetChallengeBBBOX = ({ addDrawHandler, removeDrawHandler, isLoaded }) => {
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
      <button
        className="btn btn-outline-primary me-2"
        onClick={addDrawHandler}
        disabled={!isLoaded}
      >
        Draw
      </button>
      <button className="btn btn-outline-secondary" onClick={removeDrawHandler}>
        Reset
      </button>
    </div>
  );
};

export default SetChallengeBBBOX;
