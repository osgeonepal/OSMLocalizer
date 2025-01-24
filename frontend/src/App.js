import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";
import ChallengesView from "./views/challenges";
import { ChallengeLeaderBoard, LeaderboardView } from "./views/leaderboard";
import UpdateChallengeView from "./views/updateChallenge";
import { LocalizeChallengeView } from "./views/localizeChallenge";
import AuthorizedView from "./views/authorized";
import { handleLogin } from "./store/store";
import { LoginView } from "./views/login";
import { LoggedInRoute } from "./views/privateRoute";
import UserProfile from "./views/profile";
import HomeView from "./views/home";
import ManagementSection from "./views/managementRoute";
import AboutView from "./views/about";
import CreateChallenge from "./views/createChallenge";
import { Notfound } from "./views/notFound";
import { fetchLocalJSONAPI } from "./utills/fetch";
import ChallengeDetailView from "./views/challengeDetail";
import ManageUsers from "./views/manageUsers";
import ShowError from "./components/error";

function App() {
  const [error, setError] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    token &&
      fetchLocalJSONAPI("auth/token-expiry/", token, "GET")
        .then((res) => {
          console.log(res);
          if (!res.expired) {
            handleLogin();
          }
        })
        .catch((err) => {
          err.message === "INVALID_TOKEN" && setError("SESSION_EXPIRED");
        });
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <div className="container App">
        {error && <ShowError error={error} setError={setError} />}
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route path="/challenges" element={<ChallengesView />} />
          <Route path="/manage" element={<ManagementSection />}>
            <Route path="challenge/:id" element={<UpdateChallengeView />} />
            <Route path="challenge/create" element={<CreateChallenge />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>
          <Route
            path="challenge/:id/leaderboard"
            element={<ChallengeLeaderBoard />}
          ></Route>
          <Route path="/create" element={<CreateChallenge />} />
          <Route path="/about" element={<AboutView />} />
          <Route
            path="/challenge/localize/:id"
            element={
              <LoggedInRoute>
                <LocalizeChallengeView validationMode={false} />
              </LoggedInRoute>
            }
          />
          <Route
            path="/challenge/validate/:id"
            element={
              <LoggedInRoute>
                <LocalizeChallengeView validationMode={true} />
              </LoggedInRoute>
            }
          />
          <Route
            path="/challenge/:id"
            element={
              <LoggedInRoute>
                <ChallengeDetailView />
              </LoggedInRoute>
            }
          />
          <Route path="/leaderboard" element={<LeaderboardView />} />
          <Route path="/authorized" element={<AuthorizedView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
export default App;
