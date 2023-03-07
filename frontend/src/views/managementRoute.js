import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";

const NotAuthorized = () => {
  return (
    <div
      className="col-12 d-flex justify-content-center flex-column align-items-center"
      style={{ height: "30vh" }}
    >
      <div
        className="col-7 d-flex justify-content-center flex-column align-items-center border border-secondary-subtle rounded"
        style={{ height: "100%" }}
      >
        <div className="p-4">
          You are not allowed to access this page. Please contact the
          administrator.
        </div>
      </div>
    </div>
  );
};

const ManagementSection = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  return (
    <div>
      {!user ? (
        <Navigate to="/login" state={{ from: location.pathname }} />
      ) : user.role === "1" ? (
        <Outlet />
      ) : (
        NotAuthorized()
      )}
    </div>
  );
};

export default ManagementSection;
