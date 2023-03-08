import React from "react";
import { Input, TextArea, Checkbox } from "../input";

export const MetadataForm = ({ challenge, setChallenge }) => {
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
        label="Name*"
        name="name"
        type="text"
        placeholder="Name"
        defaultValue={challenge.name}
        onChange={onInputChange}
      />
      <Checkbox
        label="Status:"
        name="status"
        options={challengeStatusOption}
        onChange={onInputChange}
        value={challenge.status}
      />
      <TextArea
        label="Description*"
        name="description"
        type="text"
        placeholder="Description"
        defaultValue={challenge.description}
        onChange={onInputChange}
      />
      <TextArea
        label="Task Instructions*"
        name="feature_instructions"
        type="text"
        placeholder="Task Instructions"
        defaultValue={challenge.feature_instructions}
        onChange={onInputChange}
      />
      <Input
        name="language_tags"
        label="Tags to edit"
        type="text"
        placeholder="Name tags separated by comma e.g. name, name:en"
        onChange={onInputChange}
        defaultValue={challenge.language_tags}
      />
    </div>
  );
};
