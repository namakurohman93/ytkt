import React, { useState, useEffect } from "react"
import { Line, defaults } from "react-chartjs-2"
import axios from "../config/http-client"

defaults.global.defaultFontColor = "white"

export default function Player({ playerId }) {
  let [ player, setPlayer ] = useState(null)

  let options = {
    animation: {
      duration: 0
    },
    hover: {
      animationDuration: 0
    },
    responsiveAnimationDuration: 0
  }

  useEffect(() => {
    axios.get(`/api/players/${playerId}`)
      .then(({ data }) => {
        data.data = {
          labels: data.populations.map(pop => new Date(pop.createdAt).toLocaleString()),
          datasets: [
            {
              label: "Population changes",
              data: data.populations.map(pop => pop.population),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              lineTension: 0
            }
          ]
        }
        setPlayer(data)
      })
      .catch(err => console.log("Error happen when fetching player by id"))
  }, [playerId])

  if (player == null) return "Loading..."

  return (
    <>
      <div className="mt-12 px-32">
        <div className="px-64">
          <h1 className="font-bold text-white text-2xl md:text-5xl leading-tight">
            Player Detail: { player.name }
          </h1>
        </div>
      </div>
      <div className="px-12 pb-12">
        <Line data={player.data} options={options}/>
      </div>
    </>
  )
}
