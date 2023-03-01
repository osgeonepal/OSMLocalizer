import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { useDetectClickOutside } from 'react-detect-click-outside';

import InputToolForm from "./inputToolForm";
import TranslateComponent from "./translate";

const inputComponnent = (key, value) => {
    return (
        <div className="input-group input-group-sm p-2" key={key}>
            <span className="input-group-text sm" id={key}>{key}</span>
            <Field
                className="form-control form-control-sm"
                name={key}
                component="input"
                initialValue={value ? value : ""}
            />
        </div>
    )
}

const SkipDropdown = (props) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const ref = useDetectClickOutside({ onTriggered: () => setIsDropdownOpen(false) });

    const skipOptions = [
        { label: "Already Localized", value: "ALREADY_LOCALIZED" },
        { label: "Too hard", value: "TOO_HARD" },
        { label: "Duplicate/Invalid", value: "INVALID_DATA" },
        { label: "Other", value: "OTHER" }
    ];

    const onClick = (status) => {
        setIsDropdownOpen(!isDropdownOpen);
        props.onSkip(status);
    }

    const DropDownItem = (props) => {
        return (
            <li className='border border-bottom border-secondary-subtle'>
                <span
                    className="dropdown-item"
                    onClick={() => {
                        props.onClick(props.value);
                    }}
                >
                    {props.label}
                </span>
            </li>
        )
    }

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
                        transform: "translate3d(0px, -40px, 0px)"
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
    )
}

export function TagEditorForm(props) {
    const name = props.element['tags']['name'] ? "name" : "name:en";
    const text = encodeURIComponent(props.element['tags'][name]);

    const detectChange = (values) => {
        var changedKeys = [];
        for (const [key, value] of Object.entries(values)) {
            if (value !== props.element['tags'][key]) {
                changedKeys.push(key);
            }
        }
        return changedKeys;
    }

    const onSubmitChange = (values) => {
        async function updateElement() {
            const changedKeys = detectChange(values);
            if (changedKeys.length > 0) {
                const newElementTmp = Object.assign({}, props.element);
                for (const key of changedKeys) {
                    newElementTmp['tags'][key] = values[key];
                };
                const allChangesTmp = Object.assign({}, props.allChanges);
                allChangesTmp[`${props.element.type}-${props.element.id}`] = newElementTmp;
                props.setAllChanges(allChangesTmp);
            }
        }
        updateElement().then(() => {
            props.onDone()
        });
    }

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
                        initialValues={props.element['tags']}
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                            form.reset(props.element['tags']);
                        }}
                    >
                        <div className="border border-secondary-subtle p-2 m-2 rounded">
                            {props.tags.map((key) => {
                                return inputComponnent(key, props.element['tags'][key])
                            }
                            )}
                        </div>
                        <div className="border border-secondary-subtle rounded overflow-y-auto">
                            {props.translateEngine ? (
                                <TranslateComponent
                                    text={text}
                                    translateEngine={props.translateEngine}
                                    challenge_id={props.challenge_id}
                                />
                            ) : null}
                            <InputToolForm />
                        </div>
                        <div className="p-4 d-flex">
                            <SkipDropdown
                                onSkip={(value) => {
                                    form.reset({});
                                    props.onSkip(value);
                                }}
                            />
                            <button
                                className="btn btn-primary ms-2"
                                type="submit"
                                disabled={pristine}
                            >
                                Done
                            </button>
                        </div>
                    </form>
                )}
            />
        </div>
    );
};
