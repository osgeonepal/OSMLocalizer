import { React, useState, useEffect } from "react";

import { fetchLocalJSONAPI } from "../utills/fetch";
import ChallengeInfo from "../components/challenge/challengeInfo";

export default function ChallengeDetailView() {
  const [challenge, setChallenge] = useState({});
  const [isChallenegeLoaded, setIsChallengeLoaded] = useState(false);
  useEffect(() => {
    fetchLocalJSONAPI("challenge/1/").then((data) => {
      setChallenge(data);
      setIsChallengeLoaded(true);
    });
  }, []);

  return (
    <div>
      {isChallenegeLoaded ? (
        <div className="row">
          <div className="col-6">
            <ChallengeInfo challenge={challenge} />
          </div>
          <div className="col-6"></div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
