import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import { Form } from "react-final-form";

import { FormTabs } from "../components/challengeEdit/formTabs";
// import { MetadataForm } from "../components/challengeEdit/challengeMetadata";
import { MetadataForm } from "../components/challengeCreate/setChallengeMetdata";
// import { TasksForm } from "../components/challengeEdit/challengeTasks";
import { TranslationForm } from "../components/challengeCreate/setChallengeTranslate";
import { fetchLocalJSONAPI, pushToLocalJSONAPI } from "../utills/fetch";

const renderForm = (option, challengeInfo, setChallengeInfo) => {
  switch (option) {
    case "Description":
      return (
        <MetadataForm
          challenge={challengeInfo}
          setChallenge={setChallengeInfo}
        />
      );
    // case "Features":
    //   return (
    //     <TasksForm
    //       challengeInfo={challengeInfo}
    //       setChallengeInfo={setChallengeInfo}
    //     />
    //   );
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

  useEffect(() => {
    fetchLocalJSONAPI(`challenge/${id}/`).then((data) => {
      setChallengeInfo(data);
    });
  }, [id]);

  const onSubmit = (values) => {
    pushToLocalJSONAPI(
      `challenge/${id}/`,
      JSON.stringify(values),
      jwt_token,
      "PATCH"
    );
  };

  return (
    <div className="row border p-4 m-4 gap-5 bg-light">
      <div className="col-3 d-flex flex-column justify-content-between">
        <div>
          <FormTabs option={option} setOption={setOption} />
        </div>
        <div>
          <button
            className="btn btn-primary mt-2 rounded-0"
            onClick={() => onSubmit(challengeInfo)}
          >
            Save
          </button>
        </div>
      </div>
      <div className="col-6 justify-content-right">
        <form>{renderForm(option, challengeInfo, setChallengeInfo)}</form>
      </div>
    </div>
  );
};

export default UpdateChallengeView;
