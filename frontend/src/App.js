import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/header";
import ChallengesView from "./views/challenges";
import CreateChallengeView from "./views/createChallenge";
import { LocalizeChallengeView } from "./views/localizeChallenge";
import AuthorizedView from "./views/authorized";
import { handleLogin } from "./store/store";
import { LoginView } from "./views/login";
import { PrivateRoute } from "./views/privateRoute";

const BasicLayout = () => {
  return (
    <>
      <Header />
      <div className="container"></div>
    </>
  );
};

function App() {
  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <BrowserRouter>
      <Header path="/*" />
      <div className="container">
        <Routes>
          <Route path="/*" element={<BasicLayout />} />
          <Route path="/" element={<ChallengesView />} />
          <Route path="/challenges" element={<ChallengesView />} />
          <Route path="/create" element={<CreateChallengeView />} />
          <Route
            path="/challenge/:id"
            element={
              <PrivateRoute>
                <LocalizeChallengeView />
              </PrivateRoute>
            }
          />
          <Route path="/authorized" element={<AuthorizedView />} />
          <Route path="/login" element={<LoginView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
