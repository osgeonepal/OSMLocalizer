import React, { useEffect, useState } from "react";
import { Form, Field } from 'react-final-form';
import { yandexTranslator } from "../../utills/translator";
import InputToolForm from "./inputToolForm";

// TO DO: Fetch from tags to edit
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
    const [translation, setTranslation] = useState();
    const [isLoading, setLoading] = useState(false);
    const yandex_access_token = ""
    const text = encodeURIComponent(props.element['tags']['name']);
    useEffect(() => {
        setLoading(true);
        (async () => {
            const data = await yandexTranslator(text, "en", "ne", yandex_access_token);
            setTranslation(data);
            setLoading(false);

        })();
    }, [text]);


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
                            {isLoading ? null : (
                                <p className="fs-6 mt-3">Translate suggestion:
                                    <span className="btn btn-sm btn-secondary ms-1">{translation}</span>
                                </p>
                            )}
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
