const cellId = require("./cell-id")

function generateRegionIds() {
  let result = []

  for (let x = -13; x < 14; x++) {
    for (let y = -13; y < 14; y++) {
      result.push(cellId(x, y))
    }
  }

  return result
}

module.exports = generateRegionIds()
