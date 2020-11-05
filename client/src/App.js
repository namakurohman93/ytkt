import React, { useState, useEffect } from "react"
import axios from "./config/http-client"

import Home from "./pages/Home"
import Login from "./pages/Login"

function App() {
  let [ isLogin, setIsLogin ] = useState(null)

  useEffect(() => {
    axios.get("/api/status")
      .then(({ data }) => {
        if (process.env.NODE_ENV === "development") setIsLogin(true)
        else setIsLogin(data.response.isLogin)
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
