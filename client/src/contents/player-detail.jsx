import { useState, useEffect } from "react"
import Table from "react-bootstrap/Table"
import { Line } from "react-chartjs-2"
import CustomSpinner from "../components/custom-spinner"
import httpClient from "../utilities/http-client"
import cellIdToCoordinate from "../utilities/cell-id-to-coordinate"

const transformData = villages => {
  const result = []

  villages.forEach(village => {
    village.Populations.forEach((population, idx) => {
      if (!result[idx]) result[idx] = 0
      result[idx] += population.population
    })
  })

  return result
}

export default function PlayerDetail(props) {
  const { playerId } = props

  const tribes = ["", "Roman", "Teuton", "Gauls"]
  const [ player, setPlayer ] = useState(null)
  const [ graphData, setGraphData ] = useState({})

  const options = {
    animation: {
      duration: 0
    },
    hover: {
      animationDuration: 0
    },
    tooltips: {
      callbacks: {
        title: function(items, data) {
          let date = player
            .Villages[0]
            .Populations[items[0].index]
            .createdAt

          return new Date(date)
            .toLocaleString("en-US", { "hour12": false })
        }
      }
    }
  }

  useEffect(() => {
    httpClient.get(`/api/players/${playerId}`)
      .then(({ data }) => {
        const labels = data.Villages[0].Populations.map(pop => {
          return new Date(pop.createdAt).toLocaleString("en-US", {
            "hour12": false, hour: "2-digit", minute: "2-digit"
          })
        })
        const datasets = [
          {
            label: "Population Change",
            data: transformData(data.Villages),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            lineTension: 0
          }
        ]

        setGraphData({ labels, datasets })
        setPlayer(data)
      })
      .catch(err => console.log(err))
  }, [playerId])

  if (player === null) return <CustomSpinner message="fetching..." />

  return (
    <>
      <div className="pt-3 px-5">
        <h1 className="text-info mb-0">
          {player.name} { player.isActive ? "" : "💤" }
        </h1>
        <span className="text-muted font-weight-lighter font-italic">
          {tribes[player.tribeId]}
        </span>
        <h5 className="text-muted font-weight-lighter">
          {
            player.Kingdom.name ? player.Kingdom.name + " Kingdom" : "No Kingdom"
          }
        </h5>
        <h3 className="text-info mt-5">Villages</h3>

        <Table bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Coordinate</th>
              <th>Population</th>
            </tr>
          </thead>
          <tbody>
            {player.Villages.map((village, i) => {
              return (
                <tr key={i}>
                  <td>
                    {village.name} - ({village.resType}) {village.owner === 0 ? "📍" : "🛡️"}
                  </td>
                  <td>{cellIdToCoordinate(village.tkCellId)}</td>
                  <td>
                    {village.Populations[village.Populations.length - 1].population}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>

      </div>

      <div className="my-5 text-center">
        <h3 className="text-info mb-3">Player Evolution</h3>
        <Line data={graphData} options={options} />
      </div>
    </>
  )
}
