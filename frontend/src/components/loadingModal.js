import { useNavigate } from "react-router-dom";

export const LoadingModal = ({ isSuccess, loadingMessage, successMessage }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "transparent" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              {isSuccess ? (
                <i className="fa fa-check fa-2x text-success"></i>
              ) : (
                <i className="fa fa-spinner fa-pulse fa-2x"></i>
              )}
              <span className="ms-3 fs-6">
                {isSuccess ? successMessage : loadingMessage}
              </span>
              <div className="d-flex mt-4 justify-content-end">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/challenges")}
                  isDisabled={!isSuccess}
                >
                  Go to Challenges
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};
