import axios from "redaxios"

const { NODE_ENV } = process.env

export default NODE_ENV === "development"
  ? axios.create({ baseURL: "http://localhost:3000" })
  : axios
