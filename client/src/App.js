import React, { useState, useEffect } from "react"
import axios from "axios"

import Home from "./pages/Home"
import Login from "./pages/Login"

function App() {
  let [ isLogin, setIsLogin ] = useState(null)

  useEffect(() => {
    axios.get("http://localhost:3000/api/status")
      .then(({ data }) => {
        setIsLogin(data.response.isLogin)
      })
      .catch(err => {
        console.log(err)
        console.log('error happened useEffect on App')
      })
  }, [isLogin])

  if (isLogin == null) return "Loading..."

  return (
    <>
    {
      isLogin
      ? <Home />
      : <Login
          setIsLogin={val => setIsLogin(val)}
        />
    }
    </>
  )
}

export default App
