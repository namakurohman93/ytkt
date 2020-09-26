import React, { useState, useEffect } from "react"
import axios from "axios"

import Login from "./pages/Login"
import Home from "./pages/Home"

function App() {
  let [ email, setEmail ] = useState(null)
  let [ isLogin, setIsLogin ] = useState(null)

  useEffect(() => {
    axios.get("http://localhost:3000/api/login-status")
      .then(({ data }) => {
        setEmail(data.response.email)
        setIsLogin(data.response.isLogin)
      })
      .catch(err => {
        console.log(err)
        console.log('error happened useEffect on App')
      })
  }, [isLogin, email])

  if (isLogin == null) return "Loading..."

  return (
    <>
    {
      isLogin
      ? <Home />
      : <Login
          setEmail={val => setEmail(val)}
          setIsLogin={val => setIsLogin(val)}
        />
    }
    </>
  )
}

export default App
