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