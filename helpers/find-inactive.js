const sequelize = require("../models")
const { QueryTypes } = require("sequelize")

function findInactive(days, hours, evolution = 0) {
  return new Promise((resolve, reject) => {
    let query = `
      select p.id, p.name, p."kingdomId", p.tribeId, res.evolution from
      (
        select
          *,
          population - lag(population)
            over (partition by "playerId" order by "createdAt") as evolution
        from
        (
          select *, max("createdAt") over (partition by "playerId") as max,
          min("createdAt") over (partition by "playerId") as min
          from populations
          where
            strftime('%s', "createdAt")
              between strftime('%s', ?) and strftime('%s', ?)
        ) as res
        where "createdAt" = min or "createdAt" = max
      ) as res
      inner join players as p
      on p.id = res."playerId"
      where res."createdAt" = max and (res.evolution <= ? or res.evolution is null)
      order by res."playerId"
      limit 10 offset ?
    `

    sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [createDate(days, hours), createDate(), evolution, offset]
    })
      .then(resolve)
      .catch(reject)
  })
}

function createDate(days = 0, hours = 0) {
  let now = new Date()
  let diff = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000)
  let modDate = new Date(now.getTime() - diff)

  let [month, date, year] = modDate.toLocaleDateString().split("/")

  if (+month < 10) month = '0' + month
  if (+date < 10) date = '0' + date

  let time = modDate.toUTCString().split(" ")[4]

  return `${year}-${month}-${date} ${time}`
}

module.exports = findInactive
