import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";

import "./App.css";
import Header from "./components/header";
import ChallengeDetailView from "./views/challengeDetail";
import ChallengesView from "./views/challenges";
import CreateChallengeView from "./views/createChallenge";

function App() {

  return (
    <div>
      <Container>
        < BrowserRouter >
        <Header path="/*" />
        <Routes>
            <Route path="/" element={<ChallengeDetailView />} />
            <Route path="/challenges" element={<ChallengesView />} />
            <Route path="/create" element={<CreateChallengeView />} />
          </Routes>
        </BrowserRouter>
      </Container>
    </div>
   
  );
};
export default App;
