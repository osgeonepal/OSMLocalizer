import React from "react";
import { Input, TextArea, Select, Checkbox } from "../input";
import languageJson from "../../assets/json/language.json";

export const MetadataForm = (props) => {
    const challengeStatusOption = [
        { value: 'PUBLISHED', label: 'PUBLISHED' },
        { value: 'ARCHIVED', label: 'ARCHIVED' },
        { value: 'DRAFT', label: 'DRAFT' },
    ];

    const onChange = (e) => {
        props.setChallengeInfo({
            ...props.challengeInfo,
            [e.target.name]: e.target.value
        })
    }

    const languageOptions = Object.keys(languageJson).map((key) => {
        if (key === '---') {
            return { label: key, value: '' }
        }
        return { label: key, value: languageJson[key] }

    })

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
            <Select 
                label="Translate to"
                name="to_language"
                clearable={true}
                options={languageOptions}
                onChange={onChange}
                value={props.challengeInfo.translate_to}
            />
            <Checkbox 
                label="Status:"
                name="status"
                options={challengeStatusOption}
                onChange={onChange}
                value={props.challengeInfo.status}
            />
        </div>
    )
}
