import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ChallengeEditor from "../components/tagEditor";
import { fetchLocalJSONAPI } from "../utills/fetch";
import ShowError from "../components/error";

export const LocalizeChallengeView = ({ validationMode }) => {
  const [challenge, setChallenge] = useState({});
  const [isChallenegeLoaded, setIsChallengeLoaded] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchLocalJSONAPI(`challenge/${id}/`)
      .then((data) => {
        setChallenge(data);
        setIsChallengeLoaded(true);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [id]);

  return (
    <div>
      {isChallenegeLoaded ? (
        <ChallengeEditor
          challenge={challenge}
          validationMode={validationMode}
        />
      ) : (
        <div>Loading...</div>
      )}
      {error && <ShowError error={error} setError={setError} />}
    </div>
  );
};
