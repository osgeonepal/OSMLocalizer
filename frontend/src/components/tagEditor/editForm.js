import React, { useEffect, useState } from "react";
import { Form, Field } from 'react-final-form';
import InputToolForm from "./inputToolForm";

// TO DO: Fetch prom challenge tags to edit
const editTags = ["name", "name:en", "name:ne"]

const inputComponnent = (key, value) => {
    return (
        <div className="input-group input-group-sm p-2">
            <span className="input-group-text sm" id={key}>{key}</span>
            <Field
                className="form-control form-control-sm"
                name={key}
                component="input"
                aria-describedby={key}
                initialValue={value}
            />
        </div>
    )
}


export function TagEditorForm(props) {
    const onSubmitChange = (values) => {
        console.log(values)
    }


    return (
        <div>
            <Form
                onSubmit={onSubmitChange}
                render={({ handleSubmit }) => (
                    <form
                        className=""
                        onSubmit={handleSubmit}
                    >
                        <div className="border border-secondary-subtle p-2 m-2 rounded">
                            {editTags.map((key) => {
                                return inputComponnent(key, props.element['tags'][key])
                            }
                            )}
                        </div>
                        <div>
                            <p className="fs-6 mt-3">Translate suggestion:
                                <span className="btn btn-sm btn-secondary ms-1">Translated</span>
                            </p>
                            <InputToolForm />
                        </div>
                        {/* <button className="btn btn-secondary btn-sm" type="submit">Skip</button> */}
                        <button className="btn btn-secondary btn-sm" type="submit">Done</button>
                    </form>
                )}
            />
        </div>
    );
};
