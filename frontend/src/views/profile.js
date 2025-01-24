import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import {
  ContributionRadarChart,
  UserInfoSection,
  UserStatsSection,
  UserRecentActivity,
  TopContributedProjects,
} from "../components/userProfileComponents";
import { fetchLocalJSONAPI } from "../utills/fetch";
import "bootstrap/dist/css/bootstrap.min.css";

const UserProfile = () => {
  const { username } = useParams();
  const user = useSelector((state) => state.auth.user);

  const ismMyProfile = user?.username === username;

  const [userInfo, setUserInfo] = useState({});
  const [userStats, setUserStats] = useState({});
  const [osmStats, setOsmStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("jwt_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchLocalJSONAPI(
          `user/${username}/`,
          token,
          "GET"
        );
        setUserInfo(userData);

        if (userData?.id) {
          const [statsData, osmStatsData, recentActivityData] =
            await Promise.all([
              fetchLocalJSONAPI(`user/${userData.id}/stats/`, token, "GET"),
              fetchLocalJSONAPI(`user/${userData.id}/osm-stats/`, token, "GET"),
              fetchLocalJSONAPI(
                `user/${userData.id}/recent-activity/`,
                token,
                "GET"
              ),
            ]);
          setUserStats(statsData);
          setOsmStats(osmStatsData);
          setRecentActivity(recentActivityData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex">
      <div className="col-3 bg-light">
        <UserInfoSection
          userInfo={userInfo}
          totalContributions={userStats?.total_contributions}
          isMyProfile={ismMyProfile}
        />
      </div>
      {userStats && (
        <div className="p-2 m-2 d-flex flex-column justify-content-between col-9 bg-white">
          <UserStatsSection osmStats={osmStats} />
          <div className="d-flex border-top">
            <TopContributedProjects
              userChallengeData={userStats?.top_challenges_contributed}
            />
            <ContributionRadarChart userStats={userStats} />
          </div>
          <UserRecentActivity recentActivity={recentActivity} />
        </div>
      )}
    </div>
  );
};

export default UserProfile;
