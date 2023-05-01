import { useNavigate } from "react-router-dom";

export const LoadingModal = ({
  isSuccess,
  loadingMessage,
  successMessage,
  error,
  setIsLoading,
}) => {
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
              {isSuccess && (
                <div>
                  <i className="fa fa-check fa-2x text-success"></i>
                  <span className="ms-3 fs-6">{successMessage}</span>
                </div>
              )}
              {error && (
                <div>
                  <i className="fa fa-times fa-2x text-danger"></i>
                  <span className="ms-3 fs-6 text-danger">{error}</span>
                </div>
              )}
              {!isSuccess && !error && (
                <div>
                  <i className="fa fa-spinner fa-pulse fa-2x"></i>
                  <span className="ms-3 fs-6">{loadingMessage}</span>
                </div>
              )}

              <div className="d-flex mt-4 justify-content-end">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/challenges")}
                  disabled={!isSuccess || error}
                >
                  Go to Challenges
                </button>
                {error && (
                  <button
                    className="btn btn-secondary ms-2"
                    onClick={() => setIsLoading(false)}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};
