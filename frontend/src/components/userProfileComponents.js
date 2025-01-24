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


const UserStatsCard = ({ type, localized, validated, invalidated }) => {
  const statTypesIcons = {
    node: "node-plus",
    way: "diagram-2",
    relation: "bounding-box",
  };
  const icon = statTypesIcons[type];
  return (
    <div className="card col-3">
      <div className="card-body d-flex justify-content-between">
        <div className="justify-content-center align-items-center d-flex">
          <i className={`fs-2 text-primary bi bi-${icon}`} />
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div>
            <span className="fw-bold" style={{ fontSize: "12px" }}>
              {localized}
            </span>
            <span style={{ fontSize: "12px" }}> {type}s localized</span>
          </div>

          <hr className="mb-0" style={{ width: "100%" }} />
          <div className="d-flex justify-content-around">
            <div className="d-flex flex-column align-items-center">
              <span style={{ fontSize: "12px" }}>{validated}</span>
              <span style={{ fontSize: "12px" }}> Valid</span>
            </div>
            <div className="ms-2 me-2 border-end border-dark-subtle" />
            <div className="d-flex flex-column align-items-center">
              <span style={{ fontSize: "12px" }}>{invalidated}</span>
              <span style={{ fontSize: "12px" }}> Invalid</span>
            </div>
            <div className="ms-2 me-2 border-end border-dark-subtle" />
            <div className="d-flex flex-column align-items-center">
              <span style={{ fontSize: "12px" }}>
                {localized - validated - invalidated}
              </span>
              <span style={{ fontSize: "12px" }}> Unchecked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export const UserStatsSection = ({ osmStats }) => {
  const types = ["node", "way", "relation"];

  return (
    <div>
      <h5 className="card-title">Contributions</h5>
      <div className="p-4 card shadow-none border-0 mb-4">
        {/* <h5 className="card-title p-2 ms-2">Contributions</h5> */}
        <div className="d-flex flex-wrap justify-content-between">
          {types.map((type) => (
            <UserStatsCard
              key={type}
              type={type}
              localized={osmStats[type]?.localized}
              validated={osmStats[type]?.validated}
              invalidated={osmStats[type]?.invalidated}
            />
          ))}
        </div>
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

UserStatsCard.propTypes = {
  type: PropTypes.string,
  localized: PropTypes.number,
  validated: PropTypes.number,
  invalidated: PropTypes.number,
};

UserStatsSection.propTypes = {
  osmStats: PropTypes.object,
};