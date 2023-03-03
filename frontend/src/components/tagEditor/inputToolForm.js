import React, { useState } from "react";
import { inputTools } from "../../utills/translator";

export const alertComponent = () => {
  return (
    <div className="alert alert-success position-fixed bottom-0 end-0 p-2 m-2">
      Text copied to clipboard
    </div>
  );
};

export default function InputToolForm({ translate_to }) {
  const [transliterate, setTransliterate] = useState([]);
  const [isCopied, setCopied] = useState(false);
  async function getInputToolSuggestions(text) {
    text !== "" &&
      (await inputTools(text, translate_to).then((data) =>
        setTransliterate(data)
      ));
    text === "" && setTransliterate([]);
  }

  const handleCopy = (e) => {
    navigator.clipboard.writeText(e.target.innerText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  return (
    <div className="p-2 pt-1 pb-1">
      <div className="input-group input-group-sm p-2 pt-1">
        <span className="input-group-text sm bg-secondary text-light">
          Transliterate
        </span>
        <input
          className="form-control form-control-sm"
          component="input"
          onChange={(e) => getInputToolSuggestions(e.target.value)}
        />
      </div>
      <div className={"p-2 pt-1 ps-3"}>
        <div className="d-flex flex-wrap justify-content-center">
          {transliterate.map((item, index) => (
            <span
              style={{ cursor: "pointer" }}
              onClick={(e) => handleCopy(e)}
              className=" text-bg-dark ms-1 me-1 p-1 rounded"
              key={index}
            >
              {item}
            </span>
          ))}
          {isCopied ? alertComponent() : null}
        </div>
      </div>
    </div>
  );
}
