import React, { useEffect, useState } from "react";
import { Form, Field } from 'react-final-form';
import { yandexTranslator } from "../../utills/translator";
import InputToolForm from "./inputToolForm";
import { createChangeXML } from "../../utills/osm";

const baseOSMJOSN = {
    "version": "0.6",
    "generator": "CGImap 0.8.8 (2403364 spike-06.openstreetmap.org)",
    "copyright": "OpenStreetMap and contributors",
    "attribution": "http://www.openstreetmap.org/copyright",
    "license": "http://opendatacommons.org/licenses/odbl/1-0/",
    "elements": []
}
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
    const [changes, setChanges] = useState({});
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
            let changesTmp = Object.assign({}, changes);
            changesTmp[`${props.element.type}-${props.element.id}`] = { tags: {} };
            for (const key of changedKeys) {
                changesTmp[`${props.element.type}-${props.element.id}`]['tags'][key] = values[key];
            };
            setChanges(changesTmp);
            const newElementTmp = Object.assign({}, props.element);
            for (const key of changedKeys) {
                newElementTmp['tags'][key] = values[key];
            };
            props.setElement(newElementTmp);
            var osmJSON = Object.assign({}, baseOSMJOSN);
            osmJSON['elements'].push(props.element);
            console.log(createChangeXML([props.element]))
        }
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
