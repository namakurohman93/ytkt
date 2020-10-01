import axios from "axios"

let httpClient

if (process.env.NODE_ENV == "development") {
  httpClient = axios.create({
    baseURL: "http://localhost:3000"
  })
} else httpClient = axios

export default httpClient
