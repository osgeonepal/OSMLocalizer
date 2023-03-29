import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { FormTabs } from "../components/challengeEdit/formTabs";
import { MetadataForm } from "../components/challengeCreate/setChallengeMetdata";
import { TranslationForm } from "../components/challengeCreate/setChallengeTranslate";
import { fetchLocalJSONAPI, pushToLocalJSONAPI } from "../utills/fetch";
import ShowError from "../components/error";

const renderForm = (option, challengeInfo, setChallengeInfo) => {
  switch (option) {
    case "Description":
      return (
        <MetadataForm
          challenge={challengeInfo}
          setChallenge={setChallengeInfo}
        />
      );
    case "Translation":
      return (
        <TranslationForm
          challenge={challengeInfo}
          setChallenge={setChallengeInfo}
        />
      );
    default:
      return null;
  }
};

const UpdateChallengeView = () => {
  const [option, setOption] = useState("Description");
  const { id } = useParams();
  const [challengeInfo, setChallengeInfo] = useState({});
  const jwt_token = useSelector((state) => state.auth.jwtToken);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocalJSONAPI(`challenge/${id}/`)
      .then((data) => {
        setChallengeInfo(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [id]);

  const onSubmit = (values) => {
    setLoading(true);
    pushToLocalJSONAPI(
      `challenge/${id}/`,
      JSON.stringify(values),
      jwt_token,
      "PATCH"
    )
      .then((res) => {
        if (res.success === true) {
          setSuccess(true);
          setLoading(false);
          setTimeout(() => {
            setSuccess(false);
          }, 10000);
        }
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="row border p-4 m-4 gap-5 bg-light">
      <div className="col-3 d-flex flex-column justify-content-between">
        <div>
          <FormTabs option={option} setOption={setOption} />
        </div>
        <div>
          {success && (
            <div className="alert alert-success" role="alert">
              Challenge updated successfully!
            </div>
          )}
          <button
            className="btn btn-primary mt-2 rounded-0"
            onClick={() => onSubmit(challengeInfo)}
            disabled={loading}
          >
            {loading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
            )}
            Save
          </button>
        </div>
      </div>
      <div className="col-6 justify-content-right">
        <form>
          {renderForm(
            option,
            challengeInfo,
            setChallengeInfo,
            success,
            loading
          )}
        </form>
      </div>
      {error && <ShowError error={error} setError={setError} />}
    </div>
  );
};

export default UpdateChallengeView;
