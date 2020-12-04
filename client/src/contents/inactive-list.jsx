import { useState } from "react"
import Table from "react-bootstrap/Table"
import Button from "react-bootstrap/Button"
import cellIdToCoordinate from "../utilities/cell-id-to-coordinate"
import distance from "../utilities/distance"

export default function InactiveList(props) {
  const { inactiveList, setInactiveList, x, y } = props
  const tribes = ["", "Roman", "Teuton", "Gauls"]

  const [page, setPage] = useState(1)

  const buttonHandler = type => {
    if (type === "-") {
      if (page > 0) setPage(page - 1)
    } else if (type === "+") {
      setPage(page + 1)
    } else console.log("Unknown type")
  }

  return (
    <div className="pt-1">
      <p>
        <Button size="sm" variant="info" onClick={() => buttonHandler("-")}>
          ◀️
        </Button>{" "}
        <Button size="sm" variant="info" onClick={() => buttonHandler("+")}>
          ▶️
        </Button>
      </p>
      <Table bordered hover size="sm">
        <thead>
          <tr>
            <th>No</th>
            <th>Coordinate</th>
            <th>Distance</th>
            <th>Name</th>
            <th>Population</th>
            <th>Player Evolution</th>
            <th>Tribe</th>
            <th>Player</th>
            <th>Kingdom</th>
          </tr>
        </thead>
        <tbody>
          {inactiveList.map((village, i) => {
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{cellIdToCoordinate(village.tkCellId)}</td>
                <td>{distance(village.tkCellId, x, y).toFixed(1)}</td>
                <td>
                  {village.name} - ({village.resType}){" "}
                  {village.owner === 0 ? "📍" : "🛡️"}
                </td>
                <td>{village.population}</td>
                <td>{village.playerEvolution}</td>
                <td>{tribes[village.tribeId]}</td>
                <td>
                  {village.playerName} {village.isActive ? "" : "💤"}
                </td>
                <td>
                  {village.kingdom === "" ? "No Kingdom" : village.kingdom}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}
