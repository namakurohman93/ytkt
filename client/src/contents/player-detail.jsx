import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import CustomSpinner from "../components/custom-spinner"
import httpClient from "../utilities/http-client"

const tribes = ["", "Roman", "Teuton", "Gauls"]
const dateOptions = {
  hour12: false,
  hour: "2-digit",
  minute: "2-digit"
}

export default function PlayerDetail(props) {
  const { playerId } = props

  const [player, setPlayer] = useState(null)
  const [graphData, setGraphData] = useState({})

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
          let date = player.Populations[items[0].index].createdAt

          return new Date(date).toLocaleString("en-US", { hour12: false })
        }
      }
    }
  }

  useEffect(() => {
    httpClient
      .get(`/api/players/${playerId}`)
      .then(({ data }) => {
        const labels = data.Populations.map(pop => {
          return new Date(pop.createdAt).toLocaleString("en-US", dateOptions)
        })
        const datasets = [
          {
            label: "Population Change",
            data: data.Populations.map(pop => pop.population),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            lineTension: 0
          }
        ]

        setGraphData({ labels, datasets })
        setPlayer(data)
      })
      .catch(err => console.log(err))
  }, [])

  if (player === null) return <CustomSpinner message="fetching..." />

  return (
    <>
      <h1 className="text-info mb-0">
        {player.name} {player.isActive ? "" : "💤"}
      </h1>
      <span className="text-muted font-weight-lighter font-italic">
        {tribes[player.tribeId]}
      </span>
      <h5 className="text-muted font-weight-lighter">
        {player.kingdom ? player.kingdom + " Kingdom" : "No Kingdom"}
      </h5>

      <div className="my-2 text-center">
        <h3 className="text-info mb-3">Player Evolution</h3>
        <Line data={graphData} options={options} />
      </div>
    </>
  )
}
