module.exports = function(days = 0, hours = 0, utc = true) {
  let now = new Date()
  let diff = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000)
  let modDate = new Date(now.getTime() - diff)

  let month, date, year, time

  if (utc) {
    month = modDate.getUTCMonth() + 1
    date = modDate.getUTCDate()
    year = modDate.getUTCFullYear()
    time = modDate.toUTCString().split(" ")[4]
  } else {
    [month, date, year] = modDate.toLocaleDateString().split("/")
    time = modDate.toLocaleTimeString().split(" ")[0]
  }

  if (+month < 10) month = '0' + month
  if (+date < 10) date = '0' + date

  return `${year}-${month}-${date} ${time}`
}
