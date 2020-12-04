const reverseId = require("./reverse-id")

module.exports = function(tkCellId, x, y) {
  const [x1, y1] = reverseId(tkCellId)

  const width = Math.abs(x1 - x)
  const height = Math.abs(y1 - y)

  return Math.sqrt((width ** 2) + (height ** 2))
}
