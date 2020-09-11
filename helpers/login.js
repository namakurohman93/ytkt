const qs = require('qs')
const httpClient = require('./http-client')

function loginToLobby({ email, password }) {
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
        cookies = headers["set-cookie"].slice(2).map(parseCookie).join('') + `msid=${msid}; `
        lobbySession = headers.location.substring(headers.location.lastIndexOf("=") + 1)

        resolve({ msid, cookies, lobbySession })
      })
      .catch(reject)
  })
}

function loginToGameworld({ gameworldName, lobbySession, msid, cookies }) {
  return new Promise((resolve, reject) => {
    let token

    getGameworldId({ gameworldName, lobbySession, cookies })
      .then(gameworldId => {
        if (!gameworldId) throw new Error(`Gameworld ${gameworldName} is not found`)

        let options = {
          headers: { "Cookie": cookies },
          params: { msname: 'msid', msid },
        }

        return httpClient.get(
          `https://mellon-t5.traviangames.com/game-world/join/gameWorldId/${gameworldId}`,
          options
        )
      })
      .then(({ data }) => {
        let regex = /token=(\w+)&msid/mg
        token = regex.exec(data)[1]

        regex = /\b(https?:\/\/.*?\.[a-z]{2,4}\/[^\s]*\b)/g
        let url = data.match(regex)[1]

        let options = {
          method: "GET",
          headers: { "Cookie": cookies },
          url
        }

        return httpClient(options)
      })
      .then(_ => {
        let options = {
          method: "GET",
          maxRedirects: 0,
          validateStatus: status => status >= 200 && status < 303,
          headers: { "Cookie": cookies },
          params: { token, msid, msname: 'msid' },
          url: `https://${gameworldName}.kingdoms.com/api/login.php`
        }

        return httpClient(options)
      })
      .then(({ headers }) => {
        let fullCookies = cookies + headers["set-cookie"].map(parseCookie).join('')
        gameworldSession = headers.location.substring(headers.location.lastIndexOf("=") + 1)

        resolve({ msid, cookies: fullCookies, lobbySession, gameworldSession })
      })
      .catch(reject)
  })
}

function getGameworldId({ gameworldName, lobbySession, cookies }) {
  return new Promise((resolve, reject) => {
    let data = {
      action: "get",
      controller: "cache",
      params: {
        names: ["Collection:Avatar:"]
      },
      session: lobbySession
    }

    let options = { headers: { "Cookie": cookies } }

    httpClient.post(`https://lobby.kingdoms.com/api/index.php`, data, options)
      .then(({ data }) => {
        let gameworldId

        data.cache[0].data.cache.forEach(avatar => {
          if (avatar.data.worldName.toLowerCase() == gameworldName) {
            gameworldId = avatar.data.consumersId
          }
        })

        resolve(gameworldId)
      })
      .catch(reject)
  })
}

function parseCookie(cookie) {
  let uri = cookie.substring(0, cookie.indexOf(";") + 2)
  uri = uri.replace(new RegExp("%3A", "g"), ":")
  uri = uri.replace(new RegExp("%2C", "g"), ",")
  uri = decodeURI(uri)

  return uri
}

function authenticate({ email, password, gameworld }) {
  return new Promise((resolve, reject) => {
    loginToLobby({ email, password })
      .then(session => loginToGameworld({ ...session, gameworldName: gameworld }))
      .then(resolve)
      .catch(reject)
  })
}

module.exports = authenticate
