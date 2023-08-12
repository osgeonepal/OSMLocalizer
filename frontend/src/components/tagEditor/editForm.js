import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { useDetectClickOutside } from "react-detect-click-outside";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import InputToolForm from "./inputToolForm";
import TranslateComponent from "./translate";
import { CHANGES_UPLOAD_LIMIT } from "../../config";

export const inputComponent = (key, value, disabled) => {
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
        disabled={disabled}
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
  const elementTags = props.element.tags ? props.element.tags : {};
  const name = elementTags.name ? "name" : "name:en";
  const text = encodeURIComponent(elementTags[name]);
  const elementKey = `${props.element.type}-${props.element.id}`;
  const editTags = props.tags.split(",").map((tag) => tag.trim());
  // Sort editTags array so that the order of tags is consistent
  editTags.sort();

  const [editMode, setEditMode] = useState(false);

  const isFormDisabled = props.validationMode && !editMode;

  const featureStatus = props.feature?.feature.properties.last_status
    ?.replace("_", " ")
    .toLowerCase();

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
      // Reset editMode to false so that validation buttons are shown for the next feature
      if (editMode) setEditMode(!editMode);
    });
  };

  return (
    <div>
      <div className="p-2 pb-0 fs-6 text-secondary d-flex justify-content-between align-items-center">
        <div>
          <span>{props.element.type}: </span>
          <span>{props.element.id}</span>
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          type="button"
          onClick={() => setEditMode(!editMode)}
        >
          <i className="fa fa-pencil me-2" aria-hidden="true"></i>
          Edit
        </button>
const LocalizedStatus = ({ featureStatus, localizedBy }) => {
  return (
    <div className="p-2 ps-4 d-flex">
      <span>
        This feature was set as
        <span
          className="text-primary fw-semibold"
          style={{ textTransform: "capitalize" }}
        >
          {" "}
          {featureStatus}{" "}
        </span>
        by
        <span className="fw-semibold ms-1">{localizedBy}</span>
      </span>
    </div>
  );
};

const SubmitButton = ({ pristine, allChanges, elementKey }) => {
  const exceededMessage = `You have made more than ${CHANGES_UPLOAD_LIMIT} changes. Please upload your changes first.`;
  const disabledMessage =
    Object.keys(allChanges).length >= CHANGES_UPLOAD_LIMIT
      ? exceededMessage
      : "You have not made any changes";

  const isButtonDisabled =
    // Disable the button if there are more than required changes or if changes are not made to the element
    Object.keys(allChanges).length >= CHANGES_UPLOAD_LIMIT ||
    (pristine &&
      // Enable button if the element is already in the allChanges object i.e while updating the element
      // even if the element is not changed.
      !Object.keys(allChanges).includes(elementKey));

  return (
    <div data-tooltip-id="disable" data-tooltip-content={disabledMessage}>
      <button
        className="btn btn-primary ms-2"
        type="submit"
        disabled={isButtonDisabled}
      >
        Done
      </button>
      {isButtonDisabled ? (
        <Tooltip
          place="top-start"
          className="bg-danger text-dark"
          effect="float"
          id="disable"
          style={{ fontSize: "0.7rem" }}
        />
      ) : null}
    </div>
  );
};

const ValidationButtons = ({
  onValidate,
  onInvalidate,
  onReset,
  getFeature,
}) => {
  return (
    <>
      <p>Are the status and tags for this feature correct?</p>
      <div className="d-flex">
        <button
          className="btn btn-primary me-2"
          type="button"
          onClick={() => onValidate()}
        >
          <i className="fa fa-check-circle me-2" aria-hidden="true"></i>
          Valid
        </button>
        <button
          className="btn btn-danger me-2"
          type="button"
          onClick={() => onInvalidate()}
        >
          <i className="fa fa-times-circle me-2" aria-hidden="true"></i>
          Invalid
        </button>
        <button
          className="btn btn-secondary me-2"
          type="button"
          onClick={() => {
            onReset();
            getFeature();
          }}
        >
          <i className="fa fa-fast-forward me-2" aria-hidden="true"></i>
          Skip
        </button>
      </div>
    </>
  );
};

const EditorFooter = ({
  form,
  pristine,
  allChanges,
  elementKey,
  onValidate,
  onInvalidate,
  onSkip,
  getFeature,
  editMode,
  setEditMode,
  isFormDisabled,
}) => {
  return (
    <div>
      {isFormDisabled ? (
        <div className="p-2 ps-4">
          <ValidationButtons
            onValidate={onValidate}
            onInvalidate={onInvalidate}
            onReset={form.reset}
            getFeature={getFeature}
          />
        </div>
      ) : (
        <div className="d-flex ps-2 pt-2">
          {editMode ? (
            <button
              className="btn btn-secondary me-2"
              type="button"
              onClick={() => setEditMode(!editMode)}
            >
              Cancel
            </button>
          ) : (
            <SkipDropdown
              onSkip={(value) => {
                form.reset({});
                onSkip(value);
              }}
            />
          )}
          <SubmitButton
            pristine={pristine}
            allChanges={allChanges}
            elementKey={elementKey}
          />
        </div>
      )}
    </div>
  );
};
          </form>
        )}
      />
    </div>
  );
}
