import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/header";
import ChallengeDetailView from "./views/challengeDetail";
import ChallengesView from "./views/challenges";
import CreateChallengeView from "./views/createChallenge";
import {LocalizeChallengeView} from "./views/localizeChallenge";

function App() {

  return (
    <div>
        < BrowserRouter >
        <Header path="/*" />
          <div className="container">
            <Routes>
              <Route path="/" element={<LocalizeChallengeView />} />
              <Route path="/challenges" element={<ChallengesView />} />
              <Route path="/create" element={<CreateChallengeView />} />
            </Routes>
          </div>
        </BrowserRouter>
    </div>
   
  );
};
export default App;
