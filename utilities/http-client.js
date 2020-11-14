const axios = require('axios')

module.exports = axios.create({
  headers: {
    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:66.0) Gecko/20100101 Firefox/66.0",
  },
  withCredentials: true
})
