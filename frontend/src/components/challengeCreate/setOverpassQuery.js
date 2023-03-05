export const OverpassQuery = (props) => {
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
