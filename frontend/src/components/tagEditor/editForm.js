import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { useDetectClickOutside } from "react-detect-click-outside";

import InputToolForm from "./inputToolForm";
import TranslateComponent from "./translate";

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

  const detectChange = (values) => {
    var changedKeys = [];
    for (const [key, value] of Object.entries(values)) {
      if (value !== props.element["tags"][key]) {
        changedKeys.push(key);
      }
    }
    return changedKeys;
  };

  const onSubmitChange = (values) => {
    async function updateElement() {
      const changedKeys = detectChange(values);
      if (changedKeys.length > 0) {
        const newElementTmp = Object.assign({}, props.element);
        for (const key of changedKeys) {
          newElementTmp["tags"][key] = values[key];
        }
        const allChangesTmp = Object.assign({}, props.allChanges);
        allChangesTmp[elementKey] = newElementTmp;
        props.setAllChanges(allChangesTmp);
      }
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
              form.reset(props.element["tags"]);
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
              <button
                className="btn btn-primary ms-2"
                type="submit"
                disabled={
                  pristine &&
                  !Object.keys(props.allChanges).includes(elementKey)
                }
              >
                Done
              </button>
            </div>
          </form>
        )}
      />
    </div>
  );
}
