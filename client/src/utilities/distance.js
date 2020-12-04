export default function distance(tkCellId, x, y) {
  const x1 = (+tkCellId % 32768) - 16384
  const y1 = Math.floor(+tkCellId / 32768) - 16384

  const width = Math.abs(x1 - x)
  const height = Math.abs(y1 - y)

  return Math.sqrt(width ** 2 + height ** 2)
}
