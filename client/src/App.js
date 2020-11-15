import { useState, useEffect } from "react"
import LoginPage from "./pages/LoginPage"
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
          console.log(err)
          console.log("Error happened when checking login status")
        })
    }
  }, [isLogin, skipLogin])

  if (isLogin === null) return "Loading..."

  return (
    <>
      {
        isLogin
        ? "Login true"
        : <LoginPage
            setIsLogin={value => setIsLogin(value)}
            setSkipLogin={value => setSkipLogin(value)}
          />
      }
    </>
  )
}
