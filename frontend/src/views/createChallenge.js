import React, { useState } from "react";
import { Form } from "react-final-form";
import { FormTabs } from "../components/challengeEdit/formTabs";
import { MetadataForm } from "../components/challengeEdit/challengeMetadata";
import { TasksForm } from "../components/challengeEdit/challengeTasks";
import { TranslationForm } from "../components/challengeEdit/translationForm";


const renderForm = (option, challengeInfo, setChallengeInfo) => {
    switch (option) {
        case 'Description':
            return <MetadataForm challengeInfo={challengeInfo} setChallengeInfo={setChallengeInfo} />
        case 'Tasks':
            return <TasksForm challengeInfo={challengeInfo} setChallengeInfo={setChallengeInfo} />
        case 'Translation':
            return <TranslationForm challengeInfo={challengeInfo} setChallengeInfo={setChallengeInfo} />
        default:
            return null
    }
}


const CreateChallenge = () => {
    const [option, setOption] = useState('Description');
    const [challengeInfo, setChallengeInfo] = useState({});

    return (
        <div className="row border p-4 m-4 gap-5 bg-light">
            <div className="col-3">
                <FormTabs option={option} setOption={setOption} />
            </div>
            <div className="col-6 justify-content-right">
                <Form
                    onSubmit={() => console.log(challengeInfo)}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            {renderForm(option, challengeInfo, setChallengeInfo)}
                            <button className="btn btn-info mt-2" type="submit" >Create</button>
                        </form>
                    )}
                />

            </div>
        </div>
    )
}


export default CreateChallenge;
