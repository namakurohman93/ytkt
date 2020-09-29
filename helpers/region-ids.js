function cellId(x, y) {
  return (536887296 + x) + (y * 32768)
}

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
