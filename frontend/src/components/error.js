import { useNavigate } from "react-router-dom";
import Login from "./login";

const errorMessages = {
  NO_FEATURES_TO_LOCALIZE: {
    title: "No features to localize",
    message:
      "Congratulations! There are no more features left to localize in this challenge. You can either validate features or check out other challenges.",
  },
  NO_FEATURES_TO_VALIDATE: {
    title: "No features to validate",
    message:
      "There are no features left to validate in this challenge. You can either localize features or check out other challenges.",
  },
  SESSION_EXPIRED: {
    title: "Session expired",
    message: "Your session has expired. Please login again to continue.",
  },
  OTHER: {
    title: "Something went wrong",
    message: "We are sorry, something went wrong. Please try again later.",
  },
  CHALLENGE_NOT_FOUND: {
    title: "Challenge not found",
    message: "We are sorry, the challenge you are looking for does not exist.",
  },
};

const ShowError = ({ error, setError }) => {
  const navigate = useNavigate();
  const { title, message } = errorMessages[error];
  return (
    <div>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "transparent" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">{title}</h1>
            </div>
            <div className="modal-body">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              {error === "SESSION_EXPIRED" ? (
                <Login expired={true} />
              ) : (
                <>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setError(null)}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/challenges")}
                  >
                    Go to Challenges
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default ShowError;
