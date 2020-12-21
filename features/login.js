const qs = require("qs")
const httpClient = require("../utilities/http-client")

function loginToLobby({ email, password }) {
  return new Promise((resolve, reject) => {
    let msid, token

    httpClient.get(`https://mellon-t5.traviangames.com/authentication/login/ajax/form-validate?`)
      .then(({ data }) => {
        let regex = /msid=(\w+)&msname/gm
        msid = regex.exec(data)[1]

        let options = {
          method: "POST",
          params: { msid, msname: "msid" },
          data: qs.stringify({ email, password }),
          headers: { "content-type": "application/x-www-form-urlencoded" },
          url: `https://mellon-t5.traviangames.com/authentication/login/ajax/form-validate`
        }

        return httpClient(options)
      })
      .then(({ data }) => {
        token = getToken(data)

        let options = {
          method: "GET",
          maxRedirects: 0,
          params: { token, msid, msname: "msid" },
          url: `http://lobby.kingdoms.com/api/login.php`,
          validateStatus: status => status >= 200 && status < 303
        }

        return httpClient(options)
      })
      .then(({ headers }) => {
        let options = {
          method: "GET",
          maxRedirects: 0,
          url: headers.location,
          params: { token, msid, msname: "msid" },
          validateStatus: status => status >= 200 && status < 303
        }

        return httpClient(options)
      })
      .then(({ headers }) => {
        let cookies = headers["set-cookie"]
          .slice(2)
          .map(parseCookie)
          .join("") + `msid=${msid}; `
        let lobbySession = headers.location
          .substring(headers.location.lastIndexOf("=") + 1)

        resolve({ msid, cookies, lobbySession })
      })
      .catch(reject)
  })
}

function loginToGameworld({ gameworldName, lobbySession, msid, cookies }) {
  return new Promise((resolve, reject) => {
    getGameworldId({ gameworldName, lobbySession, cookies })
      .then(gameworldId => {
        if (!gameworldId)
          throw new Error(`Gameworld ${gameworldName} is not found`)

        let options = {
          headers: { Cookie: cookies },
          params: { msname: "msid", msid }
        }

        return httpClient.get(
          `https://mellon-t5.traviangames.com/game-world/join/gameWorldId/${gameworldId}`,
          options
        )
      })
      .then(({ data }) => step2Login({ data, gameworldName, lobbySession, msid, cookies }))
      .then(resolve)
      .catch(reject)
  })
}

// login to gameworld as guest
function _LTGAG({ gameworldName, avatarName, lobbySession, msid, cookies }) {
  return new Promise((resolve, reject) => {
    getAvatarId({ gameworldName, avatarName, lobbySession, cookies })
      .then(avatarId => {
        if (!avatarId) throw new Error(`Avatar ${avatarName} not found`)

        let options = {
          headers: { Cookie: cookies },
          params: { msname: "msid", msid }
        }

        return httpClient.get(
          `https://mellon-t5.traviangames.com/game-world/join-as-guest/avatarId/${avatarId}`,
          options
        )
      })
      .then(({ data }) => step2Login({ data, gameworldName, lobbySession, msid, cookies }))
      .then(resolve)
      .catch(reject)
  })
}

function step2Login({ data, gameworldName, lobbySession, msid, cookies }) {
  return new Promise((resolve, reject) => {
    let token = getToken(data)

    let regex = /\b(https?:\/\/.*?\.[a-z]{2,4}\/[^\s]*\b)/g
    let url = data.match(regex)[1]

    let options = {
      url,
      method: "GET",
      headers: { Cookie: cookies }
    }

    httpClient(options)
      .then(_ => {
        let options = {
          method: "GET",
          maxRedirects: 0,
          headers: { Cookie: cookies },
          params: { token, msid, msname: "msid" },
          validateStatus: status => status >= 200 && status < 303,
          url: `https://${gameworldName}.kingdoms.com/api/login.php`
        }

        return httpClient(options)
      })
      .then(({ headers }) => {
        let fullCookies =
          cookies + headers["set-cookie"].map(parseCookie).join("")
        let gameworldSession = headers.location.substring(
          headers.location.lastIndexOf("=") + 1
        )

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
      params: { names: ["Collection:Avatar:"] },
      session: lobbySession
    }

    let options = { headers: { Cookie: cookies } }

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

function getAvatarId({ gameworldName, lobbySession, cookies, avatarName }) {
  return new Promise((resolve, reject) => {
    let data = {
      action: "get",
      controller: "cache",
      params: { names: ["Collection:Sitter:4"] },
      session: lobbySession
    }

    let options = { headers: { Cookie: cookies } }

    httpClient.post(`https://lobby.kingdoms.com/api/index.php`, data, options)
      .then(({ data }) => {
        let avatarId

        data.cache[0].data.cache.forEach(avatar => {
          if (
            avatar.data.avatarName == avatarName &&
            avatar.data.worldName.toLowerCase() == gameworldName
          ) {
            avatarId = avatar.data.avatarIdentifier
          }
        })

        resolve(avatarId)
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

function authenticate({ email, password, gameworld, isDual, avatarName }) {
  return new Promise((resolve, reject) => {
    loginToLobby({ email, password })
      .then(session => {
        if (isDual) {
          return _LTGAG({
            ...session,
            gameworldName: gameworld,
            avatarName
          })
        } else return loginToGameworld({ ...session, gameworldName: gameworld })
      })
      .then(resolve)
      .catch(reject)
  })
}

function getToken(rawHtml) {
  let regex = /token=(\w+)&msid/gm
  return regex.exec(rawHtml)[1]
}

module.exports = authenticate
