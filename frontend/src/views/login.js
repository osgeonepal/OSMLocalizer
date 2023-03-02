import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../components/login";

export const LoginView = ({ redirectTo }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  return !user ? (
    <div
      className="col-12 d-flex justify-content-center flex-column align-items-center"
      style={{ height: "30vh" }}
    >
      <div
        className="col-7 d-flex justify-content-center flex-column align-items-center border border-secondary-subtle rounded"
        style={{ height: "100%" }}
      >
        <div className="p-4">
          You are not logged in. Please login to continue.
        </div>
        <Login redirectTo={redirectTo || location.state?.from || "/"} />
      </div>
    </div>
  ) : (
    <Navigate to={redirectTo || location.state?.from || "/"} />
  );
};
