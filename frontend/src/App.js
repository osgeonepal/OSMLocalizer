import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";
import ChallengesView from "./views/challenges";
// import CreateChallengeView from "./views/createChallenge";
import { LocalizeChallengeView } from "./views/localizeChallenge";
import AuthorizedView from "./views/authorized";
import { handleLogin } from "./store/store";
import { LoginView } from "./views/login";
import { LoggedInRoute } from "./views/privateRoute";
import { ManagementRoute } from "./views/managementRoute";
import AboutView from "./views/about";
import CreateChallenge from "./views/createChallenge";

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
      <div className="container App">
        <Routes>
          <Route path="/*" element={<BasicLayout />} />
          <Route path="/" element={<ChallengesView />} />
          <Route path="/challenges" element={<ChallengesView />} />
          <Route
            path="/create"
            element={
              <ManagementRoute>
                <CreateChallenge />
              </ManagementRoute>
            }
          />
          <Route path="/create" element={<CreateChallenge />} />
          <Route path="/about" element={<AboutView />} />
          <Route
            path="/challenge/:id"
            element={
              <LoggedInRoute>
                <LocalizeChallengeView />
              </LoggedInRoute>
            }
          />
          <Route path="/authorized" element={<AuthorizedView />} />
          <Route path="/login" element={<LoginView />} />
        </Routes>
      </div>
      <Footer path="/*" />
    </BrowserRouter>
  );
}
export default App;
