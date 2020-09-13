import React, { useState, useEffect } from "react"
import axios from "axios"
import logo from "./logo.svg"
import "./App.css"

function App() {
  let [email, setEmail] = useState(null)
  let [error, setError] = useState(null)

  useEffect(() => {
    axios.get("http://localhost:3000/api/login-status")
      .then(({ data }) => {
        if (data.response.isLogin) setEmail(data.response.email)
        else setEmail("Not Logged in")
      })
      .catch(err => setError("Error has happened"))
  })

  if (email === null) {
    return "Loading..."
  }

  if (error !== null) {
    return error
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p><code>{email}</code></p>
      </header>
    </div>
  )
}

export default App
