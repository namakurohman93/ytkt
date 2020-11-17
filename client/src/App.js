import { useState, useEffect } from "react"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import CustomSpinner from "./components/custom-spinner"
import httpClient from "./utilities/http-client"

const { NODE_ENV } = process.env

export default function App() {
  const [ isLogin, setIsLogin ] = useState(null)
  const [ skipLogin, setSkipLogin ] = useState(false)

  useEffect(() => {
    if (skipLogin && NODE_ENV === "development") setIsLogin(true)
    else {
      httpClient.get("/api/status")
        .then(({ data }) => setIsLogin(data.response.isLogin))
        .catch(err => {
          setIsLogin(false)
          console.log(err)
          console.log("Error happened when checking login status")
        })
    }
  }, [isLogin, skipLogin])

  if (isLogin === null) return <CustomSpinner />

  return (
    isLogin
    ? <HomePage />
    : <LoginPage
        setIsLogin={value => setIsLogin(value)}
        setSkipLogin={value => setSkipLogin(value)}
      />
  )
}
