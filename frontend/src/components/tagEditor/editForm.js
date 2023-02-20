import React, { useEffect, useState } from "react";
import { Form, Field } from 'react-final-form';
import { yandexTranslator } from "../../utills/translator";
import InputToolForm, {alertComponent} from "./inputToolForm";
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
    const [isCopied, setCopied] = useState(false);
    const name = props.element['tags']['name']? "name" : "name:en";
    const text = encodeURIComponent(props.element['tags'][name]);
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
        props.onDone()});
    }

    const handleCopy = (e) => {
        navigator.clipboard.writeText(e.target.innerText);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }
            , 1200);

    }

    return (
        <div>
            <div className="p-2 pb-0 fs-6 text-secondary">
                <span>{props.element.type}: </span> <span>{props.element.id}</span>
            </div>
            {/* <div className="p-2 pb-0 fs-6 text-secondary fw-bold">
                Edit
            </div> */}
            <Form
                onSubmit={onSubmitChange}
                render={({ handleSubmit, pristine }) => (
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
                        <div className="border border-secondary-subtle rounded overflow-y-auto">
                            {isLoading ? null : (
                                <div className="fs-6 mt-1 p-2">Suggestion:
                                    <span
                                        onClick={(e) =>handleCopy(e) }
                                        className="btn btn-sm btn-dark ms-1"
                                    >
                                        {translation}
                                    </span>
                                </div>
                                
                            )}
                            {isCopied ? alertComponent() : null}
                            <InputToolForm />
                        </div>
                        <div className="p-4">
                            <button className="btn btn-secondary"
                                onClick={()=>props.onSkip()}
                            >
                                Skip
                            </button>
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
