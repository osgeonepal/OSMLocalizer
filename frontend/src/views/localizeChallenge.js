import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ChallengeEditor from "../components/tagEditor";
import { fetchLocalJSONAPI } from "../utills/fetch";
import { ChallengeInstructions } from "../components/challengeInstructions";

export const LocalizeChallengeView = () => {
  const [challenge, setChallenge] = useState({});
  const [isChallenegeLoaded, setIsChallengeLoaded] = useState(false);
  const [nearbyTask, setNearbyTask] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    fetchLocalJSONAPI(`challenge/${id}/`).then((data) => {
      setChallenge(data);
      setIsChallengeLoaded(true);
    });
  }, [id]);
  return (
    <div>
      {isChallenegeLoaded ? (
        <div className="row">
          <div className="col-4 p-0">
            <ChallengeInstructions
              challenge={challenge}
              nearbyTask={nearbyTask}
              setNearbyTask={setNearbyTask}
            />
          </div>
          <div className="col-8">
            <ChallengeEditor
              challenge_id={challenge.id}
              challengeTags={challenge.language_tags}
              translateEngine={challenge.translate_engine}
              nearbyTask={nearbyTask}
              translate_to={challenge.to_language}
            />
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
