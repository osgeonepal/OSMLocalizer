import { useState } from "react";
import { useDropzone } from "react-dropzone";

const SetChallengeBBBOX = ({
  addDrawHandler,
  removeDrawHandler,
  onGeojsonUpload,
  bboxArea,
  isLoaded,
}) => {
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: onGeojsonUpload,
    noClick: true,
    noKeyboard: true,
  });

  const [isDrawing, setIsDrawing] = useState(false);

  const onDrawClick = () => {
    // If drawing is already enabled, disable it. Otherwise, enable it.
    if (isDrawing) {
      removeDrawHandler();
    } else {
      addDrawHandler();
    }
    setIsDrawing(!isDrawing);
  };

  const onResetClick = () => {
    setIsDrawing(false);
    removeDrawHandler();
  };

  return (
    <div {...getRootProps()}>
      <div>
        <p className="fs-5 title text-dark fw-semibold">
          {" "}
          Step 1: Select Challenge Area
        </p>
      </div>
      <div>
        <p className="text-dark" style={{ fontSize: "0.9rem" }}>
          Draw area on the map to select the challenge area. A bounding box will
          be calculated from the area you draw.
        </p>
      </div>
      <div className="row">
        <div className="d-flex">
          <button
            className={`btn ${
              !bboxArea && isDrawing ? "btn-primary" : "btn-outline-primary"
            } me-2`}
            onClick={onDrawClick}
            disabled={!isLoaded}
          >
            <i className="bi bi-pencil me-2"></i>
            <span>Draw</span>
          </button>

          <button className="btn btn-secondary" onClick={open}>
            <i className="bi bi-cloud-arrow-up me-2"></i>
            <span>Upload</span>
          </button>
        </div>
        <input {...getInputProps()} />

        {bboxArea && (
          <div>
            <div className="d-flex mt-4">
              <button className="btn btn-outline-danger" onClick={onResetClick}>
                <i className="bi bi-x-lg me-2"></i>
                <span>Reset</span>
              </button>
            </div>
            <div
              className="alert alert-warning d-flex align-items-center mt-3"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <span>
                Bounding box of the area will be used instead of actual geometry
                for the challenge.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetChallengeBBBOX;
