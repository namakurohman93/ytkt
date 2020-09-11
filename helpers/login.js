const qs = require('qs')
const axios = require('axios')

const httpClient = axios.create({
  headers: {
    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:66.0) Gecko/20100101 Firefox/66.0",
  },
  withCredentials: true
})

function loginToLobby(email, password) {
  return new Promise((resolve, reject) => {
    let msid, token

    httpClient.get(`https://mellon-t5.traviangames.com/authentication/login/ajax/form-validate?`)
      .then(({ data }) => {
        let regex = /msid=(\w+)&msname/mg
        msid = regex.exec(data)[1]

        let options = {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: qs.stringify({ email, password }),
          params: { msid, msname: 'msid' },
          url: `https://mellon-t5.traviangames.com/authentication/login/ajax/form-validate`
        }

        return httpClient(options)
      })
      .then(({ data }) => {
        let regex = /token=(\w+)&msid/mg
        token = regex.exec(data)[1]

        let options = {
          method: "GET",
          maxRedirects: 0,
          validateStatus: status => status >= 200 && status < 303,
          params: { token, msid, msname: 'msid' },
          url: `http://lobby.kingdoms.com/api/login.php`
        }

        return httpClient(options)
      })
      .then(({ headers }) => {
        let options = {
          method: "GET",
          maxRedirects: 0,
          validateStatus: status => status >= 200 && status < 303,
          params: { token, msid, msname: 'msid' },
          url: headers.location
        }

        return httpClient(options)
      })
      .then(({ headers }) => {
        cookies = headers["set-cookie"]
          .slice(2)
          .map(cookie => {
            let uri = cookie.substring(0, cookie.indexOf(";") + 2)
            uri = uri.replace(new RegExp("%3A", "g"), ":")
            uri = uri.replace(new RegExp("%2C", "g"), ",")
            uri = decodeURI(uri)

            return uri
          })
          .join('')
        cookies += `msid=${msid}; `

        lobbySession = headers.location.substring(headers.location.lastIndexOf("=") + 1)

        resolve({ msid, cookies, lobbySession })
      })
      .catch(reject)
  })
}

function loginToGameworld(gameworldName) {
  //
}

module.exports = { loginToLobby, loginToGameworld }
