import React, { useState, useEffect } from "react";

import ChallengeEditor from "../components/tagEditor";
import { fetchLocalJSONAPI } from "../utills/fetch";
import { useParams } from "react-router-dom";

export const LocalizeChallengeView = () => {
  const [challenge, setChallenge] = useState({});
  const [isChallenegeLoaded, setIsChallengeLoaded] = useState(false);
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
          <div className="col-4"></div>
          <div className="col-8">
            <ChallengeEditor
              challenge_id={challenge.id}
              challengeTags={challenge.language_tags}
              translateEngine={challenge.translate_engine}
            />
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};
