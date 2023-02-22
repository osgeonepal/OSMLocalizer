import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Header from "./components/header";
// import ChallengeDetailView from "./views/challengeDetail";
import ChallengesView from "./views/challenges";
import CreateChallengeView from "./views/createChallenge";
import {LocalizeChallengeView} from "./views/localizeChallenge";

const BasicLayout = ()=> {
  return (
    <>
      <Header />
      <div className="container">

      </div>
    </>
  );
}

function App() {

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
            </Routes>
          </div>
        </BrowserRouter>
   
  );
};
export default App;
