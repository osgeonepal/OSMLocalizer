import React from "react";

const CompletionBar = (props) => {
  // const isDisabled = (props.isUploading || Object.keys(props.allChanges).length === 0) ? true : false;
  return (
    <div className="">
      <div className=" p-2">
        <div className="fs-4 fw-bold text-secondary">Instructions</div>
        <div className="text-secondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae
          nisl vitae nisl aliquet aliquam. Sed vitae nisl vitae nisl aliquet
          aliquam. Sed vitae nisl vitae nisl aliquet aliquam. Sed vitae nisl
          vitae nisl aliquet aliquam. Sed vitae
        </div>
      </div>
      <div className="p-2 mt-4">
        <div className="fs-4 fw-bold text-secondary">Completion</div>
        <div className="mt-2">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => props.onSkip()}
          >
            Skip
          </button>
          <button
            className="btn btn-primary btn-sm ms-2"
            type="submit"
            // disabled={pristine}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionBar;
