import React from "react";
import { Input, TextArea, Checkbox } from "../input";

export const MetadataForm = (props) => {
  const challengeStatusOption = [
    { value: "PUBLISHED", label: "PUBLISHED" },
    { value: "ARCHIVED", label: "ARCHIVED" },
    { value: "DRAFT", label: "DRAFT" },
  ];

  const onChange = (e) => {
    props.setChallengeInfo({
      ...props.challengeInfo,
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
        defaultValue={props.challengeInfo.name}
        onChange={onChange}
      />
      <TextArea
        label="Description*"
        name="description"
        type="text"
        placeholder="Description"
        defaultValue={props.challengeInfo.description}
        onChange={onChange}
      />
      <Input
        name="language_tags"
        label="Tags to edit"
        type="text"
        placeholder="Name tags separated by comma e.g. name, name:en"
        onChange={onChange}
        defaultValue={props.challengeInfo.language_tags}
      />
      <Checkbox
        label="Status:"
        name="status"
        options={challengeStatusOption}
        onChange={onChange}
        value={props.challengeInfo.status}
      />
    </div>
  );
};
