import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./logo.png";

function App() {
  const [textToTranslateDetails, setTextToTranslateDetails] = useState()
  const [text, setText] = useState()

  const fetchData = (url) => {
    fetch(url)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setTextToTranslateDetails(data)
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = "http://localhost:5000/translate"
    const data = { text }
    fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        setTextToTranslateDetails(data)
      })
  }

  const handleInputChange = (e) => {
    setText(e.target.value)
  }

  const onSuggestionClick = (e) => {
    setText(e.target.innerText)
  }

  useEffect(() => {
    fetchData("http://localhost:5000/translate")
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
              <i class="fa fa-info-circle"></i>
            </span>
          </div>
          <a href="https://google.com" target="_blank" className="correct-text" rel="noopener noreferrer">correct text</a>
          <div className="translation-form">
            <form>
              <input
                type="text"
                id="user-translation"
              />
              <button type="submit">Submit translation</button>
              <div className="suggestion-component">
                <span>Suggestion:</span>
                <span
                  className="suggestion-text"
                  onClick={onSuggestionClick}
                >
                  नेपाल
                </span>
              </div>
              <button type="button">Skip</button>
            </form>
          </div>
        </header>
      )}
    </div>
  );
}

export default App;
