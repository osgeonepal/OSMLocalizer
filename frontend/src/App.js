import React, { useEffect, useState } from "react"
import "./App.css"

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
            <h3>
              Text to translate: {textToTranslateDetails.text}
            </h3>
            <p>This word appeared {textToTranslateDetails.count} times in your region</p>
            <input type="text" onChange={handleInputChange} value={text}/>
            <div>
              <span>Suggestion:</span>
              <span 
                className="suggestion"
                onClick={onSuggestionClick}
                >
                  नेपाल
              </span>
            </div>
            <button onClick={handleSubmit}>Translate</button>
            <button>Skip</button>
          </header>
        )}
    </div>
  );
}

export default App;
