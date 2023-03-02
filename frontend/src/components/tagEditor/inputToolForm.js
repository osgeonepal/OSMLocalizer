import React, { useState } from "react";
import { inputTools } from "../../utills/translator";

export const alertComponent = () => {
  return (
    <div className="alert alert-success position-fixed bottom-0 end-0 p-2 m-2">
      Text copied to clipboard
    </div>
  );
};

export default function InputToolForm() {
  const [transliterate, setTransliterate] = useState([]);
  const [isExpanded, setExpanded] = useState(false);
  const [isCopied, setCopied] = useState(false);
  async function getInputToolSuggestions(text) {
    await inputTools(text, "ne").then((data) => setTransliterate(data));
  }
  const handleExpand = () => {
    setExpanded(!isExpanded);
  };

  const handleCopy = (e) => {
    navigator.clipboard.writeText(e.target.innerText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  return (
    <div className="p-2 pt-0">
      <div
        className="text-decoration-none fw-bold"
        onClick={handleExpand}
        role="button"
      >
        {isExpanded ? "▼" : "►"} Input tool
      </div>
      <div className={isExpanded ? "p-2 ps-3" : "d-none"}>
        <input
          className="form-control form-control-sm"
          onChange={(e) => getInputToolSuggestions(e.target.value)}
        />
        <div className="d-flex flex-wrap justify-content-center">
          {transliterate.map((item, index) => (
            <span
              style={{ cursor: "pointer" }}
              onClick={(e) => handleCopy(e)}
              className=" text-bg-dark m-1 p-1 rounded"
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
