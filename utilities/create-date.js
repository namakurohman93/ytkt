module.exports = function(days = 0, hours = 0) {
  let now = new Date()
  let diff = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000)
  let modDate = new Date(now.getTime() - diff)

  let [month, date, year] = modDate.toLocaleDateString().split("/")

  if (+month < 10) month = '0' + month
  if (+date < 10) date = '0' + date

  let time = modDate.toUTCString().split(" ")[4]

  return `${year}-${month}-${date} ${time}`
}
