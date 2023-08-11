import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchLocalJSONAPI } from "../../utills/fetch";
import { alertComponent } from "../tagEditor/inputToolForm";

const TranslateComponent = ({
  text,
  translateEngine,
  challenge_id,
  translateTo,
}) => {
  const [translation, setTranslation] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isCopied, setCopied] = useState(false);
  const jwtToken = useSelector((state) => state.auth.jwtToken);

  useEffect(() => {
    setLoading(true);
    (async () => {
      await fetchLocalJSONAPI(
        `challenge/${challenge_id}/translate/?text=${text}`,
        jwtToken
      ).then((data) => {
        setTranslation(data.translated);
        setLoading(false);
      });
    })();
  }, [challenge_id, jwtToken, text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1200);
  };

  return (
    <>
      {translateEngine ? (
        <div>
          <div className="fs-6 mt-1 p-2 ms-2">
            Suggestion:
            <span onClick={(e) => handleCopy(e)}>
              <span className="btn btn-sm btn-dark ms-1">
                {isLoading ? "Translating..." : translation}
              </span>
              <span className="btn btn-sm btn-light">
                <i className="fa fa-clone" aria-hidden="true"></i>
              </span>
            </span>
          </div>
          {isCopied ? alertComponent() : null}
        </div>
      ) : (
        <div className="mt-1 p-2 ps-3">
          <a
            className="btn btn-sm btn-secondary p-2 pt-1 pb-1"
            href={`https://translate.google.com/#view=home&op=translate&sl=en&tl=${translateTo}&text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Translate
            <i className="fa fa-external-link ms-1" aria-hidden="true"></i>
          </a>
        </div>
      )}
    </>
  );
};

export default TranslateComponent;
