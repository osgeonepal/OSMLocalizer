import React from "react";
import { Input, TextArea, Checkbox, SwitchButton } from "../input";

export const MetadataForm = ({ challenge, setChallenge, type }) => {
  const challengeStatusOption = [
    { value: "PUBLISHED", label: "PUBLISHED" },
    { value: "ARCHIVED", label: "ARCHIVED" },
    { value: "DRAFT", label: "DRAFT" },
  ];

  const onInputChange = (e) => {
    setChallenge({
      ...challenge,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <Input
        name="language_tags"
        label="Name keys to localize*"
        type="text"
        placeholder="Name keys separated by comma e.g. name, name:en"
        onChange={onInputChange}
        defaultValue={challenge.language_tags}
      />
      <Input
        label="Challenge Title*"
        name="name"
        type="text"
        placeholder="Challenge Title"
        defaultValue={challenge.name}
        onChange={onInputChange}
        limit={100}
      />
      <TextArea
        label="Description*"
        name="description"
        type="text"
        placeholder="Description"
        defaultValue={challenge.description}
        onChange={onInputChange}
        limit={1000}
      />
      <TextArea
        label="Challenge Instructions*"
        name="feature_instructions"
        type="text"
        placeholder="Challenge Instructions"
        defaultValue={challenge.feature_instructions}
        onChange={onInputChange}
      />
      <Checkbox
        label="Status*"
        name="status"
        options={challengeStatusOption}
        onChange={onInputChange}
        value={challenge.status}
      />
      <SwitchButton
        label="Private project"
        onChange={()=> {setChallenge({...challenge, private: !challenge.private})}}
        checked={challenge.private}
        className="ps-0 p-2 pb-4"
      />
    </div>
  );
};
