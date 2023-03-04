import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Form } from "react-final-form";
import { FormTabs } from "../components/challengeEdit/formTabs";
import { MetadataForm } from "../components/challengeEdit/challengeMetadata";
import { TasksForm } from "../components/challengeEdit/challengeTasks";
import { TranslationForm } from "../components/challengeEdit/translationForm";
import { pushToLocalJSONAPI } from "../utills/fetch";

const renderForm = (option, challengeInfo, setChallengeInfo) => {
  switch (option) {
    case "Description":
      return (
        <MetadataForm
          challengeInfo={challengeInfo}
          setChallengeInfo={setChallengeInfo}
        />
      );
    case "Features":
      return (
        <TasksForm
          challengeInfo={challengeInfo}
          setChallengeInfo={setChallengeInfo}
        />
      );
    case "Translation":
      return (
        <TranslationForm
          challengeInfo={challengeInfo}
          setChallengeInfo={setChallengeInfo}
        />
      );
    default:
      return null;
  }
};

const CreateChallenge = () => {
  const [option, setOption] = useState("Description");
  const [challengeInfo, setChallengeInfo] = useState({});
  const jwt_token = useSelector((state) => state.auth.jwtToken);

  const onSubmit = (values) => {
    pushToLocalJSONAPI("challenge/", values, jwt_token);
  };

  return (
    <div className="row border p-4 m-4 gap-5 bg-light">
      <div className="col-3">
        <FormTabs option={option} setOption={setOption} />
      </div>
      <div className="col-6 justify-content-right">
        <Form
          onSubmit={() => onSubmit(JSON.stringify(challengeInfo))}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              {renderForm(option, challengeInfo, setChallengeInfo)}
              <button className="btn btn-primary mt-2" type="submit">
                Create
              </button>
            </form>
          )}
        />
      </div>
    </div>
  );
};

export default CreateChallenge;
