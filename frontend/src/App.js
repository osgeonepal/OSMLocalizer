import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/header";
import Footer from "./components/footer";
import ChallengesView from "./views/challenges";
import UpdateChallengeView from "./views/updateChallenge";
import { LocalizeChallengeView } from "./views/localizeChallenge";
import AuthorizedView from "./views/authorized";
import { handleLogin } from "./store/store";
import { LoginView } from "./views/login";
import { LoggedInRoute } from "./views/privateRoute";
import ManagementSection from "./views/managementRoute";
import AboutView from "./views/about";
import CreateChallenge from "./views/createChallenge";
import { Notfound } from "./views/notFound";

function App() {
  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <div className="container App">
        <Routes>
          <Route path="/" element={<ChallengesView />} />
          <Route path="/challenges" element={<ChallengesView />} />
          <Route path="/manage" element={<ManagementSection />}>
            <Route path="challenge/:id" element={<UpdateChallengeView />} />
            <Route path="challenge/create" element={<CreateChallenge />} />
          </Route>
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
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
export default App;
