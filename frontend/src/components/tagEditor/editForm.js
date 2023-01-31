import React, { useEffect, useState } from "react";
import { Form, Field } from 'react-final-form';
import { yandexTranslator } from "../../utills/translator";
import InputToolForm from "./inputToolForm";
import { YANDEX_ACCESS_TOKEN } from '../../config';

const editTags = ["name", "name:en", "name:ne"]

const inputComponnent = (key, value) => {
    return (
        <div className="input-group input-group-sm p-2" key={key}>
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
    const text = encodeURIComponent(props.element['tags']['name']);
    useEffect(() => {
        setLoading(true);
        (async () => {
            const data = await yandexTranslator(text, "en", "ne", YANDEX_ACCESS_TOKEN);
            setTranslation(data);
            setLoading(false);

        })();
    }, [text]);

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


    return (
        <div>
            <div className="p-2 pb-0 fs-6 text-secondary">
                <span>{props.element.type}: </span> <span>{props.element.id}</span>
            </div>
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
