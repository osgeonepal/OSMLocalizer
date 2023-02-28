import { Form, Field } from 'react-final-form';
import InputToolForm from "./inputToolForm";
import TranslateComponent  from "./translate";

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
            {/* <div className="p-2 pb-0 fs-6 text-secondary fw-bold">
                Edit
            </div> */}
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
                        <div className="p-4">
                            <button className="btn btn-secondary"
                                onClick={() => {
                                    form.reset({});
                                    props.onSkip();
                                }}
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
