import { useState, useEffect } from "react"
import axios from "axios"

export default function useIsLogin() {
  let [ isLogin, setIsLogin ] = useState(null)

  useEffect(() => {
    console.log(`
      i dont know what happen but useEffect on useIsLogin hooks is called
      and most likely, axios is called too
      `
    )
    axios.get('http://localhost:3000/api/login-status')
      .then(({ data }) => {
        console.log('done fetching data')
        setIsLogin(data.response.isLogin)
      })
      .catch(err => {
        console.log(err)
        console.log('Error happening on useIsLogin hooks')
      })
  }, [isLogin])

  return isLogin
}
