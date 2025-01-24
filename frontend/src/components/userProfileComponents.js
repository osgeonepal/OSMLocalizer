import React, { useState } from "react";
import PropTypes from "prop-types";

import { Radar } from "react-chartjs-2";
import "chart.js/auto";

export const TopContributedProjects = ({ userChallengeData }) => {
  return (
    <div className="border border-0 border-end flex-grow-1">
      <h5 className="card-title mt-4 mb-4">Top Challenges Contributed</h5>
      <div>
        {userChallengeData ? (
          <ul className="list-group list-group-flush">
            {Object.keys(userChallengeData)
              .slice(0, 5)
              .map((challenge) => (
                <li
                  className="list-group-item d-flex justify-content-between align-items-center"
                  key={challenge}
                >
                  {challenge}
                  <span className="badge bg-primary rounded-pill">
                    {userChallengeData[challenge]} Contributions
                  </span>
                </li>
              ))}
          </ul>
        ) : (
          <p>No recent contributions</p>
        )}
      </div>
    </div>
  );
};

export const ContributionRadarChart = ({ userStats }) => {
  let contributions = [
    userStats?.total_skipped,
    userStats?.total_validated_by_me + userStats?.total_invalidated_by_me,
    userStats?.total_localized,
  ];
  // Calculate percentage of contributions
  const totalContributions = contributions.reduce((a, b) => a + b, 0);
  contributions = contributions.map((value) =>
    ((value / totalContributions) * 100).toFixed(2)
  );
  const data = {
    labels: ["Marked Invalid/Skipped", "Validated", "Localized"],
    datasets: [
      {
        label: "Contributions",
        data: contributions,
        backgroundColor: "rgba(168,225,178, 0.7)",
        borderColor: "rgba(57,211,84, 1)",
        borderWidth: 0.1,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgb(33,109,57)",
        pointBorderWidth: 2,
      },
    ],
  };

  // Options for the radar chart
  const options = {
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          display: true,
        },
        angleLines: {
          display: true,
          color: "rgb(33,109,57)",
          lineWidth: 2,
        },
        ticks: {
          display: false,
        },
        pointLabels: {
          callback: function (label, index) {
            // Display value and label on separate lines
            const value = data.datasets[0].data[index];
            return [`${value}%`, label];
          },
          font: {
            size: 11,
          },
          align: "end",
        },
        title: {
          display: false,
        },
      },
    },

    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="ps-2 pe-2">
      <h5 className="mt-4 mb-4 card-title">Contribution Summary</h5>
    <div style={{ width: "350px", height: "350px", margin: "0 auto" }}>
      <Radar data={data} options={options} />
      </div>
    </div>
  );
};

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

TopContributedProjects.propTypes = {
  userChallengeData: PropTypes.object,
};

ContributionRadarChart.propTypes = {
  userStats: PropTypes.object,
};