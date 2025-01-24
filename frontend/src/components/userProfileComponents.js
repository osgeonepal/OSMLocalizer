import React from "react";
import PropTypes from "prop-types";


export const UserInfoSection = ({
  userInfo,
  totalContributions,
  isMyProfile,
}) => {
  const registered_date = new Date(
    userInfo?.date_registered
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="card border-0 bg-light shadow-none">
      <div className="card-body text-center b-0">
        <img
          src={userInfo?.picture_url}
          className="rounded-circle mb-2"
          alt="User Profile"
          style={{ width: "152px", height: "152px" }}
        />
        <h4 className="card-title">{userInfo?.username}</h4>
        <p className="text-muted">Contributor since: {registered_date}</p>
        <p className="text-muted">Total Contributions: {totalContributions}</p>
      </div>
      {isMyProfile && <UserEditProfile userInfo={userInfo} />}
    </div>
  );
};


const UserEditProfile = ({ userInfo }) => {
  const [email, setEmail] = useState(userInfo?.email);
  const [editEmail, setEditEmail] = useState(true);

  const onEmailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value !== userInfo?.email) {
      setEditEmail(true);
    }
  };
  const onEditEmail = () => {
    setEditEmail(!editEmail);
  };
  return (
    <div className="card-footer text-center">
      <div className="d-flex justify-content-between align-items-center">
        {editEmail || userInfo?.email==null ? (
          <input
            name="email"
            type="email"
            className="me-2 form-control"
            placeholder="Add your email"
            defaultValue={userInfo?.email}
            onChange={(e) => onEmailChange(e)}
          />
        ) : (
          <span>{userInfo?.email}</span>
        )}
        {editEmail ? (
          <div className="d-flex">
            <button
              className="btn btn-sm btn-primary"
              onClick={onEditEmail}
              disabled={email === userInfo?.email || email === ""}
            >
              Save
            </button>
            <button
              className="btn btn-sm btn-link"
              onClick={onEditEmail}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button className="btn btn-sm btn-link" onClick={onEditEmail}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
};


UserInfoSection.propTypes = {
  userInfo: PropTypes.shape({
    picture_url: PropTypes.string,
    username: PropTypes.string,
    date_registered: PropTypes.string,
  }),
  totalContributions: PropTypes.number,
  isMyProfile: PropTypes.bool,
};

UserEditProfile.propTypes = {
  userInfo: PropTypes.shape({
    email: PropTypes.string,
  }),
};