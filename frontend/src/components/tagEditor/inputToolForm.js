
import React, { useState } from 'react';
import { inputTools } from "../../utills/translator";

export default function InputToolForm() {
    const [transliterate, setTransliterate] = useState([]);
    async function getInputToolSuggestions(text) {
        await inputTools(text, "ne").then((data) => setTransliterate(data));

    }
    return (
        <div>
            <a className="text-decoration-none fw-bold" data-bs-toggle="collapse" aria-controls="collapseExample" aria-expanded="true" href="#collapseExample" role="button"> &gt; Input tool</a>
            <div className="collapse p-2 ps-3" id="collapseExample">
                <input className="form-control form-control-sm" onChange={(e) => getInputToolSuggestions(e.target.value)}></input>
                <div className="d-flex flex-wrap justify-content-center">
                    {transliterate.map((item, index) => (
                        <span className=" text-bg-dark m-1 p-1 rounded" key={index}>{item}</span>
                    ))}
                </div>
            </div>
        </div>

    )
}
