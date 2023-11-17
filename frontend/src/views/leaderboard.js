import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { fetchLocalJSONAPI } from "../utills/fetch";
import ShowError from "../components/error";

import userAvatar from "../assets/icons/user_avatar.png";
import leaderboardIcon from "../assets/icons/leaderboard.png";

const TopCard = ({ user, rank }) => {
  const picture = user.picture_url ? user.picture_url : userAvatar;
  const background =
    rank === 1 ? "linear-gradient(45deg, #166ff4, #8fb8f7)" : "";

  return (
    <div className="col-sm-4 p-2">
      <div className="mb-2 bg-whiten rounded overflow-hidden shadow">
        <div
          className="bg-primary-subtle pt-3 pb-4"
          style={{ background: background }}
        >
          <h3 className="text-center">{user.score}</h3>
        </div>
        <div className="p-2" style={{ marginTop: "-40px" }}>
          <div className="text-center">
            <img
              src={picture}
              className="circle-img mb-2 border border-3 border-white rounded-circle shadow-sm"
              height="70px"
              width="70px"
              alt="User Img"
            />
            <h5 className="mb-0">{user.username}</h5>
            <p className="text-muted mb-0">
              {user.total_localized + user.total_skipped} Features
            </p>
            <hr />
            <div className="d-flex justify-content-end align-items-center">
              <a
                href={`https://openstreetmap.org/user/${user.username}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                View profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderboardTable = ({ leaderboard }) => {
  return (
    <div className="table-responsive">
      <table
        className="table table-borderless"
        style={{ borderSpacing: "0 15px", borderCollapse: "separate" }}
      >
        <thead>
          <tr className="text-body-tertiary">
            <th className="align-middle" scope="col"></th>
            <th className="align-middle" scope="col"></th>
            <th className="align-middle" scope="col">
              User
            </th>
            <th className="align-middle" scope="col">
              Score
            </th>
            <th className="align-middle" scope="col">
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.users.slice(3).map((user, index) => (
            <tr className="align-middle shadow-sm rounded">
              <th
                className="fs-1 text-body-tertiary align-middle"
                width="5%"
                scope="row"
              >
                {index + 4}
              </th>
              <td className="align-middle" width="5%">
                <div className="d-flex align-items-center">
                  <img
                    src={user.picture_url ? user.picture_url : userAvatar}
                    className="me-2 border border-3 border-white rounded-circle shadow"
                    height="55px"
                    width="55px"
                    alt="User Img"
                  />
                </div>
              </td>
              <td className="align-middle">
                <div className="user-info__basic">
                  <h5 className="mb-0">{user.username}</h5>
                </div>
              </td>
              <td className="align-middle">
                <h4 className="mb-0">{user.score}</h4>
              </td>
              <td className="align-middle text-center fs-6">
                <a
                  href={`https://openstreetmap.org/user/${user.username}`}
                  target="_blank"
                  rel="noreferrer"
                  class="btn btn-outline-primary btn-sm"
                >
                  View profile
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const LeaderboardHeader = () => (
  <div
    className="bg-light p-4 pt-0 pb-0 position-relative mt-4"
    style={{ height: "100px" }}
  >
    <div
      className="position-absolute top-0 translate-middle"
      style={{ left: "15%", top: "15%" }}
    >
      <div className="d-flex align-items-center align-middle">
        <div className="d-flex justify-content-centerbg-secondary-subtle shadow border border-light-subtle">
          <img
            src={leaderboardIcon}
            alt="leaderboard"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
            }}
            className="me-1"
          />
        </div>
        <span className=" fs-3 ms-4 title fw-bold">Leaderboard</span>
      </div>
    </div>
  </div>
);

export const ChallengeLeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLeaderboardLoaded, setIsLeaderboardLoaded] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const calculateScore = (user) => {
    const validated_by_me =
      user.total_validated_by_me + user.total_invalidated_by_me;
    return (
      user.total_localized * 3 +
      user.total_skipped +
      user.total_my_validated * 2 +
      validated_by_me * 4
    );
  };

  useEffect(() => {
    fetchLocalJSONAPI(`challenge/${id}/user-stats/`)
      .then((data) => {
        // set score = (total_localized*3 + total_skipped*1) and sort by score
        data.users.forEach((user) => {
          user.score = calculateScore(user);
        });
        data.users.sort((a, b) => b.score - a.score);
        setLeaderboard(data);
        setIsLeaderboardLoaded(true);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [id]);

  return (
    <div className="d-flex justify-content-center">
      {isLeaderboardLoaded ? (
        <div className="col-11 p-4 mt-4">
          <LeaderboardHeader />
          <div className="bg-light p-4 pt-0">
            {leaderboard.users.length > 0 && (
              <div className="row">
                <h4 className="mt-0">Top Contributors</h4>
                {leaderboard.users.slice(0, 3).map((user, index) => (
                  <TopCard key={index} user={user} rank={index + 1} />
                ))}
              </div>
            )}
            <div className="col-12">
              {leaderboard.users.length > 3 && (
                <>
                  <h4 className="mt-2">Other Contributors</h4>
                  <LeaderboardTable leaderboard={leaderboard} />
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {error && <ShowError error={error} setError={setError} />}
    </div>
  );
};

export const LeaderboardView = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLeaderboardLoaded, setIsLeaderboardLoaded] = useState(false);
  const [error, setError] = useState(null);

  const calculateScore = (user) => {
    const validated_by_me =
      user.total_validated_by_me + user.total_invalidated_by_me;
    return (
      user.total_localized * 3 +
      user.total_skipped +
      user.total_my_validated * 4 +
      validated_by_me * 2
    );
  };

  useEffect(() => {
    fetchLocalJSONAPI("user/leaderboard/")
      .then((data) => {
        // set score = (total_localized*3 + total_skipped*1) and sort by score
        data.users.forEach((user) => {
          user.score = calculateScore(user);
        });
        data.users.sort((a, b) => b.score - a.score);
        setLeaderboard(data);
        setIsLeaderboardLoaded(true);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  return (
    <div className="d-flex justify-content-center">
      {isLeaderboardLoaded ? (
        <div className="col-11 p-4 mt-4">
          <LeaderboardHeader />
          <div className="bg-light p-4 pt-0">
            {leaderboard.users.length > 0 && (
              <div className="row">
                <h4 className="mt-0">Top Contributors</h4>
                {leaderboard.users.slice(0, 3).map((user, index) => (
                  <TopCard key={index} user={user} rank={index + 1} />
                ))}
              </div>
            )}
            <div className="col-12">
              {leaderboard.users.length > 3 && (
                <>
                  <h4 className="mt-2">Other Contributors</h4>
                  <LeaderboardTable leaderboard={leaderboard} />
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {error && <ShowError error={error} setError={setError} />}
    </div>
  );
};
