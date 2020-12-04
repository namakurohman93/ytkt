const requestMapData = require("./request-map-data")
const reverseId = require("../utilities/reverse-id")
const cellId = require("../utilities/cell-id")

module.exports = function() {
  return new Promise((resolve, reject) => {
    requestMapData()
      .then(data => {
        const croppers = []
        const oases = {}

        Object.keys(data.response["1"].region).forEach(regionId => {
          data.response["1"].region[regionId].forEach(cell => {
            if (cell.resType && (cell.resType == "3339" || cell.resType == "11115")) {
              const temp = {
                id: cell.id,
                resType: cell.resType,
                bonusOases: []
              }

              if (cell.playerId) {
                temp.active = data.response["1"].player[cell.playerId].active
              }

              if (cell.village) temp.name = cell.village.name

              croppers.push(temp)
            }

            if (cell.oasis) oases[cell.id] = cell.oasis.bonus["4"]
          })
        })

        croppers.forEach(cropper => {
          const [ x1, y1 ] = reverseId(cropper.id)

          for (let x = x1 - 3; x < x1 + 4; x++) {
            for (let y = y1 - 3; y < y1 + 4; y++) {
              if (oases[cellId(x, y)] != undefined) {
                cropper.bonusOases.push(oases[cellId(x, y)])
              }
            }
          }

          cropper.bonusOases = cropper.bonusOases
            .sort((a, b) => a - b)
            .filter((_, index) => index < 3)
            .reduce((a, oasis) => a + oasis, 0)
        })

        resolve(croppers)
      })
      .catch(reject)
  })
}
