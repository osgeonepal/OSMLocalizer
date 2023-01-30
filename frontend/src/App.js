import React from "react";
import { Router } from "@reach/router";
import Container from "react-bootstrap/Container";

import "./App.css";
import Header from "./components/header";
import ChallengeDetailView from "./views/challengeDetail";

function App() {

  return (
    <div>
      <Router>
        <Header path="/*" />
      </Router>
      <Container>
        <Router>
            <ChallengeDetailView path="/" />
        </Router>
      </Container>
    </div>
   
  );
};
export default App;
