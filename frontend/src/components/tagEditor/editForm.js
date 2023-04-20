import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { useDetectClickOutside } from "react-detect-click-outside";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import InputToolForm from "./inputToolForm";
import TranslateComponent from "./translate";
import { CHANGES_UPLOAD_LIMIT } from "../../config";

export const inputComponnent = (key, value) => {
  return (
    <div className="input-group input-group-sm p-2" key={key}>
      <span className="input-group-text sm" id={key}>
        {key}
      </span>
      <Field
        className="form-control form-control-sm"
        name={key}
        component="input"
        initialValue={value ? value : ""}
      />
    </div>
  );
};

const SkipDropdown = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const ref = useDetectClickOutside({
    onTriggered: () => setIsDropdownOpen(false),
  });

  const skipOptions = [
    { label: "Already Localized", value: "ALREADY_LOCALIZED" },
    { label: "Too hard", value: "TOO_HARD" },
    { label: "Duplicate/Invalid", value: "INVALID_DATA" },
    { label: "Other", value: "OTHER" },
  ];

  const onClick = (status) => {
    setIsDropdownOpen(!isDropdownOpen);
    props.onSkip(status);
  };

  const DropDownItem = (props) => {
    return (
      <li className="border border-bottom border-secondary-subtle">
        <span
          className="dropdown-item"
          onClick={() => {
            props.onClick(props.value);
          }}
        >
          {props.label}
        </span>
      </li>
    );
  };

  return (
    <div className="dropup" ref={ref} style={{ cursor: "pointer" }}>
      <span
        className="btn btn-secondary dropdown-toggle show"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Skip
      </span>
      {isDropdownOpen ? (
        <ul
          className="dropdown-menu show d-flex flex-column mt-1 p-1 rounded-0"
          style={{
            position: "absolute",
            inset: "auto auto 0px 0px",
            margin: "0px",
            transform: "translate3d(0px, -40px, 0px)",
          }}
        >
          {skipOptions.map((option) => (
            <DropDownItem
              key={option.value}
              label={option.label}
              value={option.value}
              onClick={onClick}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export function TagEditorForm(props) {
  const name = props.element["tags"]["name"] ? "name" : "name:en";
  const text = encodeURIComponent(props.element["tags"][name]);
  const elementKey = `${props.element.type}-${props.element.id}`;
  const editTags = props.tags.split(",").map((tag) => tag.trim());
  // Sort editTags array so that the order of tags is consistent
  editTags.sort();

  const exceededMessage = `You have made more than ${CHANGES_UPLOAD_LIMIT} changes. Please upload your changes first.`;
  const disabledMessage =
    Object.keys(props.allChanges).length >= CHANGES_UPLOAD_LIMIT
      ? exceededMessage
      : "You have not made any changes";

  const onSubmitChange = (values) => {
    async function updateElement() {
      const newElementTmp = { ...props.element };
      newElementTmp["tags"] = { ...props.element["tags"] };
      for (const [key, value] of Object.entries(values)) {
        newElementTmp["tags"][key] = value;
      }
      const allChangesTmp = { ...props.allChanges };
      allChangesTmp[elementKey] = newElementTmp;
      props.setAllChanges(allChangesTmp);
    }
    updateElement().then(() => {
      props.onDone();
    });
  };

  return (
    <div>
      <div className="p-2 pb-0 fs-6 text-secondary">
        <span>{props.element.type}: </span> <span>{props.element.id}</span>
      </div>
      <Form
        onSubmit={onSubmitChange}
        render={({ handleSubmit, pristine, form }) => (
          <form
            className=""
            initialValues={props.element["tags"]}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
              form.reset({});
            }}
          >
            <div className="border border-secondary-subtle p-2 m-2 rounded">
              {editTags.map((key) => {
                return inputComponnent(key, props.element["tags"][key]);
              })}
            </div>
            <div className="border border-secondary-subtle rounded overflow-y-auto m-2 mb-1">
              {props.translateEngine ? (
                <TranslateComponent
                  text={text}
                  translateEngine={props.translateEngine}
                  challenge_id={props.challenge_id}
                />
              ) : (
                <div className="mt-1 p-2">
                  <a
                    className="btn btn-sm btn-secondary p-2 pt-1 pb-1"
                    href={`https://translate.google.com/#view=home&op=translate&sl=en&tl=${props.translate_to}&text=${text}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Translate
                    <i
                      className="fa fa-external-link ms-1"
                      aria-hidden="true"
                    ></i>
                  </a>
                </div>
              )}
              <InputToolForm translate_to={props.translate_to} />
            </div>
            <div className="p-2 ps-4 d-flex">
              <SkipDropdown
                onSkip={(value) => {
                  form.reset({});
                  props.onSkip(value);
                }}
              />
              <div
                data-tooltip-id="disable"
                data-tooltip-content={disabledMessage}
              >
                <button
                  className="btn btn-primary ms-2"
                  type="submit"
                  // Disable the button if there are more than required changes or if changes are not made to the element
                  disabled={
                    Object.keys(props.allChanges).length >=
                      CHANGES_UPLOAD_LIMIT ||
                    (pristine &&
                      // Allow done on no changes
                      // if it is already in the allChanges object i.e while updating the changes
                      !Object.keys(props.allChanges).includes(elementKey))
                  }
                >
                  Done
                </button>
                {
                  // Same logic as done button disabled
                  Object.keys(props.allChanges).length >=
                    CHANGES_UPLOAD_LIMIT ||
                  (pristine &&
                    !Object.keys(props.allChanges).includes(elementKey)) ? (
                    <Tooltip
                      place="top-start"
                      className="bg-danger text-dark"
                      effect="float"
                      id="disable"
                      style={{ fontSize: "0.7rem" }}
                    />
                  ) : null
                }
              </div>
            </div>
          </form>
        )}
      />
    </div>
  );
}
