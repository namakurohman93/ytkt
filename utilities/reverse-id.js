module.exports = function(cellId) {
  const x = (+cellId % 32768) - 16384
  const y = Math.floor(+cellId / 32768) - 16384

  return [x, y]
}
