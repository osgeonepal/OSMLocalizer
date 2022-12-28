import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./logo.png";

function App() {
  const [textToTranslateDetails, setTextToTranslateDetails] = useState()
  const [translatedText, setTranslatedText] = useState()

  // Write a code to post the user translation to the backend i.e. http://localhost:5000/translate
  const submitTranslation = (translation) => {
    fetch("http://localhost:5000/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: textToTranslateDetails.id,
        text_ne: translation,
        status: "TRANSLATED",
      })
    }).then(response => {
      return response.json()
    }).then(data => {
      console.log(data)
    })
  }

  const fetchTextToTranslate = (url) => {
    fetch(url)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setTextToTranslateDetails(data)
      })
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    submitTranslation(translatedText).then(() => {
    fetchTextToTranslate("http://localhost:5000/translate")
    })
  }

  const handleInputChange = (e) => {
    setTranslatedText(e.target.value)
  }

  const onSuggestionClick = (e) => {
    setTranslatedText(e.target.innerText)
  }

  const skipTranslation = () => {
    fetchTextToTranslate("http://localhost:5000/translate")
  }

  useEffect(() => {
    fetchTextToTranslate("http://localhost:5000/translate")
  }, [])

  return (
    <div className="App">
      {textToTranslateDetails && (
        <header className="App-header">
          <div className="banner">
            <img
              className="banner-logo"
              src={logo}
              alt="logo"
            />
            <span
              className="banner-name"
            >
              OSM LOCALIZER
            </span>
          </div>
          <div className="translate-text-component">
            <div className="translate-component">
              <span className="translate-title">Translate:</span>
              <span className="translate-text">
                {textToTranslateDetails.text}
              </span>
              <span
                className="info-icon"
                data-bs-toggle="tooltip"
                data-bs-html="true"
                title={`Word count: ${textToTranslateDetails.count}. Click on the icon for more details.`}
              >
                <i className="fa fa-info-circle"></i>
              </span>
            </div>
            <a href="https://google.com" target="_blank" className="correct-text" rel="noopener noreferrer">correct text</a>
          </div>
          <div className="translation-form">
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                id="user-translation"
                value={translatedText}
                onChange={handleInputChange}
              />
              <button type="submit">Submit translation</button>
            </form>
          </div>
          <div className="suggestion-component">
            <span>Suggestion:</span>
            <span
              className="suggestion-text"
              onClick={onSuggestionClick}
            >
              {textToTranslateDetails["google_translate"]}
            </span>
          </div>
          <button onClick={skipTranslation} className="skip-button" type="button">Skip</button>
        </header>
      )}
    </div>
  );
}

export default App;
