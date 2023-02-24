import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "./App.css";
import Header from "./components/header";
// import ChallengeDetailView from "./views/challengeDetail";
import ChallengesView from "./views/challenges";
import CreateChallengeView from "./views/createChallenge";
import { LocalizeChallengeView } from "./views/localizeChallenge";
import AuthorizedView from "./views/authorized";
import { getItem } from "./utills/localStorage";
import { authActions } from "./store/store";



const BasicLayout = () => {
  return (
    <>
      <Header />
      <div className="container">

      </div>
    </>
  );
}

function App() {
  const dispatch = useDispatch();
  const handleLogin = (dispatch) => {
    if (getItem("jwt_token")) {
      dispatch(authActions.login({
        jwtToken: getItem("jwt_token"),
        osmToken: getItem("osm_token"),
        user: {
          username: getItem("username"),
          user_id: getItem("user_id"),
          role: getItem("role"),
          picture_url: getItem("picture_url")
        }
      }));
    }
  }
  useEffect(() => {
    handleLogin(dispatch);
  }, []);

  return (
    < BrowserRouter >
      <Header path="/*" />
      <div className="container">
        <Routes >
          <Route path="/*" element={<BasicLayout />} />
          <Route path="/" element={<ChallengesView />} />
          <Route path="/challenges" element={<ChallengesView />} />
          <Route path="/create" element={<CreateChallengeView />} />
          <Route
            path="/challenge/:id"
            // loader={async (params) => loadChallenge(params.id)}
            element={<LocalizeChallengeView />}
          />
          <Route path="/authorized" element={<AuthorizedView />} />

        </Routes>
      </div>
    </BrowserRouter>

  );
};
export default App;
